package org.marketplace.marketplace.controllers;

import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.SavedListingRepository;
import org.marketplace.marketplace.services.SavedListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
	public ResponseEntity<?> saveItem( @AuthenticationPrincipal User user,
			@RequestParam( "itemId" ) final Long itemId ) {

		return ResponseEntity.ok( savedListingService.saveItem( user.getID(), itemId ) );
	}

	@DeleteMapping( "/unsave" )
	public ResponseEntity<?> unsaveItem( @AuthenticationPrincipal User user,
			@RequestParam( "itemId" ) final Long itemId ) {

		return ResponseEntity.ok( savedListingService.unsaveItem( user.getID(), itemId ) );
	}

	@GetMapping( "/last-five" )
	public ResponseEntity<?> getLastFiveSavedListings( @AuthenticationPrincipal User user ) {

		final var savedListings = savedListingService.getLastFiveSavedListings( user.getID() );
		log.info( "Last five saved listings retrieved successfully" );
		return ResponseEntity.ok( savedListings );
	}

	@GetMapping( "/getAllSaved" )
	public ResponseEntity<?> getSaved( @AuthenticationPrincipal User user ) {

		return ResponseEntity.ok( savedListingService.getSavedListings( user.getID() ) );
	}

	@GetMapping( "/check" )
	public ResponseEntity<?> isItemSaved( @AuthenticationPrincipal User user,
			@RequestParam( "itemId" ) final Long itemId ) {

		return ResponseEntity.ok( savedListingRepository.existsByUserIdAndItemId( user.getID(), itemId ) );
	}
}
