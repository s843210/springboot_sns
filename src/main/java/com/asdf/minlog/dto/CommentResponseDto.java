package com.asdf.minlog.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommentResponseDto {
  private Long commentId;
  private String content;
  private Long authorId;
  private String authorName;
  private Long articleId;
  private LocalDateTime createdAt;
}
