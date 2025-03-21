package org.marketplace.marketplace.services;

import org.marketplace.marketplace.entities.ViewHistory;
import org.marketplace.marketplace.repository.ViewHistoryRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ViewHistoryService {

	private final ViewHistoryRepository viewHistoryRepository;

	public void save( final ViewHistory viewHistory ) {

		viewHistoryRepository.save( viewHistory );
	}
}
