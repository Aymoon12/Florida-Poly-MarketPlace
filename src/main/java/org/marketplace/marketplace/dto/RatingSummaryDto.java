package org.marketplace.marketplace.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RatingSummaryDto {

	private Double averageRating;
	private Long reviewCount;

	public static RatingSummaryDto empty() {

		return RatingSummaryDto.builder()
				.averageRating( 0.0 )
				.reviewCount( 0L )
				.build();
	}

}
