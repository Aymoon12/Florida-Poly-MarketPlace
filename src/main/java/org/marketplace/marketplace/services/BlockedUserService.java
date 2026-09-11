package org.marketplace.marketplace.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.marketplace.marketplace.dto.BlockedUserDto;
import org.marketplace.marketplace.entities.BlockedUser;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.BlockedUserRepository;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class BlockedUserService {

	private final BlockedUserRepository blockedUserRepository;
	private final UserRepository userRepository;

	@Transactional
	public BlockedUserDto blockUser( Long blockerId, Long blockedId ) {

		// Prevent self-blocking
		if ( blockerId.equals( blockedId ) ) {
			throw new IllegalArgumentException( "Cannot block yourself" );
		}

		// Check if already blocked
		if ( blockedUserRepository.existsByBlockerIdAndBlockedId( blockerId, blockedId ) ) {
			throw new IllegalArgumentException( "User is already blocked" );
		}

		User blocker = userRepository.findById( blockerId )
				.orElseThrow( () -> new EntityNotFoundException( "User not found" ) );

		User blocked = userRepository.findById( blockedId )
				.orElseThrow( () -> new EntityNotFoundException( "User to block not found" ) );

		BlockedUser blockedUser = BlockedUser.builder()
				.blocker( blocker )
				.blocked( blocked )
				.createdAt( LocalDateTime.now() )
				.build();

		blockedUser = blockedUserRepository.save( blockedUser );
		log.info( "User blocked: blockerId={}, blockedId={}", blockerId, blockedId );

		return BlockedUserDto.from( blockedUser );
	}

	@Transactional
	public void unblockUser( Long blockerId, Long blockedId ) {

		BlockedUser blockedUser = blockedUserRepository.findByBlockerIdAndBlockedId( blockerId, blockedId )
				.orElseThrow( () -> new EntityNotFoundException( "Block relationship not found" ) );

		blockedUserRepository.delete( blockedUser );
		log.info( "User unblocked: blockerId={}, blockedId={}", blockerId, blockedId );
	}

	public List<BlockedUserDto> getBlockedUsers( Long blockerId ) {

		return blockedUserRepository.findByBlockerId( blockerId ).stream()
				.map( BlockedUserDto::from )
				.collect( Collectors.toList() );
	}

	public boolean isBlocked( Long blockerId, Long blockedId ) {

		return blockedUserRepository.existsByBlockerIdAndBlockedId( blockerId, blockedId );
	}

	public boolean isBlockedBetweenUsers( Long userId1, Long userId2 ) {

		return blockedUserRepository.isBlockedBetweenUsers( userId1, userId2 );
	}
}
