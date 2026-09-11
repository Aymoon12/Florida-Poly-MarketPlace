package org.marketplace.marketplace.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.marketplace.marketplace.dto.CartItemDto;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.services.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<List<CartItemDto>> getCartItems( @AuthenticationPrincipal User user ) {
        return ResponseEntity.ok(cartService.getCartItems(user.getID()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItemDto> addToCart(
            @AuthenticationPrincipal User user,
            @RequestParam final Long itemId,
            @RequestParam(defaultValue = "1") final int quantity) {

        CartItemDto cartItem = cartService.addItemToCart(user.getID(), itemId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<CartItemDto> updateCartItem(
            @AuthenticationPrincipal User user,
            @PathVariable final Long cartItemId,
            @RequestParam final int quantity) {

        CartItemDto cartItem = cartService.updateCartItem(user.getID(), cartItemId, quantity);
        return ResponseEntity.ok(cartItem);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeCartItem( @AuthenticationPrincipal User user,
            @PathVariable final Long cartItemId ) {

        boolean removed = cartService.removeCartItem(user.getID(), cartItemId);
        if (removed) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Item removed from cart");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart( @AuthenticationPrincipal User user ) {
        boolean cleared = cartService.clearCart(user.getID());
        if (cleared) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cart cleared successfully");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCartItemCount( @AuthenticationPrincipal User user ) {
        long count = cartService.getCartItemCount(user.getID());
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
}
