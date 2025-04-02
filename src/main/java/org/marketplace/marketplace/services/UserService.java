package org.marketplace.marketplace.services;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

import org.marketplace.marketplace.dto.DashboardDto;
import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.Sale;
import org.marketplace.marketplace.entities.Status;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.entities.ViewHistory;
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
	private final ViewHistoryService viewHistoryService;
	private final S3Service s3Service;

	public Boolean userExists( final Long userId ) {

		return userRepository.findById( userId ).isPresent();
	}

	public User getUser( final Long userId ) {

		return userRepository.findById( userId ).orElse( null );
	}

	public void viewItem( final Long userid, final Item item ) {

		try {
			User user = userRepository.findById( userid ).orElseThrow( () -> new RuntimeException( "User not found" ) );

			// Find existing view history for this item
			ViewHistory existingView = user.getItemHistory().stream()
					.filter( view -> view.getItem().getId().equals( item.getId() ) ).findFirst().orElse( null );

			if ( existingView != null ) {
				// Update the viewedAt timestamp
				existingView.setViewedAt( ZonedDateTime.now() );
				viewHistoryService.save( existingView );
				log.info( "Updated view timestamp for user {} viewing item {}", userid, item.getId() );
			} else {
				// Create new view history
				ViewHistory view =
						ViewHistory.builder().user( user ).item( item ).viewedAt( ZonedDateTime.now() ).build();
				viewHistoryService.save( view );
				log.info( "Created new view history for user {} viewing item {}", userid, item.getId() );
			}
		} catch ( Exception e ) {
			log.error( "Error recording view for user {} viewing item {}: {}", userid, item.getId(), e.getMessage(),
					e );
		}
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

			final var activeListingsNum = activeListings.size();
			activeListings.stream().limit( 5 );
			return DashboardDto.builder().totalSales( totalSales ).totalPurchases( totalPurchases )
					.activeListings( activeListingsNum ).mySelling( s3Service.getItemDtos( activeListings ) )
					.recentActivity( recentActivity ).build();

		} catch ( Exception e ) {
			log.error( e.getMessage(), e );
		}
		return null;
	}
}
