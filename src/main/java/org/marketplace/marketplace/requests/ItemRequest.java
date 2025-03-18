package org.marketplace.marketplace.requests;

import lombok.Data;

@Data
public class ItemRequest {

	private final String name;
	private final String description;
	private final Double price;
	private final String category;
	private final int user_id;

}
