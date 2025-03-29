package org.marketplace.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.marketplace.marketplace.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

	@Query( "SELECT ci FROM CartItem ci WHERE ci.user.ID = ?1 " )
	List<CartItem> findByUserId( Long userId );

	@Query( "SELECT ci FROM CartItem ci WHERE ci.user.ID = :userId AND ci.item.id = :itemId" )
	Optional<CartItem> findByUserIdAndItemId( @Param( "userId" ) Long userId, @Param( "itemId" ) Long itemId );

	@Query( "SELECT COUNT(ci) FROM CartItem ci WHERE ci.user.ID = :userId" )
	Long countByUserId( @Param( "userId" ) Long userId );
}