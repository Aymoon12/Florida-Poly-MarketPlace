package org.marketplace.marketplace.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table
@Builder
@ToString
public class Item {

	@Id
	@GeneratedValue( strategy = GenerationType.AUTO )
	private Long id;

	@Column( name = "title", nullable = false )
	private String title;

	@Column( name = "description" )
	private String description;

	@Column( name = "price", nullable = false )
	private BigDecimal price;

	@Column( name = "category", nullable = false )
	@Enumerated( EnumType.ORDINAL )
	private Category category;

	@Column( name = "status", nullable = false )
	@Enumerated( EnumType.STRING )
	private Status status;

	@ManyToOne( fetch = FetchType.LAZY )
	@JoinColumn( name = "user_id", nullable = false )
	private User user;

	@Column( name = "expirationDate", nullable = false )
	private LocalDateTime expirationDate;

	@Column( name = "createdAt", nullable = false )
	private LocalDateTime createdAt;

	@OneToMany( mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<ViewHistory> usersViewed;

	@Column( name = "quantity", nullable = false )
	private int quantity;

	@Column( name = "views", nullable = false )
	private int views;

	@OneToMany( mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<CartItem> cartItems = new ArrayList<>();

	@OneToMany( mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<SavedListing> savedBy = new ArrayList<>();

	@OneToMany( mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Conversation> conversations = new ArrayList<>();

	@OneToMany( mappedBy = "reviewedItem", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Review> reviews = new ArrayList<>();

}
