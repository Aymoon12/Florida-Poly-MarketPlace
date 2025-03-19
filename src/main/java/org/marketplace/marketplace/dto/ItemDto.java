package org.marketplace.marketplace.dto;

import lombok.Builder;
import lombok.Data;
import org.marketplace.marketplace.entities.Category;
import org.marketplace.marketplace.entities.Item;

import java.math.BigDecimal;

@Data
@Builder
public class ItemDto {

    private final String title;

    private final String description;

    private final BigDecimal price;

    private final Category category;

    public static ItemDto from(final Item item) {
        return ItemDto.builder()
                .title(item.getTitle())
                .description(item.getDescription())
                .price(item.getPrice())
                .category(item.getCategory())
                .build();
    }


}
