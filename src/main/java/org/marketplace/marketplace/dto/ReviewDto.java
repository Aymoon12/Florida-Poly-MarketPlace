package org.marketplace.marketplace.dto;

import java.time.Duration;
import java.time.LocalDateTime;

import org.marketplace.marketplace.entities.Review;
import org.marketplace.marketplace.entities.ReviewType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewDto {

	private Long id;
	private Long saleId;
	private Long reviewerId;
	private String reviewerName;
	private ReviewType reviewType;
	private Integer rating;
	private String comment;
	private LocalDateTime createdAt;
	private String relativeTime;

	private Long reviewedSellerId;
	private String reviewedSellerName;

	private Long reviewedItemId;
	private String reviewedItemTitle;

	private Long reviewedBuyerId;
	private String reviewedBuyerName;

	public static ReviewDto from( Review review ) {

		ReviewDtoBuilder builder = ReviewDto.builder()
				.id( review.getId() )
				.saleId( review.getSale().getId() )
				.reviewerId( review.getReviewer().getID() )
				.reviewerName( review.getReviewer().getName() )
				.reviewType( review.getReviewType() )
				.rating( review.getRating() )
				.comment( review.getComment() )
				.createdAt( review.getCreatedAt() )
				.relativeTime( formatRelativeTime( review.getCreatedAt() ) );

		if ( review.getReviewedSeller() != null ) {
			builder.reviewedSellerId( review.getReviewedSeller().getID() )
					.reviewedSellerName( review.getReviewedSeller().getName() );
		}

		if ( review.getReviewedItem() != null ) {
			builder.reviewedItemId( review.getReviewedItem().getId() )
					.reviewedItemTitle( review.getReviewedItem().getTitle() );
		}

		if ( review.getReviewedBuyer() != null ) {
			builder.reviewedBuyerId( review.getReviewedBuyer().getID() )
					.reviewedBuyerName( review.getReviewedBuyer().getName() );
		}

		return builder.build();
	}

	private static String formatRelativeTime( LocalDateTime dateTime ) {

		LocalDateTime now = LocalDateTime.now();
		long minutesDiff = Duration.between( dateTime, now ).toMinutes();

		if ( minutesDiff < 1 ) {
			return "just now";
		} else if ( minutesDiff < 60 ) {
			return minutesDiff + " minute" + ( minutesDiff == 1 ? "" : "s" ) + " ago";
		} else if ( minutesDiff < 24 * 60 ) {
			long hours = minutesDiff / 60;
			return hours + " hour" + ( hours == 1 ? "" : "s" ) + " ago";
		} else if ( minutesDiff < 48 * 60 ) {
			return "yesterday";
		} else {
			long days = minutesDiff / ( 24 * 60 );
			return days + " day" + ( days == 1 ? "" : "s" ) + " ago";
		}
	}

}
