package org.marketplace.marketplace.controllers;

import org.marketplace.marketplace.services.SaleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping( "api/v1/sale" )
@CrossOrigin
@RequiredArgsConstructor
public class SaleController {

	private final SaleService saleService;

	@PostMapping( "/itemSold" )
	public ResponseEntity<?> itemSold( @RequestParam( "id" ) Long id, @RequestParam( "buyerId" ) Long buyerId ) {

		return ResponseEntity.ok( saleService.itemSold( id, buyerId ) );

	}
}
