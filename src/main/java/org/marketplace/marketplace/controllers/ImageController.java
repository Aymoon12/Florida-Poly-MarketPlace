package org.marketplace.marketplace.controllers;

import java.util.List;

import org.marketplace.marketplace.auth.config.AuthenticationUtil;
import org.marketplace.marketplace.dto.ImageUploadUrlDto;
import org.marketplace.marketplace.dto.PresignedUrlsDto;
import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.repository.ItemRepository;
import org.marketplace.marketplace.services.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("api/v1/images")
@CrossOrigin
@RequiredArgsConstructor
@Log4j2
public class ImageController {

    private final S3Service s3Service;
    private final ItemRepository itemRepository;

    /**
     * Generate a pre-signed URL for direct upload to S3 from the client.
     * Only the item owner can upload images.
     *
     * @param itemId The ID of the item
     * @param contentType The content type of the file to be uploaded
     * @return A presigned URL for uploading
     */
    @GetMapping("/upload-url")
    public ResponseEntity<ImageUploadUrlDto> getUploadUrl(
            @RequestParam("itemId") @NotNull Long itemId,
            @RequestParam("contentType") @NotBlank String contentType) {

        // Verify user owns the item
        verifyItemOwnership(itemId);

        String uploadUrl = s3Service.generatePresignedUploadUrl(itemId, contentType);
        return ResponseEntity.ok(new ImageUploadUrlDto(uploadUrl));
    }

    /**
     * Upload file through the server.
     * Only the item owner can upload images.
     *
     * @param itemId The ID of the item
     * @param file The file to upload
     * @return Success message
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("itemId") @NotNull Long itemId,
            @RequestParam("file") @NotNull MultipartFile file) {

        // Verify user owns the item
        verifyItemOwnership(itemId);

        s3Service.uploadFile(itemId, file);
        log.info("File uploaded for item {} by user {}", itemId, AuthenticationUtil.getCurrentUserId());
        return ResponseEntity.ok("File uploaded successfully");
    }

    /**
     * Get all image URLs for an item.
     * Public endpoint - anyone can view item images.
     *
     * @param itemId The ID of the item
     * @return List of presigned URLs for viewing images
     */
    @GetMapping("/{itemId}")
    public ResponseEntity<PresignedUrlsDto> getItemImages(@PathVariable Long itemId) {
        List<String> imageUrls = s3Service.getItemImagesUrls(itemId);
        return ResponseEntity.ok(new PresignedUrlsDto(imageUrls));
    }

    /**
     * Delete all images for an item.
     * Only the item owner can delete images.
     *
     * @param itemId The ID of the item
     * @return Success message
     */
    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteItemImages(@PathVariable Long itemId) {

        // Verify user owns the item
        verifyItemOwnership(itemId);

        s3Service.deleteItemImages(itemId);
        log.info("Images deleted for item {} by user {}", itemId, AuthenticationUtil.getCurrentUserId());
        return ResponseEntity.ok("Images deleted successfully");
    }

    /**
     * Verify that the current user owns the specified item.
     *
     * @param itemId The item ID to check
     * @throws EntityNotFoundException if item doesn't exist
     * @throws AccessDeniedException if user doesn't own the item
     */
    private void verifyItemOwnership(Long itemId) {
        Long userId = AuthenticationUtil.getCurrentUserId();

        Item item = itemRepository.findItemById(itemId)
                .orElseThrow(() -> new EntityNotFoundException("Item not found: " + itemId));

        if (!item.getUser().getID().equals(userId)) {
            log.warn("User {} attempted to access images for item {} owned by user {}",
                    userId, itemId, item.getUser().getID());
            throw new AccessDeniedException("You do not have permission to modify images for this item");
        }
    }
}
