package org.marketplace.marketplace.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
@Builder
public class Sale {

	@Id
	@GeneratedValue( strategy = GenerationType.AUTO )
	private Long Id;

	@Column( name = "salesDate", nullable = false )
	private LocalDate salesDate;

	@Column( name = "salesPrice", nullable = false )
	private BigDecimal salesPrice;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "seller_id", nullable = false )
	private User seller;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "buyer_id", nullable = false )
	private User buyer;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "item_id", nullable = false )
	private Item item;

	@OneToMany( mappedBy = "sale", cascade = CascadeType.ALL, orphanRemoval = true )
	@Builder.Default
	private List<Review> reviews = new ArrayList<>();

}
