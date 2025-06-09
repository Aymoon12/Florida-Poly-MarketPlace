package org.marketplace.marketplace.services;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.jetbrains.annotations.NotNull;
import org.marketplace.marketplace.dto.ItemDto;
import org.marketplace.marketplace.entities.Item;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.S3ObjectSummary;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class S3Service {

	private final AmazonS3 s3Client;

	@Value( "${aws.s3.bucket.name:ayman-marketplace-items}" )
	private String bucketName;

	@Value( "${aws.s3.presigned-url.expiry:900000}" )
	private long presignedUrlExpiry; // Default 15 minutes in milliseconds

	// Simple in-memory cache for image URLs to prevent constant regeneration
	private final Map<Long, List<String>> itemImagesCache = new ConcurrentHashMap<>();
	private final Map<Long, Long> cacheTimestamps = new ConcurrentHashMap<>();
	private static final long CACHE_EXPIRY = 300000; // 5 minutes in milliseconds

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

		try {
			String fileName = generateFileName( itemId );
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
	 * Upload a file directly to S3 from the server
	 * 
	 * @param itemId
	 *            The item ID this image is for
	 * @param file
	 *            The file to upload
	 * @return The S3 object key of the uploaded file
	 */
	public void uploadFile( Long itemId, MultipartFile file ) {

		try {
			String fileName = generateFileName( itemId );
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
	 * Generate presigned URLs for retrieving images for an item
	 * 
	 * @param itemId
	 *            The item ID
	 * @return List of presigned URLs for GET operation
	 */
	public List<String> getItemImagesUrls( Long itemId ) {

		// Check if we have a valid cache entry
		Long cachedTime = cacheTimestamps.get( itemId );
		if ( cachedTime != null && System.currentTimeMillis() - cachedTime < CACHE_EXPIRY ) {
			List<String> cachedUrls = itemImagesCache.get( itemId );
			log.info( "Using cached image URLs for item: {}, count: {}", itemId,
					cachedUrls != null ? cachedUrls.size() : 0 );
			return cachedUrls != null ? cachedUrls : List.of();
		}

		try {
			// List objects in the item's directory
			List<String> objectKeys = s3Client.listObjects( bucketName, "items/" + itemId + "/" ).getObjectSummaries()
					.stream().map( S3ObjectSummary::getKey ).toList();

			// If no images found, return empty list and cache the result
			if ( objectKeys.isEmpty() ) {
				log.info( "No images found for item: {}", itemId );
				itemImagesCache.put( itemId, List.of() );
				cacheTimestamps.put( itemId, System.currentTimeMillis() );
				return List.of();
			}

			// Generate presigned URLs for each object
			List<String> presignedUrls =
					objectKeys.stream().map( this::generatePresignedGetUrl ).collect( Collectors.toList() );

			// Cache the results
			itemImagesCache.put( itemId, presignedUrls );
			cacheTimestamps.put( itemId, System.currentTimeMillis() );

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
	 * Delete all images associated with an item
	 * 
	 * @param itemId
	 *            The item ID
	 */
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

	private String generateFileName( Long itemId ) {

		return "image-" + UUID.randomUUID().toString() + ".jpg";
	}

	@NotNull
	public List<ItemDto> getItemDtos( List<Item> recent ) {

		List<ItemDto> itemDtos = new ArrayList<>();
		for ( Item item : recent ) {
			List<String> imageUrls = this.getItemImagesUrls( item.getId() );
			itemDtos.add( ItemDto.from( item, imageUrls ) );
		}
		return itemDtos;
	}
}