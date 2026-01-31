package com.asdf.minlog.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Setter
@Getter
@Builder
public class FollowResponseDto {
    @NonNull private Long followerId;
    @NonNull private Long followeeId;
}
