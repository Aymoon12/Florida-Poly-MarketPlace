package org.marketplace.marketplace.repository;

import java.util.List;

import org.marketplace.marketplace.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE m.conversation.id = ?1 ORDER BY m.sentAt ASC")
    List<Message> findAllByConversationId(Long conversationId);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation.id = ?1 AND m.isRead = false AND m.sender.ID != ?2")
    Long countUnreadByConversationAndUser(Long conversationId, Long userId);
} 