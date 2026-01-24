package org.marketplace.marketplace.controllers;

import java.util.List;

import org.marketplace.marketplace.auth.config.AuthenticationUtil;
import org.marketplace.marketplace.dto.ItemDto;
import org.marketplace.marketplace.dto.ItemResponseDto;
import org.marketplace.marketplace.requests.ItemRequest;
import org.marketplace.marketplace.services.ItemService;
import org.springframework.http.ResponseEntity;
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
	public ResponseEntity<ItemResponseDto> createListing( @Valid @RequestBody final ItemRequest request ) {

		Long itemId = itemService.addItem( request );

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
	public ResponseEntity<?> getAllActiveListings() {

		Long userId = AuthenticationUtil.getCurrentUserId();
		return ResponseEntity.ok( itemService.getAllActiveListings( userId ) );
	}

	@GetMapping( "/search" )
	public ResponseEntity<?> searchListing( @RequestParam( "query" ) final String query,
			@RequestParam( value = "page", defaultValue = "0" ) final int page,
			@RequestParam( value = "size", defaultValue = "10" ) final int size ) {

		return ResponseEntity.ok( itemService.search( query, page, size ) );
	}

	@GetMapping( "/{itemId}" )
	public ResponseEntity<?> getItemById( @PathVariable final Long itemId ) {

		Long userId = AuthenticationUtil.getCurrentUserId();
		ItemDto item = itemService.getItemById( userId, itemId );

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
	public ResponseEntity<?> getHistory() {

		Long userId = AuthenticationUtil.getCurrentUserId();
		List<ItemDto> items = itemService.getHistory( userId );
		if ( !items.isEmpty() ) {
			return ResponseEntity.ok( items );
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping( "/getRecentlyViewed" )
	public ResponseEntity<?> getRecentlyViewedByUserId() {

		Long userId = AuthenticationUtil.getCurrentUserId();
		List<ItemDto> items = itemService.getRecentlyViewedItems( userId );
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
