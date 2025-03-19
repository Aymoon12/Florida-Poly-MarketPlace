package org.marketplace.marketplace.repository;

import org.marketplace.marketplace.entities.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}
