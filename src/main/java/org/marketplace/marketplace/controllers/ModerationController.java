package org.marketplace.marketplace.controllers;

import java.util.List;

import org.marketplace.marketplace.auth.config.AuthenticationUtil;
import org.marketplace.marketplace.dto.BlockedUserDto;
import org.marketplace.marketplace.dto.CreateReportRequest;
import org.marketplace.marketplace.dto.ReportDto;
import org.marketplace.marketplace.services.BlockedUserService;
import org.marketplace.marketplace.services.ReportService;
import org.springframework.http.ResponseEntity;
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
	public ResponseEntity<ReportDto> createReport( @Valid @RequestBody CreateReportRequest request ) {

		Long userId = AuthenticationUtil.getCurrentUserId();
		log.info( "User {} creating report", userId );
		ReportDto report = reportService.createReport( userId, request );
		return ResponseEntity.ok( report );
	}

	@GetMapping( "/reports" )
	public ResponseEntity<List<ReportDto>> getMyReports() {

		Long userId = AuthenticationUtil.getCurrentUserId();
		List<ReportDto> reports = reportService.getUserReports( userId );
		return ResponseEntity.ok( reports );
	}

	// ========== Blocking Endpoints ==========

	@PostMapping( "/block/{userId}" )
	public ResponseEntity<BlockedUserDto> blockUser( @PathVariable Long userId ) {

		Long currentUserId = AuthenticationUtil.getCurrentUserId();
		log.info( "User {} blocking user {}", currentUserId, userId );
		BlockedUserDto blocked = blockedUserService.blockUser( currentUserId, userId );
		return ResponseEntity.ok( blocked );
	}

	@DeleteMapping( "/block/{userId}" )
	public ResponseEntity<Void> unblockUser( @PathVariable Long userId ) {

		Long currentUserId = AuthenticationUtil.getCurrentUserId();
		log.info( "User {} unblocking user {}", currentUserId, userId );
		blockedUserService.unblockUser( currentUserId, userId );
		return ResponseEntity.ok().build();
	}

	@GetMapping( "/blocked" )
	public ResponseEntity<List<BlockedUserDto>> getBlockedUsers() {

		Long userId = AuthenticationUtil.getCurrentUserId();
		List<BlockedUserDto> blockedUsers = blockedUserService.getBlockedUsers( userId );
		return ResponseEntity.ok( blockedUsers );
	}

	@GetMapping( "/blocked/{userId}/check" )
	public ResponseEntity<Boolean> isUserBlocked( @PathVariable Long userId ) {

		Long currentUserId = AuthenticationUtil.getCurrentUserId();
		boolean isBlocked = blockedUserService.isBlocked( currentUserId, userId );
		return ResponseEntity.ok( isBlocked );
	}
}
