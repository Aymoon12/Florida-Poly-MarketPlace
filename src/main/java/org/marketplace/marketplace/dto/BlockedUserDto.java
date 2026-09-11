package org.marketplace.marketplace.dto;

import java.time.LocalDateTime;

import org.marketplace.marketplace.entities.BlockedUser;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BlockedUserDto {

	private Long id;
	private Long blockedUserId;
	private String blockedUserName;
	private String blockedUserEmail;
	private LocalDateTime createdAt;

	public static BlockedUserDto from( BlockedUser blockedUser ) {

		return BlockedUserDto.builder()
				.id( blockedUser.getId() )
				.blockedUserId( blockedUser.getBlocked().getID() )
				.blockedUserName( blockedUser.getBlocked().getName() )
				.blockedUserEmail( blockedUser.getBlocked().getEmail() )
				.createdAt( blockedUser.getCreatedAt() )
				.build();
	}
}
