package org.marketplace.marketplace.requests;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ItemRequest implements Serializable {

	@NotBlank( message = "Name is required" )
	@Size( min = 3, max = 100, message = "Name must be between 3 and 100 characters" )
	private final String name;

	@NotBlank( message = "Description is required" )
	@Size( min = 10, max = 2000, message = "Description must be between 10 and 2000 characters" )
	private final String description;

	@NotNull( message = "Price is required" )
	@Positive( message = "Price must be greater than 0" )
	private final Double price;

	@NotBlank( message = "Category is required" )
	private final String category;

	@NotBlank( message = "User ID is required" )
	private final String userId;
}
