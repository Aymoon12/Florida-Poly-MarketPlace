package org.marketplace.marketplace.entities;

import lombok.Getter;

@Getter
public enum Category {

	ELECTRONICS(0),
	
	BOOKS(1), // For textbooks

	COLLECTIBLES(2),

	FASHION(3), // For apparel

	SPORTS(4), // For sports gear

	OTHER(5), // For dorm & living and other misc items
	
	SERVICES(6);

	private final int key;

	Category(int key) {
		this.key = key;
	}

	public static Category fromString(String category) {
		if (category == null) {
			return OTHER;
		}

		return switch (category.toLowerCase()) {
			case "electronics" -> ELECTRONICS;
			case "books", "textbooks" -> BOOKS;
			case "collectibles" -> COLLECTIBLES;
			case "fashion", "apparel" -> FASHION;
			case "sports", "sports gear" -> SPORTS;
			case "services" -> SERVICES;
			default -> OTHER;
		};
	}
}
