package org.marketplace.marketplace.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
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
import org.springframework.data.domain.PageRequest;
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
	private final S3Service s3Service;

	// key - userId, value - List of past 5 most recently viwed items
	// in memory cache for long sessions
	private List<ItemDto> userRecentlyViewed;
	private Map<Long, List<ItemDto>> sessionRecentlyViewed;

	@Transactional
	public Long addItem( final ItemRequest itemRequest ) {

		try {
			User user = userRepository.findById( Long.parseLong( itemRequest.getUserId() ) ).orElseThrow();

			Item item = Item.builder().title( itemRequest.getName() ).description( itemRequest.getDescription() )
					.price( BigDecimal.valueOf( itemRequest.getPrice() ) )
					.category( Category.fromString( itemRequest.getCategory() ) ).user( user ).status( Status.ACTIVE )
					.expirationDate( LocalDateTime.now().plusDays( 7L ) ).createdAt( LocalDateTime.now() ).build();
			Item savedItem = itemRepository.save( item );
			log.info( "Item added successfully: {}, id: {}", itemRequest, savedItem.getId() );
			return savedItem.getId();

		} catch ( NoSuchElementException e ) {
			log.error( e.getMessage(), e );
		}
		return null;

	}

	public Boolean deleteItem( final Long itemId ) {

		try {
			Item item = itemRepository.findById( itemId ).orElseThrow();
			// Delete associated images
			s3Service.deleteItemImages( itemId );
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
				List<String> imageUrls = s3Service.getItemImagesUrls( item.getId() );
				itemDtos.add( ItemDto.from( item, imageUrls ) );
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
			return items.stream().map( item -> ItemDto.from( item, s3Service.getItemImagesUrls( item.getId() ) ) )
					.collect( Collectors.toList() );
		} catch ( Exception e ) {
			log.error( e.getMessage(), e );
		}
		return Collections.emptyList();
	}

	public List<ItemDto> search( String query, int page, int size ) {

		try {
			// Use the provided pagination parameters
			List<Item> results = itemRepository.searchItems( query, Status.ACTIVE, PageRequest.of( page, size ) )
					.orElseThrow( () -> new RuntimeException( "Error fetching items." ) );

			// Convert to DTOs but with optimized image URL fetching
			return results.stream().map( item -> {
				try {
					List<String> imageUrls = s3Service.getItemImagesUrls( item.getId() );
					return ItemDto.from( item, imageUrls );
				} catch ( Exception e ) {
					log.error( "Error fetching image URLs for item {}: {}", item.getId(), e.getMessage() );
					return ItemDto.from( item, List.of() ); // Empty image list on error
				}
			} ).collect( Collectors.toList() );
		} catch ( Exception e ) {
			log.error( "Error searching for items with query '{}' (page {}, size {}): {}", query, page, size,
					e.getMessage(), e );
		}
		return Collections.emptyList();
	}

	public ItemDto getItemById( Long itemId ) {

		try {
			Item item = itemRepository.findById( itemId )
					.orElseThrow( () -> new NoSuchElementException( "Item not found with id: " + itemId ) );

			List<String> imageUrls = s3Service.getItemImagesUrls( itemId );

			ItemDto itemDto = ItemDto.from( item, imageUrls );
			if ( !sessionRecentlyViewed.containsKey( itemId ) ) {
				sessionRecentlyViewed.put( item.getUser().getID(),
						sessionRecentlyViewed.get( item.getUser().getID() ).add( itemDto ) );
			}
			return itemDto;

		} catch ( Exception e ) {
			log.error( "Error fetching item with id: {}", itemId, e );
			return null;
		}
	}
}
