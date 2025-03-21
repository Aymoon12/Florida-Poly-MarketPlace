package org.marketplace.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.marketplace.marketplace.entities.Sale;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

	@Query( "SELECT i FROM Sale i WHERE i.seller = ?1 OR i.buyer =?1 ORDER BY i.salesDate" )
	Optional<List<Sale>> findRecentActivity( Long userId, Pageable pageable );
}
