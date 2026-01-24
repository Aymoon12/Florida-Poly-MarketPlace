package org.marketplace.marketplace.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.marketplace.marketplace.auth.config.AuthenticationUtil;
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
    public ResponseEntity<List<CartItemDto>> getCartItems() {
        Long userId = AuthenticationUtil.getCurrentUserId();
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItemDto> addToCart(
            @RequestParam final Long itemId,
            @RequestParam(defaultValue = "1") final int quantity) {

        Long userId = AuthenticationUtil.getCurrentUserId();
        CartItemDto cartItem = cartService.addItemToCart(userId, itemId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItemDto> updateCartItem(
            @PathVariable final Long cartItemId,
            @RequestParam final int quantity) {

        Long userId = AuthenticationUtil.getCurrentUserId();
        CartItemDto cartItem = cartService.updateCartItem(userId, cartItemId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeCartItem(@PathVariable final Long cartItemId) {

        Long userId = AuthenticationUtil.getCurrentUserId();
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
    public ResponseEntity<?> clearCart() {
        Long userId = AuthenticationUtil.getCurrentUserId();
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
    public ResponseEntity<?> getCartItemCount() {
        Long userId = AuthenticationUtil.getCurrentUserId();
        long count = cartService.getCartItemCount(userId);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}
