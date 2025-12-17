package org.marketplace.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.marketplace.marketplace.entities.Sale;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

	@Query( "SELECT i FROM Sale i WHERE i.seller.ID = ?1 OR i.buyer.ID =?1 ORDER BY i.salesDate" )
	Optional<List<Sale>> findRecentActivity( Long userId, Pageable pageable );

	@Query( "SELECT s FROM Sale s WHERE s.buyer.ID = :buyerId AND s.seller.ID = :sellerId" )
	Optional<Sale> findByBuyerIdAndSellerId( @Param( "buyerId" ) Long buyerId, @Param( "sellerId" ) Long sellerId );

	@Query( "SELECT s FROM Sale s WHERE s.buyer.ID = :buyerId AND s.item.id = :itemId" )
	Optional<Sale> findByBuyerIdAndItemId( @Param( "buyerId" ) Long buyerId, @Param( "itemId" ) Long itemId );

	@Query( "SELECT s FROM Sale s WHERE s.buyer.ID = :buyerId ORDER BY s.salesDate DESC" )
	List<Sale> findByBuyerId( @Param( "buyerId" ) Long buyerId );

}
