package org.marketplace.marketplace.entities;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
@Table( name = "users" )
@Builder
@ToString
public class User implements UserDetails {

	@Id
	@GeneratedValue( strategy = GenerationType.AUTO )
	private Long ID;

	@Column( name = "name", nullable = false )
	private String name;

	@Column( name = "email", nullable = false, unique = true )
	private String email;

	@Column( name = "role", nullable = false )
	@Enumerated( EnumType.ORDINAL )
	private Role role;

	@OneToMany( mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Item> items = new ArrayList<>();

	@OneToMany( mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Sale> sales = new ArrayList<>();

	@OneToMany( mappedBy = "buyer", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Sale> purchases = new ArrayList<>();

	@OneToMany( mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<ViewHistory> itemHistory = new ArrayList<>();

	@OneToMany( mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<CartItem> cartItems = new ArrayList<>();

	@OneToMany( mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Notification> notifications = new ArrayList<>();

	@OneToOne( mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true )
	private UserSettings settings;

	@OneToMany( mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<SavedListing> savedListings = new ArrayList<>();

	@OneToMany( mappedBy = "buyer", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Conversation> buyerConversations = new ArrayList<>();

	@OneToMany( mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Conversation> sellerConversations = new ArrayList<>();

	@OneToMany( mappedBy = "reviewer", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Review> reviewsGiven = new ArrayList<>();

	@OneToMany( mappedBy = "reviewedSeller", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Review> reviewsReceived = new ArrayList<>();

	@OneToMany( mappedBy = "reviewedBuyer", cascade = CascadeType.ALL, orphanRemoval = true )
	private List<Review> buyerReviewsReceived = new ArrayList<>();

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		return List.of( new SimpleGrantedAuthority( role.name() ) );

	}

	@Override
	public String getPassword() {

		return "";
	}

	@Override
	public String getUsername() {

		return email;
	}

	@Override
	public boolean isAccountNonExpired() {

		return UserDetails.super.isAccountNonExpired();
	}

	@Override
	public boolean isAccountNonLocked() {

		return UserDetails.super.isAccountNonLocked();
	}

	@Override
	public boolean isCredentialsNonExpired() {

		return UserDetails.super.isCredentialsNonExpired();
	}

	@Override
	public boolean isEnabled() {

		return UserDetails.super.isEnabled();
	}

}
