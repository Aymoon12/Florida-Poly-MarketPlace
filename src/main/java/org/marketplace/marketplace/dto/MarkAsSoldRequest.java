package org.marketplace.marketplace.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MarkAsSoldRequest {

	@NotNull( message = "Item ID is required" )
	private Long itemId;

	@NotNull( message = "Buyer ID is required" )
	private Long buyerId;

	@NotNull( message = "Sale price is required" )
	@Positive( message = "Sale price must be positive" )
	private BigDecimal salePrice;

}
