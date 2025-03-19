package org.marketplace.marketplace.services;

import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;

	public Boolean userExists( final Long userId ) {

		return userRepository.findById( userId ).isPresent();
	}

	public User getUser( final Long userId ) {

		return userRepository.findById( userId ).orElse( null );
	}

}
