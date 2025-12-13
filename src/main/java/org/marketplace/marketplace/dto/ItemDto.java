package org.marketplace.marketplace.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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

	private final List<String> imageUrls;

	private final LocalDateTime createdAt;

	private final int quantity;

	private final int views;

	private final int watchers;

	private final boolean isSaved;

	public static ItemDto from( final Item item ) {

		return ItemDto.builder().id( item.getId() ).title( item.getTitle() ).description( item.getDescription() )
				.price( item.getPrice() ).category( item.getCategory() ).createdAt( item.getCreatedAt() )
				.quantity( item.getQuantity() ).views( item.getViews() ).build();
	}

	public static ItemDto from( final Item item, final List<String> imageUrls ) {

		return ItemDto.builder().id( item.getId() ).title( item.getTitle() ).description( item.getDescription() )
				.price( item.getPrice() ).category( item.getCategory() ).imageUrls( imageUrls )
				.createdAt( item.getCreatedAt() ).quantity( item.getQuantity() ).views( item.getViews() ).build();
	}

	public static ItemDto from( final Item item, final List<String> imageUrls, final int watchers ) {

		return ItemDto.builder().id( item.getId() ).title( item.getTitle() ).description( item.getDescription() )
				.price( item.getPrice() ).category( item.getCategory() ).imageUrls( imageUrls )
				.createdAt( item.getCreatedAt() ).quantity( item.getQuantity() ).views( item.getViews() )
				.watchers( watchers ).build();
	}

}
