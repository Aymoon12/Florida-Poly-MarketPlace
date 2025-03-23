package org.marketplace.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponseDto {
    private Long itemId;
    private boolean success;
    private String message;
    
    public static ItemResponseDto success(Long itemId) {
        return ItemResponseDto.builder()
                .itemId(itemId)
                .success(true)
                .message("Item created successfully")
                .build();
    }
    
    public static ItemResponseDto failure(String message) {
        return ItemResponseDto.builder()
                .success(false)
                .message(message)
                .build();
    }
} 