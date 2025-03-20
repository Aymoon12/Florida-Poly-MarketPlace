package org.marketplace.marketplace.dto;

import java.math.BigDecimal;
import java.util.List;

import org.marketplace.marketplace.entities.Sale;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardDto {

	private BigDecimal totalSales;
	private BigDecimal totalPurchases;
	private int activeListings;
	private List<Sale> recentActivity;
}
