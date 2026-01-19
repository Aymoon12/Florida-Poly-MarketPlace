package org.marketplace.marketplace.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BuyerInfoDto {

	private Long id;
	private String name;
	private String email;
	private Long conversationId;

}
