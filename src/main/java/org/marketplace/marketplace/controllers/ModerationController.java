package org.marketplace.marketplace.controllers;

import java.util.List;

import org.marketplace.marketplace.dto.BlockedUserDto;
import org.marketplace.marketplace.dto.CreateReportRequest;
import org.marketplace.marketplace.dto.ReportDto;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.services.BlockedUserService;
import org.marketplace.marketplace.services.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping( "api/v1/moderation" )
@CrossOrigin
@RequiredArgsConstructor
@Log4j2
public class ModerationController {

	private final ReportService reportService;
	private final BlockedUserService blockedUserService;

	// ========== Reporting Endpoints ==========

	@PostMapping( "/report" )
	public ResponseEntity<ReportDto> createReport( @AuthenticationPrincipal User user,
			@Valid @RequestBody CreateReportRequest request ) {

		log.info( "User {} creating report", user.getID() );
		ReportDto report = reportService.createReport( user.getID(), request );
		return ResponseEntity.ok( report );
	}

	@GetMapping( "/reports" )
	public ResponseEntity<List<ReportDto>> getMyReports( @AuthenticationPrincipal User user ) {

		List<ReportDto> reports = reportService.getUserReports( user.getID() );
		return ResponseEntity.ok( reports );
	}

	// ========== Blocking Endpoints ==========

	@PostMapping( "/block/{userId}" )
	public ResponseEntity<BlockedUserDto> blockUser( @AuthenticationPrincipal User user,
			@PathVariable Long userId ) {

		log.info( "User {} blocking user {}", user.getID(), userId );
		BlockedUserDto blocked = blockedUserService.blockUser( user.getID(), userId );
		return ResponseEntity.ok( blocked );
	}

	@DeleteMapping( "/block/{userId}" )
	public ResponseEntity<Void> unblockUser( @AuthenticationPrincipal User user,
			@PathVariable Long userId ) {

		log.info( "User {} unblocking user {}", user.getID(), userId );
		blockedUserService.unblockUser( user.getID(), userId );
		return ResponseEntity.ok().build();
	}

	@GetMapping( "/blocked" )
	public ResponseEntity<List<BlockedUserDto>> getBlockedUsers( @AuthenticationPrincipal User user ) {

		List<BlockedUserDto> blockedUsers = blockedUserService.getBlockedUsers( user.getID() );
		return ResponseEntity.ok( blockedUsers );
	}

	@GetMapping( "/blocked/{userId}/check" )
	public ResponseEntity<Boolean> isUserBlocked( @AuthenticationPrincipal User user,
			@PathVariable Long userId ) {

		boolean isBlocked = blockedUserService.isBlocked( user.getID(), userId );
		return ResponseEntity.ok( isBlocked );
	}
}
