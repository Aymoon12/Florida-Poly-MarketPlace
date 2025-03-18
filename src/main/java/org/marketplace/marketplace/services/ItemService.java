package org.marketplace.marketplace.services;

import java.math.BigDecimal;
import java.util.NoSuchElementException;

import org.marketplace.marketplace.entities.Category;
import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.ItemRepository;
import org.marketplace.marketplace.repository.UserRepository;
import org.marketplace.marketplace.requests.ItemRequest;
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
					.category( Category.valueOf( itemRequest.getCategory() ) ).user( user ).build();
			itemRepository.save( item );

			return true;

		} catch ( NoSuchElementException e ) {
			log.error( e.getMessage(), e );
		}
		return false;

	}

	public Boolean deleteItem( Long itemId ) {

		try {
			Item item = itemRepository.findById( itemId ).orElseThrow();
			itemRepository.delete( item );
			return true;

		} catch ( NoSuchElementException e ) {
			log.error( e.getMessage(), e );
		}
		return false;

	}
}
