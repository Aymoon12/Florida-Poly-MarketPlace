package org.marketplace.marketplace.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.marketplace.marketplace.dto.CreateReportRequest;
import org.marketplace.marketplace.dto.ReportDto;
import org.marketplace.marketplace.entities.Item;
import org.marketplace.marketplace.entities.Report;
import org.marketplace.marketplace.entities.ReportStatus;
import org.marketplace.marketplace.entities.User;
import org.marketplace.marketplace.repository.ItemRepository;
import org.marketplace.marketplace.repository.ReportRepository;
import org.marketplace.marketplace.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class ReportService {

	private final ReportRepository reportRepository;
	private final UserRepository userRepository;
	private final ItemRepository itemRepository;

	@Transactional
	public ReportDto createReport( Long reporterId, CreateReportRequest request ) {

		// Validate that at least one target is specified
		if ( request.getReportedUserId() == null && request.getReportedItemId() == null ) {
			throw new IllegalArgumentException( "Must specify either a user or an item to report" );
		}

		User reporter = userRepository.findById( reporterId )
				.orElseThrow( () -> new EntityNotFoundException( "Reporter not found" ) );

		// Check for existing pending report
		if ( request.getReportedUserId() != null &&
				reportRepository.hasPendingReportAgainstUser( reporterId, request.getReportedUserId() ) ) {
			throw new IllegalArgumentException( "You already have a pending report against this user" );
		}

		if ( request.getReportedItemId() != null &&
				reportRepository.hasPendingReportAgainstItem( reporterId, request.getReportedItemId() ) ) {
			throw new IllegalArgumentException( "You already have a pending report against this item" );
		}

		Report.ReportBuilder reportBuilder = Report.builder()
				.reporter( reporter )
				.reason( request.getReason() )
				.description( request.getDescription() )
				.status( ReportStatus.PENDING )
				.createdAt( LocalDateTime.now() );

		if ( request.getReportedUserId() != null ) {
			// Prevent self-reporting
			if ( request.getReportedUserId().equals( reporterId ) ) {
				throw new IllegalArgumentException( "Cannot report yourself" );
			}

			User reportedUser = userRepository.findById( request.getReportedUserId() )
					.orElseThrow( () -> new EntityNotFoundException( "Reported user not found" ) );
			reportBuilder.reportedUser( reportedUser );
		}

		if ( request.getReportedItemId() != null ) {
			Item reportedItem = itemRepository.findItemById( request.getReportedItemId() )
					.orElseThrow( () -> new EntityNotFoundException( "Reported item not found" ) );

			// Prevent reporting own item
			if ( reportedItem.getUser().getID().equals( reporterId ) ) {
				throw new IllegalArgumentException( "Cannot report your own item" );
			}

			reportBuilder.reportedItem( reportedItem );
		}

		Report report = reportRepository.save( reportBuilder.build() );
		log.info( "Report created: id={}, reporterId={}, reason={}", report.getId(), reporterId, request.getReason() );

		return ReportDto.from( report );
	}

	public List<ReportDto> getUserReports( Long userId ) {

		return reportRepository.findByReporterId( userId ).stream()
				.map( ReportDto::from )
				.collect( Collectors.toList() );
	}

	public List<ReportDto> getReportsAgainstUser( Long userId ) {

		return reportRepository.findByReportedUserId( userId ).stream()
				.map( ReportDto::from )
				.collect( Collectors.toList() );
	}

	public List<ReportDto> getPendingReports() {

		return reportRepository.findByStatus( ReportStatus.PENDING ).stream()
				.map( ReportDto::from )
				.collect( Collectors.toList() );
	}

	@Transactional
	public ReportDto updateReportStatus( Long reportId, ReportStatus newStatus ) {

		Report report = reportRepository.findById( reportId )
				.orElseThrow( () -> new EntityNotFoundException( "Report not found" ) );

		report.setStatus( newStatus );
		if ( newStatus == ReportStatus.RESOLVED || newStatus == ReportStatus.DISMISSED ) {
			report.setResolvedAt( LocalDateTime.now() );
		}

		report = reportRepository.save( report );
		log.info( "Report status updated: id={}, newStatus={}", reportId, newStatus );

		return ReportDto.from( report );
	}
}
