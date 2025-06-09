package org.marketplace.marketplace.services;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.marketplace.marketplace.dto.ItemDto;
import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.SavedListing;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.ItemRepository;
import org.marketplace.marketplace.repository.SavedListingRepository;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class SavedListingService {

    private final SavedListingRepository savedListingRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final S3Service s3Service;

    /**
     * Save an item to a user's saved listings
     */
    public boolean saveItem(Long userId, Long itemId) {
        try {
            User user = userRepository.findById(userId).orElseThrow();
            Item item = itemRepository.findById(itemId).orElseThrow();
            
            // Check if already saved
            if (savedListingRepository.existsByUserIdAndItemId(userId, itemId)) {
                return true; // Already saved
            }
            
            // Create new saved listing
            SavedListing savedListing = new SavedListing();
            savedListing.setUser(user);
            savedListing.setItem(item);
            savedListing.setSavedAt(LocalDateTime.now());
            
            savedListingRepository.save(savedListing);
            return true;
        } catch (Exception e) {
            System.err.println("Error saving item to favorites: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Remove an item from a user's saved listings
     */
    public boolean unsaveItem(Long userId, Long itemId) {
        try {
            User user = userRepository.findById(userId).orElseThrow();
            Item item = itemRepository.findById(itemId).orElseThrow();
            
            savedListingRepository.deleteByUserAndItem(user, item);
            return true;
        } catch (Exception e) {
            System.err.println("Error removing item from favorites: " + e.getMessage());
            return false;
        }
    }
    
    /**
     * Get all saved listings for a user
     */
    public List<ItemDto> getSavedListings(Long userId) {
        try {
            List<SavedListing> savedListings = savedListingRepository.findAllByUserId(userId)
                    .orElse(Collections.emptyList());
            
            return savedListings.stream()
                    .map(savedListing -> {
                        Item item = savedListing.getItem();
                        List<String> imageUrls = s3Service.getItemImagesUrls(item.getId());
                        return ItemDto.from(item, imageUrls);
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error fetching saved listings: " + e.getMessage());
            return Collections.emptyList();
        }
    }
    
    /**
     * Check if an item is saved by a user
     */
    public boolean isItemSaved(Long userId, Long itemId) {
        try {
            return savedListingRepository.existsByUserIdAndItemId(userId, itemId);
        } catch (Exception e) {
            System.err.println("Error checking if item is saved: " + e.getMessage());
            return false;
        }
    }
} 