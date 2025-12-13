package org.marketplace.marketplace.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

import org.jetbrains.annotations.NotNull;
import org.marketplace.marketplace.dto.ItemDto;
import org.marketplace.marketplace.entities.Category;
import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.SavedListing;
import org.marketplace.marketplace.entities.Status;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.entities.ViewHistory;
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
	private final ItemWatcherService watcherService;

	@Transactional
	public Long addItem( final ItemRequest itemRequest ) {

		try {
			User user = userRepository.findById( Long.parseLong( itemRequest.getUserId() ) ).orElseThrow();

			Item item = Item.builder().title( itemRequest.getName() ).description( itemRequest.getDescription() )
					.price( BigDecimal.valueOf( itemRequest.getPrice() ) )
					.category( Category.fromString( itemRequest.getCategory() ) ).user( user ).status( Status.ACTIVE )
					.expirationDate( LocalDateTime.now().plusDays( 7L ) ).quantity( 1 ).createdAt( LocalDateTime.now() )
					.build();
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
			// Reset watchers
			watcherService.resetWatchers( itemId );
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
			return getItemDtosWithWatchers( items );

		} catch ( Exception e ) {
			log.error( e.getMessage(), e );
		}
		return Collections.emptyList();
	}

	public List<ItemDto> getAllListingsByCategory( final String category ) {

		try {
			List<Item> items = itemRepository.findAllItemsByCategory( Category.fromString( category ) )
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

	public ItemDto getItemById( Long userId, Long itemId ) {

		try {

			Item item = savedItem( itemId, userId );

			if ( item == null ) {
				item = itemRepository.findById( itemId )
						.orElseThrow( () -> new NoSuchElementException( "Item not found with id: " + itemId ) );
			}

			List<String> imageUrls = s3Service.getItemImagesUrls( itemId );
			userService.viewItem( userId, item );
			item.setViews( item.getViews() + 1 );
			itemRepository.save( item );
			log.info( "Item viewed: {}, views: {}", itemId, item.getViews() );

			// Use the watcher service
			int watcherCount = watcherService.incrementWatchers( itemId );
			log.info( "Watchers for item {}: {}", itemId, watcherCount );

			return ItemDto.from( item, imageUrls, watcherCount );
		} catch ( Exception e ) {
			log.error( "Error fetching item with id: {}", itemId, e );
			return null;
		}
	}

	public List<ItemDto> getRecentlyViewedItems( Long userId ) {

		try {
			User user = userRepository.findById( userId ).orElseThrow( () -> new RuntimeException( "User not found" ) );

			// Get the 5 most recent items by sorting the view history by viewedAt in descending order
			List<Item> recent = user.getItemHistory().stream()
					.sorted( ( vh1, vh2 ) -> vh2.getViewedAt().compareTo( vh1.getViewedAt() ) ).limit( 4 )
					.map( ViewHistory::getItem ).toList();

			return s3Service.getItemDtos( recent );
		} catch ( final Exception e ) {
			log.error( "Error fetching recently viewed items for user {}: {}", userId, e.getMessage(), e );
		}
		return Collections.emptyList();
	}

	@NotNull
	private List<ItemDto> getItemDtosWithWatchers( List<Item> recent ) {

		List<ItemDto> itemDtos = new ArrayList<>();
		for ( Item item : recent ) {
			List<String> imageUrls = s3Service.getItemImagesUrls( item.getId() );
			int watcherCount = watcherService.getWatcherCount( item.getId() );
			itemDtos.add( ItemDto.from( item, imageUrls, watcherCount ) );
		}
		return itemDtos;
	}

	public List<ItemDto> getHistory( Long userId ) {

		try {

			User user = userRepository.findById( userId ).orElseThrow( () -> new RuntimeException( "User not found" ) );

			List<Item> history = user.getItemHistory().stream().map( ViewHistory::getItem )
					.filter( item -> item.getStatus() == Status.ACTIVE ).toList();
			return s3Service.getItemDtos( history );
		} catch ( final Exception e ) {
			log.error( e.getMessage(), e );
		}
		return Collections.emptyList();
	}

	public void decrementWatchers( Long itemId ) {

		watcherService.decrementWatchers( itemId );
	}

	private Item savedItem( Long itemId, Long userId ) {

		User user = userRepository.findById( userId ).orElse( null );

		if ( user != null ) {
			return user.getSavedListings().stream().map( SavedListing::getItem )
					.filter( item -> item.getId().equals( itemId ) ).findFirst().orElse( null );
		}
		return null;
	}

}
