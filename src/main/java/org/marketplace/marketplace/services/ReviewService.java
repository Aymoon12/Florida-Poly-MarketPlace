package org.marketplace.marketplace.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.marketplace.marketplace.dto.CreateReviewRequest;
import org.marketplace.marketplace.dto.RatingSummaryDto;
import org.marketplace.marketplace.dto.ReviewDto;
import org.marketplace.marketplace.entities.Review;
import org.marketplace.marketplace.entities.ReviewType;
import org.marketplace.marketplace.entities.Sale;
import org.marketplace.marketplace.repository.ReviewRepository;
import org.marketplace.marketplace.repository.SaleRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class ReviewService {

	private final ReviewRepository reviewRepository;
	private final SaleRepository saleRepository;

	@Transactional
	public ReviewDto createReview( Long reviewerId, CreateReviewRequest request ) {

		Sale sale = saleRepository.findById( request.getSaleId() )
				.orElseThrow( () -> new ResponseStatusException( HttpStatus.NOT_FOUND,
						"Sale not found with ID: " + request.getSaleId() ) );

		if ( !sale.getBuyer().getID().equals( reviewerId ) ) {
			throw new ResponseStatusException( HttpStatus.FORBIDDEN,
					"Only the buyer can leave a review for this purchase" );
		}

		if ( reviewRepository.findBySaleIdAndReviewType( request.getSaleId(), request.getReviewType() ).isPresent() ) {
			throw new ResponseStatusException( HttpStatus.CONFLICT,
					"You have already reviewed this "
							+ ( request.getReviewType() == ReviewType.SELLER ? "seller" : "item" )
							+ " for this purchase" );
		}

		Review.ReviewBuilder reviewBuilder = Review.builder()
				.sale( sale )
				.reviewer( sale.getBuyer() )
				.reviewType( request.getReviewType() )
				.rating( request.getRating() )
				.comment( request.getComment() )
				.createdAt( LocalDateTime.now() );

		if ( request.getReviewType() == ReviewType.SELLER ) {
			reviewBuilder.reviewedSeller( sale.getSeller() );
		} else {
			reviewBuilder.reviewedItem( sale.getItem() );
		}

		Review savedReview = reviewRepository.save( reviewBuilder.build() );
		log.info( "Review created: {} for {} by user {}", savedReview.getId(), request.getReviewType(), reviewerId );

		return ReviewDto.from( savedReview );
	}

	public boolean canReview( Long userId, Long saleId, ReviewType reviewType ) {

		Sale sale = saleRepository.findById( saleId ).orElse( null );

		if ( sale == null || !sale.getBuyer().getID().equals( userId ) ) {
			return false;
		}

		return reviewRepository.findBySaleIdAndReviewType( saleId, reviewType ).isEmpty();
	}

	@Transactional( readOnly = true )
	public List<ReviewDto> getSellerReviews( Long sellerId, int page, int size ) {

		Pageable pageable = PageRequest.of( page, size );

		return reviewRepository.findByReviewedSellerId( sellerId, pageable )
				.stream()
				.map( ReviewDto::from )
				.collect( Collectors.toList() );
	}

	@Transactional( readOnly = true )
	public List<ReviewDto> getItemReviews( Long itemId, int page, int size ) {

		Pageable pageable = PageRequest.of( page, size );

		return reviewRepository.findByReviewedItemId( itemId, pageable )
				.stream()
				.map( ReviewDto::from )
				.collect( Collectors.toList() );
	}

	@Transactional( readOnly = true )
	public RatingSummaryDto getSellerRatingSummary( Long sellerId ) {

		Double avgRating = reviewRepository.calculateAverageSellerRating( sellerId );
		Long count = reviewRepository.countSellerReviews( sellerId );

		if ( avgRating == null || count == 0 ) {
			return RatingSummaryDto.empty();
		}

		return RatingSummaryDto.builder()
				.averageRating( Math.round( avgRating * 10.0 ) / 10.0 )
				.reviewCount( count )
				.build();
	}

	@Transactional( readOnly = true )
	public RatingSummaryDto getItemRatingSummary( Long itemId ) {

		Double avgRating = reviewRepository.calculateAverageItemRating( itemId );
		Long count = reviewRepository.countItemReviews( itemId );

		if ( avgRating == null || count == 0 ) {
			return RatingSummaryDto.empty();
		}

		return RatingSummaryDto.builder()
				.averageRating( Math.round( avgRating * 10.0 ) / 10.0 )
				.reviewCount( count )
				.build();
	}

	@Transactional( readOnly = true )
	public List<ReviewDto> getUserGivenReviews( Long userId ) {

		return reviewRepository.findByReviewerId( userId )
				.stream()
				.map( ReviewDto::from )
				.collect( Collectors.toList() );
	}

	@Transactional
	public boolean deleteReview( Long reviewId, Long userId ) {

		Review review = reviewRepository.findById( reviewId )
				.orElseThrow( () -> new ResponseStatusException( HttpStatus.NOT_FOUND, "Review not found" ) );

		if ( !review.getReviewer().getID().equals( userId ) ) {
			throw new ResponseStatusException( HttpStatus.FORBIDDEN, "You can only delete your own reviews" );
		}

		reviewRepository.delete( review );
		log.info( "Review deleted: {} by user {}", reviewId, userId );

		return true;
	}

}
