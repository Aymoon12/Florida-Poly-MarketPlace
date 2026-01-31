package org.marketplace.marketplace.controllers;

import java.util.List;

import org.marketplace.marketplace.dto.CreateReviewRequest;
import org.marketplace.marketplace.dto.RatingSummaryDto;
import org.marketplace.marketplace.dto.ReviewDto;
import org.marketplace.marketplace.entities.ReviewType;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.services.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping( "api/v1/reviews" )
@CrossOrigin
@RequiredArgsConstructor
@Log4j2
public class ReviewController {

	private final ReviewService reviewService;

	@PostMapping
	public ResponseEntity<ReviewDto> createReview( @AuthenticationPrincipal User user,
			@Valid @RequestBody CreateReviewRequest request ) {

		log.info( "Creating review for user: {}, sale: {}", user.getID(), request.getSaleId() );
		ReviewDto review = reviewService.createReview( user.getID(), request );

		return ResponseEntity.ok( review );
	}

	@GetMapping( "/can-review" )
	public ResponseEntity<Boolean> canReview(
			@AuthenticationPrincipal User user,
			@RequestParam Long saleId,
			@RequestParam ReviewType reviewType ) {

		boolean canReview = reviewService.canReview( user.getID(), saleId, reviewType );

		return ResponseEntity.ok( canReview );
	}

	@GetMapping( "/seller/{sellerId}" )
	public ResponseEntity<List<ReviewDto>> getSellerReviews(
			@PathVariable Long sellerId,
			@RequestParam( defaultValue = "0" ) int page,
			@RequestParam( defaultValue = "10" ) int size ) {

		log.info( "Fetching reviews for seller: {}", sellerId );
		List<ReviewDto> reviews = reviewService.getSellerReviews( sellerId, page, size );

		return ResponseEntity.ok( reviews );
	}

	@GetMapping( "/item/{itemId}" )
	public ResponseEntity<List<ReviewDto>> getItemReviews(
			@PathVariable Long itemId,
			@RequestParam( defaultValue = "0" ) int page,
			@RequestParam( defaultValue = "10" ) int size ) {

		log.info( "Fetching reviews for item: {}", itemId );
		List<ReviewDto> reviews = reviewService.getItemReviews( itemId, page, size );

		return ResponseEntity.ok( reviews );
	}

	@GetMapping( "/seller/{sellerId}/summary" )
	public ResponseEntity<RatingSummaryDto> getSellerRatingSummary( @PathVariable Long sellerId ) {

		log.info( "Fetching rating summary for seller: {}", sellerId );
		RatingSummaryDto summary = reviewService.getSellerRatingSummary( sellerId );

		return ResponseEntity.ok( summary );
	}

	@GetMapping( "/item/{itemId}/summary" )
	public ResponseEntity<RatingSummaryDto> getItemRatingSummary( @PathVariable Long itemId ) {

		log.info( "Fetching rating summary for item: {}", itemId );
		RatingSummaryDto summary = reviewService.getItemRatingSummary( itemId );

		return ResponseEntity.ok( summary );
	}

	@GetMapping( "/user/{userId}/given" )
	public ResponseEntity<List<ReviewDto>> getUserGivenReviews( @PathVariable Long userId ) {

		log.info( "Fetching reviews given by user: {}", userId );
		List<ReviewDto> reviews = reviewService.getUserGivenReviews( userId );

		return ResponseEntity.ok( reviews );
	}

	@DeleteMapping( "/{reviewId}" )
	public ResponseEntity<Boolean> deleteReview( @AuthenticationPrincipal User user,
			@PathVariable Long reviewId ) {

		log.info( "Deleting review: {} by user: {}", reviewId, user.getID() );
		boolean success = reviewService.deleteReview( reviewId, user.getID() );

		return ResponseEntity.ok( success );
	}

	@GetMapping( "/buyer/{buyerId}" )
	public ResponseEntity<List<ReviewDto>> getBuyerReviews(
			@PathVariable Long buyerId,
			@RequestParam( defaultValue = "0" ) int page,
			@RequestParam( defaultValue = "10" ) int size ) {

		log.info( "Fetching reviews for buyer: {}", buyerId );
		List<ReviewDto> reviews = reviewService.getBuyerReviews( buyerId, page, size );

		return ResponseEntity.ok( reviews );
	}

	@GetMapping( "/buyer/{buyerId}/summary" )
	public ResponseEntity<RatingSummaryDto> getBuyerRatingSummary( @PathVariable Long buyerId ) {

		log.info( "Fetching rating summary for buyer: {}", buyerId );
		RatingSummaryDto summary = reviewService.getBuyerRatingSummary( buyerId );

		return ResponseEntity.ok( summary );
	}

}
