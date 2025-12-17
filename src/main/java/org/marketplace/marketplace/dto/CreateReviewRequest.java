package org.marketplace.marketplace.dto;

import org.marketplace.marketplace.entities.ReviewType;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateReviewRequest {

	@NotNull( message = "Sale ID is required" )
	private Long saleId;

	@NotNull( message = "Review type is required" )
	private ReviewType reviewType;

	@NotNull( message = "Rating is required" )
	@Min( value = 1, message = "Rating must be at least 1" )
	@Max( value = 5, message = "Rating cannot exceed 5" )
	private Integer rating;

	@Size( max = 1000, message = "Comment cannot exceed 1000 characters" )
	private String comment;

}
