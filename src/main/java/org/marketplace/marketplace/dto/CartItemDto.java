package org.marketplace.marketplace.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.marketplace.marketplace.entities.CartItem;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDto {
    private Long id;
    private Long itemId;
    private String title;
    private String description;
    private BigDecimal price;
    private int quantity;
    private BigDecimal subtotal;
    private String category;
    private String seller;
    private Long sellerId;
    private List<String> imageUrls;
    private LocalDateTime addedAt;
    private LocalDateTime updatedAt;
    
    public static CartItemDto from(CartItem cartItem, List<String> imageUrls) {
        return CartItemDto.builder()
                .id(cartItem.getId())
                .itemId(cartItem.getItem().getId())
                .title(cartItem.getItem().getTitle())
                .description(cartItem.getItem().getDescription())
                .price(cartItem.getItem().getPrice())
                .quantity(cartItem.getQuantity())
                .subtotal(cartItem.getSubtotal())
                .category(cartItem.getItem().getCategory().name())
                .seller(cartItem.getItem().getUser().getName())
                .sellerId(cartItem.getItem().getUser().getID())
                .imageUrls(imageUrls)
                .addedAt(cartItem.getAddedAt())
                .updatedAt(cartItem.getUpdatedAt())
                .build();
    }
} 