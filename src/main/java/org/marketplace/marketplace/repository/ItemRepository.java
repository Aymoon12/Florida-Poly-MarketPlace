package org.marketplace.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.marketplace.marketplace.entities.Category;
import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.Status;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

	@Query( "SELECT i FROM Item i WHERE i.id = ?1" )
	Optional<Item> findItemById( final Long id );

	@Query( "SELECT i FROM Item i WHERE i.user = ?1 AND i.status = ?2" )
	Optional<List<Item>> findAllItemsByUserIDAndStatus( final Long user_id, final Status status );

	@Query( "SELECT i FROM Item i WHERE i.category = ?1 " )
	Optional<List<Item>> findAllItemsByCategory( final Category category_id );

	@Query( "SELECT i FROM Item i WHERE i.status = :status AND  LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) "
			+ "OR LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%'))  ORDER BY i.createdAt DESC " )
	Optional<List<Item>> searchItems( @Param( "keyword" ) String keyword, @Param( "status" ) Status status,
			Pageable pageable );

}
