package org.marketplace.marketplace.controllers;

import org.marketplace.marketplace.requests.ItemRequest;
import org.marketplace.marketplace.services.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping( "api/v1/item" )
@CrossOrigin
@RequiredArgsConstructor
public class ItemController {

	private final ItemService itemService;

	@PostMapping( "/createListing" )
	public ResponseEntity<?> createListing( @RequestParam( "userId" ) final Long userId,
			@RequestBody final ItemRequest request ) {

		return ResponseEntity.ok( itemService.addItem( userId, request ) );
	}

	@DeleteMapping( "/deleteListing" )
	public ResponseEntity<?> deleteListing( @RequestParam( "itemId" ) final Long itemId ) {

		return ResponseEntity.ok( itemService.deleteItem( itemId ) );
	}

	@GetMapping( "/getAllActiveListings" )
	public ResponseEntity<?> getAllActiveListings( @RequestParam final Long userId ) {

		return ResponseEntity.ok( itemService.getAllActiveListings( userId ) );

	}

	@GetMapping( "/search" )
	public ResponseEntity<?> searchListing( @RequestParam final String query ) {

		return ResponseEntity.ok( itemService.search( query ) );

	}

}
