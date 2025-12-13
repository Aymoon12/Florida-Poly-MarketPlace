package org.marketplace.marketplace.auth.config;

import java.util.concurrent.TimeUnit;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
@EnableCaching
public class CacheConfig {

	public static final String ITEM_IMAGES_CACHE = "itemImages";
	public static final String ITEM_WATCHERS_CACHE = "itemWatchers";
	public static final String USER_CACHE = "users";

	@Bean
	public CacheManager cacheManager() {

		CaffeineCacheManager cacheManager = new CaffeineCacheManager();

		// Register the cache names we want to manage
		cacheManager.setCacheNames( java.util.List.of( ITEM_IMAGES_CACHE, ITEM_WATCHERS_CACHE, USER_CACHE ) );

		// Default cache configuration - 10 minutes for item images (slightly less than presigned URL expiry)
		cacheManager.setCaffeine( Caffeine.newBuilder()
				.expireAfterWrite( 10, TimeUnit.MINUTES )
				.maximumSize( 1000 )
				.recordStats() );

		return cacheManager;
	}

}
