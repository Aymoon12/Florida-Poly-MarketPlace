package org.marketplace.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.marketplace.marketplace.entities.Review;
import org.marketplace.marketplace.entities.ReviewType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

	@Query( "SELECT r FROM Review r WHERE r.reviewedSeller.ID = :sellerId ORDER BY r.createdAt DESC" )
	List<Review> findByReviewedSellerId( @Param( "sellerId" ) Long sellerId );

	@Query( "SELECT r FROM Review r WHERE r.reviewedSeller.ID = :sellerId ORDER BY r.createdAt DESC" )
	List<Review> findByReviewedSellerId( @Param( "sellerId" ) Long sellerId, Pageable pageable );

	@Query( "SELECT r FROM Review r WHERE r.reviewedItem.id = :itemId ORDER BY r.createdAt DESC" )
	List<Review> findByReviewedItemId( @Param( "itemId" ) Long itemId );

	@Query( "SELECT r FROM Review r WHERE r.reviewedItem.id = :itemId ORDER BY r.createdAt DESC" )
	List<Review> findByReviewedItemId( @Param( "itemId" ) Long itemId, Pageable pageable );

	@Query( "SELECT AVG(r.rating) FROM Review r WHERE r.reviewedSeller.ID = :sellerId" )
	Double calculateAverageSellerRating( @Param( "sellerId" ) Long sellerId );

	@Query( "SELECT AVG(r.rating) FROM Review r WHERE r.reviewedItem.id = :itemId" )
	Double calculateAverageItemRating( @Param( "itemId" ) Long itemId );

	@Query( "SELECT COUNT(r) FROM Review r WHERE r.reviewedSeller.ID = :sellerId" )
	Long countSellerReviews( @Param( "sellerId" ) Long sellerId );

	@Query( "SELECT COUNT(r) FROM Review r WHERE r.reviewedItem.id = :itemId" )
	Long countItemReviews( @Param( "itemId" ) Long itemId );

	@Query( "SELECT r FROM Review r WHERE r.sale.Id = :saleId AND r.reviewType = :reviewType" )
	Optional<Review> findBySaleIdAndReviewType( @Param( "saleId" ) Long saleId,
			@Param( "reviewType" ) ReviewType reviewType );

	@Query( "SELECT r FROM Review r WHERE r.reviewer.ID = :reviewerId ORDER BY r.createdAt DESC" )
	List<Review> findByReviewerId( @Param( "reviewerId" ) Long reviewerId );

}
