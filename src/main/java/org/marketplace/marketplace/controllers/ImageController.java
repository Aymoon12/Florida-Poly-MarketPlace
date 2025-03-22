package org.marketplace.marketplace.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.marketplace.marketplace.dto.ImageUploadUrlDto;
import org.marketplace.marketplace.dto.PresignedUrlsDto;
import org.marketplace.marketplace.services.S3Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("api/v1/images")
@CrossOrigin
@RequiredArgsConstructor
@Log4j2
public class ImageController {

    private final S3Service s3Service;

    /**
     * Generate a pre-signed URL for direct upload to S3 from the client
     * @param itemId The ID of the item
     * @param contentType The content type of the file to be uploaded
     * @return A presigned URL for uploading
     */
    @GetMapping("/upload-url")
    public ResponseEntity<ImageUploadUrlDto> getUploadUrl(
            @RequestParam("itemId") Long itemId,
            @RequestParam("contentType") String contentType) {
        
        String uploadUrl = s3Service.generatePresignedUploadUrl(itemId, contentType);
        return ResponseEntity.ok(new ImageUploadUrlDto(uploadUrl));
    }

    /**
     * Alternative approach: Upload file through the server
     * @param itemId The ID of the item
     * @param file The file to upload
     * @return Success message
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("itemId") Long itemId,
            @RequestParam("file") MultipartFile file) {
        
        s3Service.uploadFile(itemId, file);
        return ResponseEntity.ok("File uploaded successfully");
    }

    /**
     * Get all image URLs for an item
     * @param itemId The ID of the item
     * @return List of presigned URLs for viewing images
     */
    @GetMapping("/{itemId}")
    public ResponseEntity<PresignedUrlsDto> getItemImages(@PathVariable Long itemId) {
        List<String> imageUrls = s3Service.getItemImagesUrls(itemId);
        return ResponseEntity.ok(new PresignedUrlsDto(imageUrls));
    }

    /**
     * Delete all images for an item
     * @param itemId The ID of the item
     * @return Success message
     */
    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> deleteItemImages(@PathVariable Long itemId) {
        s3Service.deleteItemImages(itemId);
        return ResponseEntity.ok("Images deleted successfully");
    }
} 