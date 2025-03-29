package org.marketplace.marketplace.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.marketplace.marketplace.dto.CartItemDto;
import org.marketplace.marketplace.entities.CartItem;
import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.Status;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.CartItemRepository;
import org.marketplace.marketplace.repository.ItemRepository;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final S3Service s3Service;

    public List<CartItemDto> getCartItems(Long userId) {
        try {
            List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
            List<CartItemDto> cartItemDtos = new ArrayList<>();
            
            for (CartItem cartItem : cartItems) {
                List<String> imageUrls = s3Service.getItemImagesUrls(cartItem.getItem().getId());
                cartItemDtos.add(CartItemDto.from(cartItem, imageUrls));
            }
            
            return cartItemDtos;
        } catch (Exception e) {
            log.error("Error getting cart items for user {}: {}", userId, e.getMessage(), e);
            return Collections.emptyList();
        }
    }
    
    public CartItemDto addItemToCart(Long userId, Long itemId, int quantity) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Item item = itemRepository.findById(itemId)
                    .orElseThrow(() -> new NoSuchElementException("Item not found"));
            
            // Check if item is active and available
            if (item.getStatus() != Status.ACTIVE) {
                throw new RuntimeException("Item is not available for purchase");
            }
            
            // Check if quantity is valid
            if (quantity <= 0 || quantity > item.getQuantity()) {
                throw new RuntimeException("Invalid quantity requested");
            }
            
            // Check if item already exists in cart
            Optional<CartItem> existingCartItem = cartItemRepository.findByUserIdAndItemId(userId, itemId);
            
            CartItem cartItem;
            if (existingCartItem.isPresent()) {
                cartItem = existingCartItem.get();
                int newQuantity = cartItem.getQuantity() + quantity;
                
                // Make sure we don't exceed available quantity
                if (newQuantity > item.getQuantity()) {
                    newQuantity = item.getQuantity();
                }
                
                cartItem.setQuantity(newQuantity);
                cartItem.setUpdatedAt(LocalDateTime.now());
            } else {
                cartItem = CartItem.builder()
                        .user(user)
                        .item(item)
                        .quantity(quantity)
                        .addedAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
            }
            
            cartItem = cartItemRepository.save(cartItem);
            List<String> imageUrls = s3Service.getItemImagesUrls(itemId);
            
            return CartItemDto.from(cartItem, imageUrls);
        } catch (Exception e) {
            log.error("Error adding item {} to cart for user {}: {}", itemId, userId, e.getMessage(), e);
            throw e;
        }
    }
    
    public CartItemDto updateCartItem(Long userId, Long cartItemId, int quantity) {
        try {
            CartItem cartItem = cartItemRepository.findById(cartItemId)
                    .orElseThrow(() -> new NoSuchElementException("Cart item not found"));
            
            // Verify the cart item belongs to the user
            if (!cartItem.getUser().getID().equals(userId)) {
                throw new RuntimeException("Cart item does not belong to user");
            }
            
            // Check if item is still active
            if (cartItem.getItem().getStatus() != Status.ACTIVE) {
                throw new RuntimeException("Item is no longer available");
            }
            
            // Check if quantity is valid
            if (quantity <= 0) {
                throw new RuntimeException("Quantity must be greater than 0");
            }
            
            if (quantity > cartItem.getItem().getQuantity()) {
                throw new RuntimeException("Requested quantity exceeds available stock");
            }
            
            cartItem.setQuantity(quantity);
            cartItem.setUpdatedAt(LocalDateTime.now());
            
            cartItem = cartItemRepository.save(cartItem);
            List<String> imageUrls = s3Service.getItemImagesUrls(cartItem.getItem().getId());
            
            return CartItemDto.from(cartItem, imageUrls);
        } catch (Exception e) {
            log.error("Error updating cart item {} for user {}: {}", cartItemId, userId, e.getMessage(), e);
            throw e;
        }
    }
    
    public boolean removeCartItem(Long userId, Long cartItemId) {
        try {
            CartItem cartItem = cartItemRepository.findById(cartItemId)
                    .orElseThrow(() -> new NoSuchElementException("Cart item not found"));
            
            // Verify the cart item belongs to the user
            if (!cartItem.getUser().getID().equals(userId)) {
                throw new RuntimeException("Cart item does not belong to user");
            }
            
            cartItemRepository.delete(cartItem);
            return true;
        } catch (Exception e) {
            log.error("Error removing cart item {} for user {}: {}", cartItemId, userId, e.getMessage(), e);
            return false;
        }
    }
    
    public boolean clearCart(Long userId) {
        try {
            List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
            cartItemRepository.deleteAll(cartItems);
            return true;
        } catch (Exception e) {
            log.error("Error clearing cart for user {}: {}", userId, e.getMessage(), e);
            return false;
        }
    }
    
    public long getCartItemCount(Long userId) {
        try {
            return cartItemRepository.countByUserId(userId);
        } catch (Exception e) {
            log.error("Error counting cart items for user {}: {}", userId, e.getMessage(), e);
            return 0;
        }
    }
} 