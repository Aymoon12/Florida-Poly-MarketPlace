package org.marketplace.marketplace.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

	@NotNull( message = "Conversation ID is required" )
	private Long conversationId;

	@NotBlank( message = "Message content is required" )
	@Size( min = 1, max = 1000, message = "Message must be between 1 and 1000 characters" )
	private String content;

	@Positive( message = "Offer price must be positive" )
	private Double offerPrice; // Optional

	@Size( max = 200, message = "Meetup location must be less than 200 characters" )
	private String meetupLocation; // Optional

	private LocalDateTime meetupTime; // Optional
} 