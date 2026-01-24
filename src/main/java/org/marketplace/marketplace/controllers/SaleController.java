package org.marketplace.marketplace.controllers;

import java.util.List;

import org.marketplace.marketplace.auth.config.AuthenticationUtil;
import org.marketplace.marketplace.dto.BuyerInfoDto;
import org.marketplace.marketplace.dto.MarkAsSoldRequest;
import org.marketplace.marketplace.dto.SaleDto;
import org.marketplace.marketplace.services.SaleService;
import org.springframework.http.ResponseEntity;
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
	public ResponseEntity<SaleDto> markAsSold( @Valid @RequestBody MarkAsSoldRequest request ) {

		Long sellerId = AuthenticationUtil.getCurrentUserId();
		log.info( "Marking item {} as sold by seller {}", request.getItemId(), sellerId );
		SaleDto sale = saleService.markAsSold( sellerId, request );

		return ResponseEntity.ok( sale );
	}

	@GetMapping( "/potential-buyers" )
	public ResponseEntity<List<BuyerInfoDto>> getPotentialBuyers( @RequestParam Long itemId ) {

		Long sellerId = AuthenticationUtil.getCurrentUserId();
		log.info( "Fetching potential buyers for item {} by seller {}", itemId, sellerId );
		List<BuyerInfoDto> buyers = saleService.getPotentialBuyers( sellerId, itemId );

		return ResponseEntity.ok( buyers );
	}

	@GetMapping( "/user-sales" )
	public ResponseEntity<List<SaleDto>> getUserSales() {

		Long userId = AuthenticationUtil.getCurrentUserId();
		log.info( "Fetching sales for user {}", userId );
		List<SaleDto> sales = saleService.getUserSales( userId );

		return ResponseEntity.ok( sales );
	}

	@GetMapping( "/pending-reviews" )
	public ResponseEntity<List<SaleDto>> getPendingReviews() {

		Long userId = AuthenticationUtil.getCurrentUserId();
		log.info( "Fetching pending reviews for user {}", userId );
		List<SaleDto> pendingReviews = saleService.getPendingReviews( userId );

		return ResponseEntity.ok( pendingReviews );
	}

}
