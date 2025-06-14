package org.marketplace.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.marketplace.marketplace.entities.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c WHERE c.buyer.ID = ?1 ORDER BY c.updatedAt DESC")
    List<Conversation> findAllByBuyerId(Long buyerId);
    
    @Query("SELECT c FROM Conversation c WHERE c.seller.ID = ?1 ORDER BY c.updatedAt DESC")
    List<Conversation> findAllBySellerId(Long sellerId);
    
    @Query("SELECT c FROM Conversation c WHERE c.buyer.ID = ?1 OR c.seller.ID = ?1 ORDER BY c.updatedAt DESC")
    List<Conversation> findAllByUserId(Long userId);
    
    @Query("SELECT c FROM Conversation c WHERE c.buyer.ID = ?1 AND c.item.id = ?2")
    Optional<Conversation> findByBuyerIdAndItemId(Long buyerId, Long itemId);
    
    @Query("SELECT COUNT(c) FROM Conversation c WHERE (c.buyer.ID = ?1 AND c.isReadByBuyer = false) OR (c.seller.ID = ?1 AND c.isReadBySeller = false)")
    Long countUnreadByUserId(Long userId);
} 