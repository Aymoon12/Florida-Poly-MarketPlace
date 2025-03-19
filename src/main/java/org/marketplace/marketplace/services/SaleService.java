package org.marketplace.marketplace.services;

import java.time.LocalDate;

import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.Sale;
import org.marketplace.marketplace.entities.Status;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.ItemRepository;
import org.marketplace.marketplace.repository.SaleRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class SaleService {

	private final SaleRepository saleRepository;
	private final ItemRepository itemRepository;
	private final UserService userService;

	public Boolean itemSold( final Long itemId, final Long buyerId ) {

		try {
			User buyer = userService.getUser( buyerId );

			if ( buyer == null ) {
				throw new RuntimeException( "User not found" );
			}

			Item item = itemRepository.findItemById( itemId ).orElse( null );

			if ( item == null ) {
				throw new RuntimeException( "Item not found" );
			}

			if ( item.getStatus() != Status.ACTIVE ) {
				throw new RuntimeException( "Item is not active" );
			}

			Sale sale = Sale.builder().salesDate( LocalDate.now() ).salesPrice( item.getPrice() )
					.seller( item.getUser() ).buyer( buyer ).build();

			item.setStatus( Status.SOLD );
			itemRepository.save( item );
			saleRepository.save( sale );
			return true;

		} catch ( Exception e ) {
			log.error( e.getMessage(), e );
		}
		return false;
	}
}
