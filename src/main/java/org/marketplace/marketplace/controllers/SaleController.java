package org.marketplace.marketplace.controllers;

import java.util.List;

import org.marketplace.marketplace.dto.BuyerInfoDto;
import org.marketplace.marketplace.dto.MarkAsSoldRequest;
import org.marketplace.marketplace.dto.SaleDto;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.services.SaleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping( "api/v1/sale" )
@CrossOrigin
@RequiredArgsConstructor
@Log4j2
public class SaleController {

	private final SaleService saleService;

	@PostMapping( "/itemSold" )
	public ResponseEntity<?> itemSold( @RequestParam( "id" ) Long id, @RequestParam( "buyerId" ) Long buyerId ) {

		return ResponseEntity.ok( saleService.itemSold( id, buyerId ) );
	}

	@PostMapping( "/mark-as-sold" )
	public ResponseEntity<SaleDto> markAsSold( @AuthenticationPrincipal User user,
			@Valid @RequestBody MarkAsSoldRequest request ) {

		log.info( "Marking item {} as sold by seller {}", request.getItemId(), user.getID() );
		SaleDto sale = saleService.markAsSold( user.getID(), request );

		return ResponseEntity.ok( sale );
	}

	@GetMapping( "/potential-buyers" )
	public ResponseEntity<List<BuyerInfoDto>> getPotentialBuyers( @AuthenticationPrincipal User user,
			@RequestParam Long itemId ) {

		log.info( "Fetching potential buyers for item {} by seller {}", itemId, user.getID() );
		List<BuyerInfoDto> buyers = saleService.getPotentialBuyers( user.getID(), itemId );

		return ResponseEntity.ok( buyers );
	}

	@GetMapping( "/user-sales" )
	public ResponseEntity<List<SaleDto>> getUserSales( @AuthenticationPrincipal User user ) {

		log.info( "Fetching sales for user {}", user.getID() );
		List<SaleDto> sales = saleService.getUserSales( user.getID() );

		return ResponseEntity.ok( sales );
	}

	@GetMapping( "/pending-reviews" )
	public ResponseEntity<List<SaleDto>> getPendingReviews( @AuthenticationPrincipal User user ) {

		log.info( "Fetching pending reviews for user {}", user.getID() );
		List<SaleDto> pendingReviews = saleService.getPendingReviews( user.getID() );

		return ResponseEntity.ok( pendingReviews );
	}

}
