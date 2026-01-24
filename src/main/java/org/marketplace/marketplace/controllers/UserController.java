package org.marketplace.marketplace.controllers;

import org.marketplace.marketplace.auth.config.AuthenticationUtil;
import org.marketplace.marketplace.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequestMapping( "api/v1/user" )
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping( "/dashboardstats" )
	public ResponseEntity<?> getDashboardStats() {

		Long userId = AuthenticationUtil.getCurrentUserId();
		return ResponseEntity.ok( userService.getDashboard( userId ) );
	}

}
