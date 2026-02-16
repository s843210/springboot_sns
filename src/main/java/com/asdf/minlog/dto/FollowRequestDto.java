package com.asdf.minlog.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@Builder
public class FollowRequestDto {

    @Deprecated(since = "2.0",forRemoval = true)
    @Schema(
            description = "팔로워 ID (이 필드는 더 이상 사용되지 않습니다.)",
            example = "0",
            required = true,
            deprecated = true)
    private Long followerId;
  @NonNull private Long followeeId;
}
