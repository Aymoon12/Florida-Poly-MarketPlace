package org.marketplace.marketplace.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.marketplace.marketplace.dto.ItemDto;
import org.marketplace.marketplace.entities.Category;
import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.Status;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.ItemRepository;
import org.marketplace.marketplace.repository.UserRepository;
import org.marketplace.marketplace.requests.ItemRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@Transactional
@RequiredArgsConstructor
@Log4j2
public class ItemService {

	private final ItemRepository itemRepository;
	private final UserRepository userRepository;
	private final UserService userService;

	public Boolean addItem( final Long userId, final ItemRequest itemRequest ) {

		try {
			User user = userRepository.findById( userId ).orElseThrow();

			Item item = Item.builder().title( itemRequest.getName() ).description( itemRequest.getDescription() )
					.price( BigDecimal.valueOf( itemRequest.getPrice() ) )
					.category( Category.valueOf( itemRequest.getCategory() ) ).user( user ).status( Status.ACTIVE )
					.expirationDate( LocalDate.now().plusDays( 7L ) ).build();
			itemRepository.save( item );

			return true;

		} catch ( NoSuchElementException e ) {
			log.error( e.getMessage(), e );
		}
		return false;

	}

	public Boolean deleteItem( final Long itemId ) {

		try {
			Item item = itemRepository.findById( itemId ).orElseThrow();
			itemRepository.delete( item );
			return true;

		} catch ( NoSuchElementException e ) {
			log.error( e.getMessage(), e );
		}
		return false;

	}

	public List<ItemDto> getAllActiveListings( final Long userId ) {

		try {
			User user = userService.getUser( userId );
			if ( user == null ) {
				throw new UsernameNotFoundException( "User not found" );
			}
			List<Item> items = user.getItems().stream().filter( item -> item.getStatus() == Status.ACTIVE ).toList();
			List<ItemDto> itemDtos = new ArrayList<>();
			for ( Item item : items ) {
				itemDtos.add( ItemDto.from( item ) );
			}
			return itemDtos;

		} catch ( Exception e ) {
			log.error( e.getMessage(), e );
		}
		return Collections.emptyList();
	}

	public List<ItemDto> getAllListingsByCategory( final String category ) {

		try {

			List<Item> items = itemRepository.findAllItemsByCategory( Category.valueOf( category ) )
					.orElseThrow( () -> new RuntimeException( "Error fetching items." ) );
			return items.stream().map( ItemDto::from ).collect( Collectors.toList() );
		} catch ( Exception e ) {
			log.error( e.getMessage(), e );
		}
		return Collections.emptyList();
	}
}
