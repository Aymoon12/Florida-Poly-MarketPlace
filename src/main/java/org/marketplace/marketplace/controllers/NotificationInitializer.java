package org.marketplace.marketplace.controllers;

import java.util.List;
import java.util.Optional;

import org.marketplace.marketplace.dto.NotificationRequest;
import org.marketplace.marketplace.entities.NotificationType;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.entities.UserSettings;
import org.marketplace.marketplace.repository.UserRepository;
import org.marketplace.marketplace.repository.UserSettingsRepository;
import org.marketplace.marketplace.services.NotificationService;
import org.marketplace.marketplace.services.UserSettingsService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

/**
 * This class initializes notifications and user settings for existing users who don't have these entities set up in the
 * database.
 */
@Configuration
@RequiredArgsConstructor
@Log4j2
public class NotificationInitializer {

	private final UserRepository userRepository;
	private final UserSettingsRepository userSettingsRepository;
	private final UserSettingsService userSettingsService;
	private final NotificationService notificationService;

	@Bean
	public CommandLineRunner initializeNotificationsAndSettings() {

		return args -> {
			log.info( "Initializing notifications and settings for users..." );
			createSettingsForExistingUsers();
			createWelcomeNotificationsForUsers();
			log.info( "Notification and settings initialization complete." );
		};
	}

	public void createSettingsForExistingUsers() {

		List<User> users = userRepository.findAll();
		log.info( "Found {} users to check for settings", users.size() );

		for ( User user : users ) {
			Optional<UserSettings> existingSettings = userSettingsRepository.findByUserId( user.getID() );

			if ( existingSettings.isEmpty() ) {
				log.info( "Creating default settings for user: {}", user.getID() );
				try {
					userSettingsService.createDefaultSettings( user.getID() );
				} catch ( Exception e ) {
					log.error( "Error creating default settings for user {}: {}", user.getID(), e.getMessage(), e );
				}
			}
		}
	}

	public void createWelcomeNotificationsForUsers() {

		List<User> users = userRepository.findAll();
		log.info( "Creating welcome notifications for {} users if needed", users.size() );

		for ( User user : users ) {
			try {
				// Check if user already has notifications
				long notificationCount = notificationService.countUserNotifications( user.getID() );

				if ( notificationCount == 0 ) {
					log.info( "Creating welcome notification for user: {}", user.getID() );

					NotificationRequest welcomeNotification = NotificationRequest.builder().userId( user.getID() )
							.title( "Welcome to Florida Poly MarketPlace!" )
							.message(
									"Thanks for joining our community. Start buying and selling items with fellow students and faculty." )
							.type( NotificationType.SYSTEM_ALERT ).actionUrl( "/home" ).build();

					notificationService.createNotification( welcomeNotification );
				}
			} catch ( Exception e ) {
				log.error( "Error creating welcome notification for user {}: {}", user.getID(), e.getMessage(), e );
			}
		}
	}
}