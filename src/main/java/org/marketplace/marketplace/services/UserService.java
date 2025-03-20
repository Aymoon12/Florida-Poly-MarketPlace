package org.marketplace.marketplace.services;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.marketplace.marketplace.dto.DashboardDto;
import org.marketplace.marketplace.dto.ItemDto;
import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.Sale;
import org.marketplace.marketplace.entities.Status;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.ItemRepository;
import org.marketplace.marketplace.repository.SaleRepository;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserService {

	private final UserRepository userRepository;
	private final ItemRepository itemRepository;
	private final SaleRepository saleRepository;

	public Boolean userExists( final Long userId ) {

		return userRepository.findById( userId ).isPresent();
	}

	public User getUser( final Long userId ) {

		return userRepository.findById( userId ).orElse( null );
	}

	public Boolean viewItem( final Long userid, final Long itemId ) {

		try {

			User user = userRepository.findById( userid ).orElseThrow( () -> new RuntimeException( "User not found" ) );
			Item item = itemRepository.findById( itemId ).orElseThrow( () -> new RuntimeException( "item not found" ) );

			user.getHistory().addFirst( item );
			userRepository.save( user );
			return true;

		} catch ( Exception e ) {
			log.error( e.getMessage(), e );
		}
		return false;
	}

	public List<ItemDto> recentlyViewedItems( final Long userid ) {

		try {

			User user = userRepository.findById( userid ).orElseThrow( () -> new RuntimeException( "User not found" ) );

			return user.getHistory().stream().filter( item -> item.getStatus() == Status.ACTIVE ).limit( 4 )
					.map( ItemDto::from ).collect( Collectors.toList() );

		} catch ( Exception e ) {
			log.error( e.getMessage(), e );
		}
		return Collections.emptyList();
	}

	public DashboardDto getDashboard( final Long userid ) {

		try {

			User user = userRepository.findById( userid ).orElseThrow( () -> new RuntimeException( "User not found" ) );

			BigDecimal totalSales =
					user.getSales().stream().map( Sale::getSalesPrice ).reduce( BigDecimal.ZERO, BigDecimal::add );
			BigDecimal totalPurchases =
					user.getPurchases().stream().map( Sale::getSalesPrice ).reduce( BigDecimal.ZERO, BigDecimal::add );

			List<Sale> recentActivity = saleRepository.findRecentActivity( userid, PageRequest.of( 0, 5 ) )
					.orElseThrow( () -> new RuntimeException( "Error finding Recent Activity" ) );

			List<Item> activeListings = itemRepository.findAllItemsByUserIDAndStatus( userid, Status.ACTIVE )
					.orElseThrow( () -> new RuntimeException( "Error finding Active Items." ) );

			return DashboardDto.builder().totalSales( totalSales ).totalPurchases( totalPurchases )
					.activeListings( activeListings.size() ).recentActivity( recentActivity ).build();

		} catch ( Exception e ) {
			log.error( e.getMessage(), e );
		}
		return null;
	}
}
