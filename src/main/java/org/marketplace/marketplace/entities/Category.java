package org.marketplace.marketplace.entities;

import lombok.Getter;

@Getter
public enum Category {

	ELECTRONICS( 0 ),

	BOOKS( 1 ),

	COLLECTIBLES( 2 ),

	FASHION( 3 ),

	OTHER( 4 );

	private final int key;

	Category( int key ) {

		this.key = key;
	}

	public static Category fromString(String category) {
		switch (category) {
			case "Electronics":
				return ELECTRONICS;
			case "Books":
				return BOOKS;
			case "Collectibles":
				return COLLECTIBLES;
			case "Fashion":
				return FASHION;
			default:
				return OTHER;
		}
	}
}
