package org.marketplace.marketplace.controllers;

import org.marketplace.marketplace.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequestMapping( "api/v1/user" )
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@PostMapping( "/viewItem" )
	public ResponseEntity<?> viewItem( @RequestParam( "userId" ) final Long userid,
			@RequestParam( "itemId" ) final Long itemId ) {

		return ResponseEntity.ok( userService.viewItem( userid, itemId ) );
	}

}
