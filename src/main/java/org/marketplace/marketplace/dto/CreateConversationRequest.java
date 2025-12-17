package org.marketplace.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateConversationRequest {

	@NotNull( message = "Item ID is required" )
	private Long itemId;

	@NotBlank( message = "Initial message is required" )
	@Size( min = 1, max = 1000, message = "Message must be between 1 and 1000 characters" )
	private String initialMessage;

	@NotNull( message = "User ID is required" )
	private Long userId;
}