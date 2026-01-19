package org.marketplace.marketplace.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.marketplace.marketplace.dto.BuyerInfoDto;
import org.marketplace.marketplace.dto.MarkAsSoldRequest;
import org.marketplace.marketplace.dto.SaleDto;
import org.marketplace.marketplace.entities.Conversation;
import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.ReviewType;
import org.marketplace.marketplace.entities.Sale;
import org.marketplace.marketplace.entities.Status;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.ConversationRepository;
import org.marketplace.marketplace.repository.ItemRepository;
import org.marketplace.marketplace.repository.ReviewRepository;
import org.marketplace.marketplace.repository.SaleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class SaleService {

	private final SaleRepository saleRepository;
	private final ItemRepository itemRepository;
	private final UserService userService;
	private final ConversationRepository conversationRepository;
	private final ReviewRepository reviewRepository;

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

	@Transactional
	public SaleDto markAsSold( Long sellerId, MarkAsSoldRequest request ) {

		User seller = userService.getUser( sellerId );
		if ( seller == null ) {
			throw new ResponseStatusException( HttpStatus.NOT_FOUND, "Seller not found" );
		}

		Item item = itemRepository.findItemById( request.getItemId() )
				.orElseThrow( () -> new ResponseStatusException( HttpStatus.NOT_FOUND, "Item not found" ) );

		if ( !item.getUser().getID().equals( sellerId ) ) {
			throw new ResponseStatusException( HttpStatus.FORBIDDEN, "You can only mark your own items as sold" );
		}

		if ( item.getStatus() != Status.ACTIVE ) {
			throw new ResponseStatusException( HttpStatus.BAD_REQUEST, "Item is not active" );
		}

		User buyer = userService.getUser( request.getBuyerId() );
		if ( buyer == null ) {
			throw new ResponseStatusException( HttpStatus.NOT_FOUND, "Buyer not found" );
		}

		if ( buyer.getID().equals( sellerId ) ) {
			throw new ResponseStatusException( HttpStatus.BAD_REQUEST, "Cannot sell to yourself" );
		}

		Sale sale = Sale.builder()
				.salesDate( LocalDate.now() )
				.salesPrice( request.getSalePrice() )
				.seller( seller )
				.buyer( buyer )
				.item( item )
				.build();

		item.setStatus( Status.SOLD );
		itemRepository.save( item );
		Sale savedSale = saleRepository.save( sale );

		log.info( "Item {} marked as sold to buyer {} for ${}", item.getId(), buyer.getID(), request.getSalePrice() );

		return SaleDto.from( savedSale, false, false, false );
	}

	@Transactional( readOnly = true )
	public List<BuyerInfoDto> getPotentialBuyers( Long sellerId, Long itemId ) {

		Item item = itemRepository.findItemById( itemId )
				.orElseThrow( () -> new ResponseStatusException( HttpStatus.NOT_FOUND, "Item not found" ) );

		if ( !item.getUser().getID().equals( sellerId ) ) {
			throw new ResponseStatusException( HttpStatus.FORBIDDEN, "You can only view buyers for your own items" );
		}

		List<Conversation> conversations = conversationRepository.findAllByItemId( itemId );

		return conversations.stream()
				.map( conv -> BuyerInfoDto.builder()
						.id( conv.getBuyer().getID() )
						.name( conv.getBuyer().getName() )
						.email( conv.getBuyer().getEmail() )
						.conversationId( conv.getId() )
						.build() )
				.collect( Collectors.toList() );
	}

	@Transactional( readOnly = true )
	public List<SaleDto> getUserSales( Long userId ) {

		List<Sale> sellerSales = saleRepository.findBySellerId( userId );
		List<Sale> buyerSales = saleRepository.findByBuyerId( userId );

		List<SaleDto> allSales = new ArrayList<>();

		for ( Sale sale : sellerSales ) {
			boolean sellerReviewed = reviewRepository
					.findBySaleIdAndReviewType( sale.getId(), ReviewType.SELLER ).isPresent();
			boolean buyerReviewed = reviewRepository
					.findBySaleIdAndReviewType( sale.getId(), ReviewType.BUYER ).isPresent();
			boolean itemReviewed = reviewRepository
					.findBySaleIdAndReviewType( sale.getId(), ReviewType.ITEM ).isPresent();
			allSales.add( SaleDto.from( sale, sellerReviewed, buyerReviewed, itemReviewed ) );
		}

		for ( Sale sale : buyerSales ) {
			boolean sellerReviewed = reviewRepository
					.findBySaleIdAndReviewType( sale.getId(), ReviewType.SELLER ).isPresent();
			boolean buyerReviewed = reviewRepository
					.findBySaleIdAndReviewType( sale.getId(), ReviewType.BUYER ).isPresent();
			boolean itemReviewed = reviewRepository
					.findBySaleIdAndReviewType( sale.getId(), ReviewType.ITEM ).isPresent();
			allSales.add( SaleDto.from( sale, sellerReviewed, buyerReviewed, itemReviewed ) );
		}

		return allSales;
	}

	@Transactional( readOnly = true )
	public List<SaleDto> getPendingReviews( Long userId ) {

		List<Sale> buyerSales = saleRepository.findByBuyerId( userId );
		List<Sale> sellerSales = saleRepository.findBySellerId( userId );

		List<SaleDto> pendingReviews = new ArrayList<>();

		for ( Sale sale : buyerSales ) {
			boolean sellerReviewed = reviewRepository
					.findBySaleIdAndReviewType( sale.getId(), ReviewType.SELLER ).isPresent();
			boolean itemReviewed = reviewRepository
					.findBySaleIdAndReviewType( sale.getId(), ReviewType.ITEM ).isPresent();

			if ( !sellerReviewed || !itemReviewed ) {
				pendingReviews.add( SaleDto.from( sale, sellerReviewed, false, itemReviewed ) );
			}
		}

		for ( Sale sale : sellerSales ) {
			boolean buyerReviewed = reviewRepository
					.findBySaleIdAndReviewType( sale.getId(), ReviewType.BUYER ).isPresent();

			if ( !buyerReviewed ) {
				pendingReviews.add( SaleDto.from( sale, false, buyerReviewed, false ) );
			}
		}

		return pendingReviews;
	}

}
