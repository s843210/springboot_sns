package com.asdf.minlog.dto;

import lombok.*;

@Getter
@Setter
@Builder
public class FollowRequestDto {
  @NonNull private Long followerId;
  @NonNull private Long followeeId;
}
