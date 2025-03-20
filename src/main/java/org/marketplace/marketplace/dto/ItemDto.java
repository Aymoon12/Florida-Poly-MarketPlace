package org.marketplace.marketplace.dto;

import java.math.BigDecimal;

import org.marketplace.marketplace.entities.Category;
import org.marketplace.marketplace.entities.Item;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItemDto {

	private final Long id;

	private final String title;

	private final String description;

	private final BigDecimal price;

	private final Category category;

	public static ItemDto from( final Item item ) {

		return ItemDto.builder().id( item.getId() ).title( item.getTitle() ).description( item.getDescription() )
				.price( item.getPrice() ).category( item.getCategory() ).build();
	}

}
