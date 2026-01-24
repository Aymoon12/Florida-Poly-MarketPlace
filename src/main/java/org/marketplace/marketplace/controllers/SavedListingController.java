package org.marketplace.marketplace.controllers;

import org.marketplace.marketplace.auth.config.AuthenticationUtil;
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
	public ResponseEntity<?> saveItem( @RequestParam( "itemId" ) final Long itemId ) {

		Long userId = AuthenticationUtil.getCurrentUserId();
		return ResponseEntity.ok( savedListingService.saveItem( userId, itemId ) );
	}

	@DeleteMapping( "/unsave" )
	public ResponseEntity<?> unsaveItem( @RequestParam( "itemId" ) final Long itemId ) {

		Long userId = AuthenticationUtil.getCurrentUserId();
		return ResponseEntity.ok( savedListingService.unsaveItem( userId, itemId ) );
	}

	@GetMapping( "/last-five" )
	public ResponseEntity<?> getLastFiveSavedListings() {

		Long userId = AuthenticationUtil.getCurrentUserId();
		final var savedListings = savedListingService.getLastFiveSavedListings( userId );
		log.info( "Last five saved listings retrieved successfully" );
		return ResponseEntity.ok( savedListings );
	}

	@GetMapping( "/getAllSaved" )
	public ResponseEntity<?> getSaved() {

		Long userId = AuthenticationUtil.getCurrentUserId();
		return ResponseEntity.ok( savedListingService.getSavedListings( userId ) );
	}

	@GetMapping( "/check" )
	public ResponseEntity<?> isItemSaved( @RequestParam( "itemId" ) final Long itemId ) {

		Long userId = AuthenticationUtil.getCurrentUserId();
		return ResponseEntity.ok( savedListingRepository.existsByUserIdAndItemId( userId, itemId ) );
	}
}
