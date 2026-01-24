package org.marketplace.marketplace.services;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.jetbrains.annotations.NotNull;
import org.marketplace.marketplace.dto.ItemDto;
import org.marketplace.marketplace.entities.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3ObjectSummary;

import lombok.extern.log4j.Log4j2;

@Service
@Log4j2
public class S3Service {

	@Autowired
	private AmazonS3 s3Client;

	@Autowired
	@Lazy
	private S3Service s3Service;

	@Value( "${aws.s3.bucket.name}" )
	private String bucketName;

	@Value( "${aws.s3.presigned-url.expiry:900000}" )
	private long presignedUrlExpiry; // Default 15 minutes in milliseconds

	// Allowed content types for image uploads
	private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
			"image/jpeg",
			"image/png",
			"image/webp",
			"image/gif"
	);

	// Maximum file size: 10MB
	private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

	// Magic number signatures for image file types
	private static final byte[] JPEG_MAGIC = new byte[] { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF };
	private static final byte[] PNG_MAGIC = new byte[] { (byte) 0x89, 0x50, 0x4E, 0x47 };
	private static final byte[] GIF_MAGIC = "GIF".getBytes();
	private static final byte[] WEBP_MAGIC = "RIFF".getBytes();

	/**
	 * Validate content type against whitelist.
	 *
	 * @param contentType
	 *            The content type to validate
	 * @throws IllegalArgumentException
	 *             if content type is not allowed
	 */
	public void validateContentType( String contentType ) {

		if ( contentType == null || !ALLOWED_CONTENT_TYPES.contains( contentType.toLowerCase() ) ) {
			throw new IllegalArgumentException(
					"Invalid content type: " + contentType + ". Allowed types: " + ALLOWED_CONTENT_TYPES );
		}
	}

	/**
	 * Validate file size against maximum limit.
	 *
	 * @param size
	 *            The file size in bytes
	 * @throws IllegalArgumentException
	 *             if file size exceeds limit
	 */
	public void validateFileSize( long size ) {

		if ( size > MAX_FILE_SIZE ) {
			throw new IllegalArgumentException(
					"File size exceeds maximum limit of " + ( MAX_FILE_SIZE / ( 1024 * 1024 ) ) + "MB" );
		}
		if ( size <= 0 ) {
			throw new IllegalArgumentException( "File size must be greater than 0" );
		}
	}

	/**
	 * Validate file content by checking magic numbers.
	 *
	 * @param file
	 *            The file to validate
	 * @throws IllegalArgumentException
	 *             if file content doesn't match expected image format
	 */
	public void validateFileContent( MultipartFile file ) {

		try ( InputStream inputStream = file.getInputStream() ) {
			byte[] header = new byte[12];
			int bytesRead = inputStream.read( header );

			if ( bytesRead < 4 ) {
				throw new IllegalArgumentException( "File is too small to be a valid image" );
			}

			if ( !isValidImageMagicNumber( header ) ) {
				throw new IllegalArgumentException( "File content does not match a valid image format" );
			}
		} catch ( IOException e ) {
			throw new IllegalArgumentException( "Unable to read file content for validation", e );
		}
	}

	private boolean isValidImageMagicNumber( byte[] header ) {

		// Check JPEG
		if ( startsWith( header, JPEG_MAGIC ) ) {
			return true;
		}
		// Check PNG
		if ( startsWith( header, PNG_MAGIC ) ) {
			return true;
		}
		// Check GIF
		if ( startsWith( header, GIF_MAGIC ) ) {
			return true;
		}
		// Check WebP (RIFF....WEBP)
		if ( startsWith( header, WEBP_MAGIC ) && header.length >= 12 ) {
			byte[] webpSignature = Arrays.copyOfRange( header, 8, 12 );
			return "WEBP".equals( new String( webpSignature ) );
		}
		return false;
	}

	private boolean startsWith( byte[] array, byte[] prefix ) {

		if ( array.length < prefix.length ) {
			return false;
		}
		for ( int i = 0; i < prefix.length; i++ ) {
			if ( array[i] != prefix[i] ) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Generate a pre-signed URL for uploading an image directly from the browser
	 *
	 * @param itemId
	 *            The item ID this image is for
	 * @param contentType
	 *            The content type of the file (e.g., image/jpeg)
	 * @return A pre-signed URL for PUT operation to upload an image
	 */
	public String generatePresignedUploadUrl( Long itemId, String contentType ) {

		// Validate content type before generating URL
		validateContentType( contentType );

		try {
			String fileName = generateFileName( itemId, contentType );
			String objectKey = "items/" + itemId + "/" + fileName;

			// Set the expiration time for the URL
			Date expiration = new Date();
			expiration.setTime( expiration.getTime() + presignedUrlExpiry );

			// Create request headers
			GeneratePresignedUrlRequest generatePresignedUrlRequest =
					new GeneratePresignedUrlRequest( bucketName, objectKey ).withMethod( HttpMethod.PUT )
							.withExpiration( expiration );

			// Set content-type explicitly as a request parameter to ensure it's included in signature
			generatePresignedUrlRequest.addRequestParameter( "Content-Type", contentType );

			URL url = s3Client.generatePresignedUrl( generatePresignedUrlRequest );
			log.info( "Generated presigned upload URL for item: {}, URL: {}", itemId, url );

			return url.toString();
		} catch ( Exception e ) {
			log.error( "Error generating presigned upload URL: {}", e.getMessage(), e );
			throw new RuntimeException( "Failed to generate presigned upload URL", e );
		}
	}

	/**
	 * Upload a file directly to S3 from the server. Evicts the image cache for this item.
	 *
	 * @param itemId
	 *            The item ID this image is for
	 * @param file
	 *            The file to upload
	 */
	@CacheEvict( value = "itemImages", key = "#itemId" )
	public void uploadFile( Long itemId, MultipartFile file ) {

		// Validate file before upload
		validateContentType( file.getContentType() );
		validateFileSize( file.getSize() );
		validateFileContent( file );

		try {
			String fileName = generateFileName( itemId, file.getContentType() );
			String objectKey = "items/" + itemId + "/" + fileName;

			ObjectMetadata metadata = new ObjectMetadata();
			metadata.setContentType( file.getContentType() );
			metadata.setContentLength( file.getSize() );

			s3Client.putObject( bucketName, objectKey, file.getInputStream(), metadata );

			log.info( "Successfully uploaded file for item: {}, key: {}", itemId, objectKey );
		} catch ( IOException e ) {
			log.error( "Error uploading file: {}", e.getMessage(), e );
			throw new RuntimeException( "Failed to upload file", e );
		}
	}

	/**
	 * Generate presigned URLs for retrieving images for an item. Results are cached for 10 minutes.
	 *
	 * @param itemId
	 *            The item ID
	 * @return List of presigned URLs for GET operation
	 */
	@Cacheable( value = "itemImages", key = "#itemId" )
	public List<String> getItemImagesUrls( Long itemId ) {

		try {
			// List objects in the item's directory
			List<String> objectKeys = s3Client.listObjects( bucketName, "items/" + itemId + "/" ).getObjectSummaries()
					.stream().map( S3ObjectSummary::getKey ).toList();

			// If no images found, return empty list
			if ( objectKeys.isEmpty() ) {
				log.info( "No images found for item: {}", itemId );
				return List.of();
			}

			// Generate presigned URLs for each object
			List<String> presignedUrls =
					objectKeys.stream().map( this::generatePresignedGetUrl ).collect( Collectors.toList() );

			log.info( "Generated {} presigned image URLs for item: {}", presignedUrls.size(), itemId );
			return presignedUrls;
		} catch ( Exception e ) {
			log.error( "Error generating presigned image URLs: {}", e.getMessage(), e );
			// Return empty list instead of throwing exception to avoid cascading failures
			return List.of();
		}
	}

	/**
	 * Get a presigned URL for a single image
	 *
	 * @param objectKey
	 *            The S3 object key
	 * @return Presigned URL for GET operation
	 */
	public String generatePresignedGetUrl( String objectKey ) {

		try {
			// Set the expiration time for the URL
			Date expiration = new Date();
			expiration.setTime( expiration.getTime() + presignedUrlExpiry );

			// Generate the presigned URL
			GeneratePresignedUrlRequest generatePresignedUrlRequest =
					new GeneratePresignedUrlRequest( bucketName, objectKey ).withMethod( HttpMethod.GET )
							.withExpiration( expiration );

			URL url = s3Client.generatePresignedUrl( generatePresignedUrlRequest );
			return url.toString();
		} catch ( Exception e ) {
			log.error( "Error generating presigned GET URL: {}", e.getMessage(), e );
			throw new RuntimeException( "Failed to generate presigned GET URL", e );
		}
	}

	/**
	 * Delete all images associated with an item. Also evicts the cache entry.
	 *
	 * @param itemId
	 *            The item ID
	 */
	@CacheEvict( value = "itemImages", key = "#itemId" )
	public void deleteItemImages( Long itemId ) {

		try {
			// List objects in the item's directory
			List<String> objectKeys = s3Client.listObjects( bucketName, "items/" + itemId + "/" ).getObjectSummaries()
					.stream().map( S3ObjectSummary::getKey ).toList();

			// Delete each object
			for ( String key : objectKeys ) {
				s3Client.deleteObject( bucketName, key );
			}

			log.info( "Deleted {} images for item: {}", objectKeys.size(), itemId );
		} catch ( Exception e ) {
			log.error( "Error deleting item images: {}", e.getMessage(), e );
			throw new RuntimeException( "Failed to delete item images", e );
		}
	}

	/**
	 * Evict the image cache for a specific item. Useful when images are uploaded via presigned URL.
	 *
	 * @param itemId
	 *            The item ID
	 */
	@CacheEvict( value = "itemImages", key = "#itemId" )
	public void evictImageCache( Long itemId ) {

		log.info( "Evicted image cache for item: {}", itemId );
	}

	/**
	 * Evict all entries from the image cache.
	 */
	@CacheEvict( value = "itemImages", allEntries = true )
	public void evictAllImageCache() {

		log.info( "Evicted all entries from image cache" );
	}

	private String generateFileName( Long itemId, String contentType ) {

		String extension = getExtensionFromContentType( contentType );
		return "image-" + UUID.randomUUID().toString() + extension;
	}

	private String getExtensionFromContentType( String contentType ) {

		if ( contentType == null ) {
			return ".jpg";
		}
		return switch ( contentType.toLowerCase() ) {
			case "image/jpeg" -> ".jpg";
			case "image/png" -> ".png";
			case "image/webp" -> ".webp";
			case "image/gif" -> ".gif";
			default -> ".jpg";
		};
	}

	@NotNull
	public List<ItemDto> getItemDtos( List<Item> recent ) {

		List<ItemDto> itemDtos = new ArrayList<>();
		for ( Item item : recent ) {
			// Use self to go through Spring proxy for caching to work
			List<String> imageUrls = s3Service.getItemImagesUrls( item.getId() );
			itemDtos.add( ItemDto.from( item, imageUrls ) );
		}
		return itemDtos;
	}
}
