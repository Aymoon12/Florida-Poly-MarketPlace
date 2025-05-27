package org.marketplace.marketplace.repository;

import java.util.Optional;

import org.marketplace.marketplace.entities.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Repository for managing UserSettings entities.
 */
@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {

    /**
     * Find settings for a specific user.
     *
     * @param userId The ID of the user
     * @return Optional containing the user settings if found
     */
    @Query("SELECT s FROM UserSettings s WHERE s.user.ID = :userId")
    Optional<UserSettings> findByUserId(@Param("userId") Long userId);
}
