package org.marketplace.marketplace.controllers;

import org.marketplace.marketplace.repository.SavedListingRepository;
import org.marketplace.marketplace.services.SavedListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping( "api/v1/saved" )
@CrossOrigin
@RequiredArgsConstructor
@Log4j2
public class SavedListingController {

	private final SavedListingRepository savedListingRepository;
	private final SavedListingService savedListingService;

	@PostMapping( "/save" )
	public ResponseEntity<?> saveItem( @RequestParam( "userId" ) final Long userId,
			@RequestParam( "itemId" ) final Long itemId ) {

		try {
			return ResponseEntity.ok( savedListingService.saveItem( userId, itemId ) );
		} catch ( Exception e ) {
			return ResponseEntity.badRequest().build();
		}
	}

	@DeleteMapping( "/unsave" )
	public ResponseEntity<?> unsaveItem( @RequestParam( "userId" ) final Long userId,
			@RequestParam( "itemId" ) final Long itemId ) {

		try {
			return ResponseEntity.ok( savedListingService.unsaveItem( userId, itemId ) );
		} catch ( Exception e ) {
			return ResponseEntity.badRequest().build();
		}
	}

	@GetMapping( "/last-five" )
	public ResponseEntity<?> getLastFiveSavedListings( @RequestParam( "userId" ) final Long userId ) {

		try {
			final var savedListings = savedListingService.getLastFiveSavedListings( userId );
			log.info( "Last five saved listings retrieved successfully" );
			return ResponseEntity.ok( savedListings );
		} catch ( Exception e ) {
			return ResponseEntity.badRequest().build();
		}
	}

	@GetMapping( "/getAllSaved" )
	public ResponseEntity<?> getSaved( @RequestParam( "userId" ) final Long userId ) {

		return ResponseEntity.ok( savedListingService.getSavedListings( userId ) );
	}

	@GetMapping( "/check" )
	public ResponseEntity<?> isItemSaved( @RequestParam( "userId" ) final Long userId,
			@RequestParam( "itemId" ) final Long itemId ) {

		try {
			return ResponseEntity.ok( savedListingRepository.existsByUserIdAndItemId( userId, itemId ) );
		} catch ( Exception e ) {
			return ResponseEntity.badRequest().build();
		}
	}
}