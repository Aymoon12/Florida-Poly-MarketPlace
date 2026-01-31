package org.marketplace.marketplace.controllers;

import java.util.List;

import org.marketplace.marketplace.dto.ItemDto;
import org.marketplace.marketplace.dto.ItemResponseDto;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.requests.ItemRequest;
import org.marketplace.marketplace.services.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping( "api/v1/item" )
@CrossOrigin
@RequiredArgsConstructor
public class ItemController {

	private final ItemService itemService;

	@PostMapping( "/createListing" )
	public ResponseEntity<ItemResponseDto> createListing( @Valid @RequestBody final ItemRequest request,
			@AuthenticationPrincipal User user ) {

		Long itemId = itemService.addItem( request, user.getID() );

		if ( itemId != null ) {
			return ResponseEntity.ok( ItemResponseDto.success( itemId ) );
		} else {
			return ResponseEntity.badRequest().body( ItemResponseDto.failure( "Failed to create item" ) );
		}
	}

	@DeleteMapping( "/deleteListing" )
	public ResponseEntity<?> deleteListing( @RequestParam( "itemId" ) final Long itemId ) {

		return ResponseEntity.ok( itemService.deleteItem( itemId ) );
	}

	@GetMapping( "/getAllActiveListings" )
	public ResponseEntity<?> getAllActiveListings( @AuthenticationPrincipal User user ) {

		return ResponseEntity.ok( itemService.getAllActiveListings( user.getID() ) );
	}

	@GetMapping( "/search" )
	public ResponseEntity<?> searchListing( @RequestParam( "query" ) final String query,
			@RequestParam( value = "page", defaultValue = "0" ) final int page,
			@RequestParam( value = "size", defaultValue = "10" ) final int size ) {

		return ResponseEntity.ok( itemService.search( query, page, size ) );
	}

	@GetMapping( "/{itemId}" )
	public ResponseEntity<?> getItemById( @AuthenticationPrincipal User user, @PathVariable final Long itemId ) {

		ItemDto item = itemService.getItemById( user.getID(), itemId );

		if ( item != null ) {
			return ResponseEntity.ok( item );
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping( "/getAllListingsByCategory" )
	public ResponseEntity<?> getAllListingsByCategory( @RequestParam final String category ) {

		List<ItemDto> items = itemService.getAllListingsByCategory( category );
		if ( !items.isEmpty() ) {
			return ResponseEntity.ok( items );
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping( "/getHistory" )
	public ResponseEntity<?> getHistory( @AuthenticationPrincipal User user ) {

		List<ItemDto> items = itemService.getHistory( user.getID() );
		if ( !items.isEmpty() ) {
			return ResponseEntity.ok( items );
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping( "/getRecentlyViewed" )
	public ResponseEntity<?> getRecentlyViewedByUserId( @AuthenticationPrincipal User user ) {

		List<ItemDto> items = itemService.getRecentlyViewedItems( user.getID() );
		if ( !items.isEmpty() ) {
			return ResponseEntity.ok( items );
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PostMapping("/decrementWatchers/{itemId}")
	public ResponseEntity<?> decrementWatchers( @PathVariable final Long itemId ) {

		itemService.decrementWatchers( itemId );
		return ResponseEntity.ok().build();
	}

}
