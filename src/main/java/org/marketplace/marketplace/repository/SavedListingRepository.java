package org.marketplace.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.marketplace.marketplace.entities.SavedListing;
import org.marketplace.marketplace.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SavedListingRepository extends JpaRepository<SavedListing, Long> {

	@Query( "SELECT s FROM SavedListing s WHERE s.user.ID = ?1" )
	Optional<List<SavedListing>> findAllByUserId( Long userId );

	@Query( "SELECT s FROM SavedListing s WHERE s.user.ID = ?1 AND s.item.id = ?2" )
	Optional<SavedListing> findByUserIdAndItemId( Long userId, Long itemId );

	@Query( "SELECT COUNT(s) > 0 FROM SavedListing s WHERE s.user.ID = ?1 AND s.item.id = ?2" )
	boolean existsByUserIdAndItemId( Long userId, Long itemId );

	@Modifying
	@Query( "DELETE FROM SavedListing s WHERE s.user.ID = ?1 AND s.item.id = ?2" )
	void deleteByUserIdAndItemId( Long userId, Long itemId );

	Long user( User user );
}