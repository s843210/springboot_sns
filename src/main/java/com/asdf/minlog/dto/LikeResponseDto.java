package com.asdf.minlog.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LikeResponseDto {
  private Long articleId;
  private long likeCount;
  private boolean likedByMe;
}
