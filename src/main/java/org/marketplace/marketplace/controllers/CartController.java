package org.marketplace.marketplace.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.marketplace.marketplace.dto.CartItemDto;
import org.marketplace.marketplace.services.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/cart")
@CrossOrigin
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    
    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCartItems(@RequestParam final Long userId) {
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }
    
    @PostMapping("/add")
    public ResponseEntity<CartItemDto> addToCart(
            @RequestParam final Long userId,
            @RequestParam final Long itemId,
            @RequestParam(defaultValue = "1") final int quantity) {
        
        try {
            CartItemDto cartItem = cartService.addItemToCart(userId, itemId, quantity);
            return ResponseEntity.ok(cartItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItemDto> updateCartItem(
            @RequestParam final Long userId,
            @PathVariable final Long cartItemId,
            @RequestParam final int quantity) {
        
        try {
            CartItemDto cartItem = cartService.updateCartItem(userId, cartItemId, quantity);
            return ResponseEntity.ok(cartItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeCartItem(
            @RequestParam final Long userId,
            @PathVariable final Long cartItemId) {
        
        boolean removed = cartService.removeCartItem(userId, cartItemId);
        if (removed) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Item removed from cart");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@RequestParam final Long userId) {
        boolean cleared = cartService.clearCart(userId);
        if (cleared) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cart cleared successfully");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/count")
    public ResponseEntity<?> getCartItemCount(@RequestParam final Long userId) {
        long count = cartService.getCartItemCount(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
} 