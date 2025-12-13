package org.marketplace.marketplace.services;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import lombok.extern.log4j.Log4j2;

/**
 * Service to manage real-time watchers count for items. Uses Spring Cache with
 * Caffeine for efficient caching of watcher counts.
 */
@Service
@Log4j2
public class ItemWatcherService {

	// Atomic counters for thread-safe increment/decrement
	private final Map<Long, AtomicInteger> watcherCounts = new ConcurrentHashMap<>();

	/**
	 * Increment the watcher count for an item
	 *
	 * @param itemId
	 *            The item ID
	 * @return The new watcher count
	 */
	public int incrementWatchers( Long itemId ) {

		AtomicInteger counter = watcherCounts.computeIfAbsent( itemId, k -> new AtomicInteger( 0 ) );
		int newCount = counter.incrementAndGet();
		log.info( "Watcher joined item: {}, total watchers: {}", itemId, newCount );
		return newCount;
	}

	/**
	 * Decrement the watcher count for an item
	 *
	 * @param itemId
	 *            The item ID
	 * @return The new watcher count
	 */
	public int decrementWatchers( Long itemId ) {

		AtomicInteger counter = watcherCounts.get( itemId );
		if ( counter != null ) {
			int newCount = Math.max( 0, counter.decrementAndGet() );
			log.info( "Watcher left item: {}, total watchers: {}", itemId, newCount );
			return newCount;
		}
		return 0;
	}

	/**
	 * Get the current watcher count for an item
	 *
	 * @param itemId
	 *            The item ID
	 * @return The current watcher count
	 */
	@Cacheable( value = "itemWatchers", key = "#itemId" )
	public int getWatcherCount( Long itemId ) {

		AtomicInteger counter = watcherCounts.get( itemId );
		return counter != null ? counter.get() : 0;
	}

	/**
	 * Reset the watcher count for an item (e.g., when item is sold or deleted)
	 *
	 * @param itemId
	 *            The item ID
	 */
	@CacheEvict( value = "itemWatchers", key = "#itemId" )
	public void resetWatchers( Long itemId ) {

		watcherCounts.remove( itemId );
		log.info( "Reset watchers for item: {}", itemId );
	}

	/**
	 * Clear all watcher counts
	 */
	@CacheEvict( value = "itemWatchers", allEntries = true )
	public void clearAllWatchers() {

		watcherCounts.clear();
		log.info( "Cleared all watcher counts" );
	}
}
