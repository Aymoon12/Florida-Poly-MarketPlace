package org.marketplace.marketplace.repository;

import java.util.List;

import org.marketplace.marketplace.entities.ItemImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemImageRepository extends JpaRepository<ItemImage, Long> {

	@Query( "SELECT i FROM ItemImage i WHERE i.item.id = ?1 ORDER BY i.createdAt ASC" )
	List<ItemImage> findAllByItemId( Long itemId );

	@Query( "SELECT i.objectKey FROM ItemImage i WHERE i.item.id = ?1 ORDER BY i.createdAt ASC" )
	List<String> findObjectKeysByItemId( Long itemId );

	@Modifying
	@Query( "DELETE FROM ItemImage i WHERE i.item.id = ?1" )
	void deleteAllByItemId( Long itemId );

}
