package org.marketplace.marketplace.controllers;

import java.time.LocalDateTime;
import lombok.extern.log4j.Log4j2;

import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.SavedListing;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.ItemRepository;
import org.marketplace.marketplace.repository.SavedListingRepository;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("api/v1/saved")
@CrossOrigin
@RequiredArgsConstructor
@Log4j2
public class SavedListingController {

    private final SavedListingRepository savedListingRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    @PostMapping("/save")
    public ResponseEntity<?> saveItem(@RequestParam("userId") final Long userId,
                                     @RequestParam("itemId") final Long itemId) {
        try {
            User user = userRepository.findById(userId).orElseThrow();
            Item item = itemRepository.findById(itemId).orElseThrow();
            
            // Check if already saved
            if (savedListingRepository.existsByUserIdAndItemId(userId, itemId)) {
                return ResponseEntity.ok().build(); // Already saved
            }
            
            // Create new saved listing
            SavedListing savedListing = new SavedListing();
            savedListing.setUser(user);
            savedListing.setItem(item);
            savedListing.setSavedAt(LocalDateTime.now());
            
            savedListingRepository.save(savedListing);
            log.info("Saved listing saved successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/unsave")
    public ResponseEntity<?> unsaveItem(@RequestParam("userId") final Long userId,
                                       @RequestParam("itemId") final Long itemId) {
        try {
            User user = userRepository.findById(userId).orElseThrow();
            Item item = itemRepository.findById(itemId).orElseThrow();
            
            savedListingRepository.deleteByUserAndItem(user, item);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getSavedListings(@RequestParam("userId") final Long userId) {
        try {
            return ResponseEntity.ok(savedListingRepository.findAllByUserId(userId)
                    .orElseThrow());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> isItemSaved(@RequestParam("userId") final Long userId,
                                        @RequestParam("itemId") final Long itemId) {
        try {
            return ResponseEntity.ok(savedListingRepository.existsByUserIdAndItemId(userId, itemId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 