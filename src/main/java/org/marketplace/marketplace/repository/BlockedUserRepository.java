package org.marketplace.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.marketplace.marketplace.entities.BlockedUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BlockedUserRepository extends JpaRepository<BlockedUser, Long> {

	@Query( "SELECT b FROM BlockedUser b WHERE b.blocker.ID = :blockerId" )
	List<BlockedUser> findByBlockerId( Long blockerId );

	@Query( "SELECT b FROM BlockedUser b WHERE b.blocker.ID = :blockerId AND b.blocked.ID = :blockedId" )
	Optional<BlockedUser> findByBlockerIdAndBlockedId( Long blockerId, Long blockedId );

	@Query( "SELECT COUNT(b) > 0 FROM BlockedUser b WHERE b.blocker.ID = :blockerId AND b.blocked.ID = :blockedId" )
	boolean existsByBlockerIdAndBlockedId( Long blockerId, Long blockedId );

	@Query( "SELECT COUNT(b) > 0 FROM BlockedUser b WHERE " +
			"(b.blocker.ID = :userId1 AND b.blocked.ID = :userId2) OR " +
			"(b.blocker.ID = :userId2 AND b.blocked.ID = :userId1)" )
	boolean isBlockedBetweenUsers( Long userId1, Long userId2 );

	@Modifying
	@Query( "DELETE FROM BlockedUser b WHERE b.blocker.ID = :blockerId AND b.blocked.ID = :blockedId" )
	void deleteByBlockerIdAndBlockedId( Long blockerId, Long blockedId );
}
