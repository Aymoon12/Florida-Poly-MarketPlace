package org.marketplace.marketplace.repository;

import java.util.List;

import org.marketplace.marketplace.entities.Report;
import org.marketplace.marketplace.entities.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

	@Query( "SELECT r FROM Report r WHERE r.reporter.ID = :reporterId" )
	List<Report> findByReporterId( Long reporterId );

	@Query( "SELECT r FROM Report r WHERE r.reportedUser.ID = :reportedUserId" )
	List<Report> findByReportedUserId( Long reportedUserId );

	@Query( "SELECT r FROM Report r WHERE r.reportedItem.id = :reportedItemId" )
	List<Report> findByReportedItemId( Long reportedItemId );

	List<Report> findByStatus( ReportStatus status );

	@Query( "SELECT COUNT(r) > 0 FROM Report r WHERE r.reporter.ID = :reporterId AND r.reportedUser.ID = :reportedUserId AND r.status = 'PENDING'" )
	boolean hasPendingReportAgainstUser( Long reporterId, Long reportedUserId );

	@Query( "SELECT COUNT(r) > 0 FROM Report r WHERE r.reporter.ID = :reporterId AND r.reportedItem.id = :reportedItemId AND r.status = 'PENDING'" )
	boolean hasPendingReportAgainstItem( Long reporterId, Long reportedItemId );
}
