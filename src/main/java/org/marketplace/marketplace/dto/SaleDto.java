package org.marketplace.marketplace.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.marketplace.marketplace.entities.Sale;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SaleDto {

	private Long id;
	private LocalDate salesDate;
	private BigDecimal salesPrice;
	private Long sellerId;
	private String sellerName;
	private Long buyerId;
	private String buyerName;
	private Long itemId;
	private String itemTitle;
	private String itemImageUrl;
	private boolean sellerReviewed;
	private boolean buyerReviewed;
	private boolean itemReviewed;

	public static SaleDto from( Sale sale, boolean sellerReviewed, boolean buyerReviewed, boolean itemReviewed ) {

		return SaleDto.builder()
				.id( sale.getId() )
				.salesDate( sale.getSalesDate() )
				.salesPrice( sale.getSalesPrice() )
				.sellerId( sale.getSeller().getID() )
				.sellerName( sale.getSeller().getName() )
				.buyerId( sale.getBuyer().getID() )
				.buyerName( sale.getBuyer().getName() )
				.itemId( sale.getItem().getId() )
				.itemTitle( sale.getItem().getTitle() )
				.sellerReviewed( sellerReviewed )
				.buyerReviewed( buyerReviewed )
				.itemReviewed( itemReviewed )
				.build();
	}

}
