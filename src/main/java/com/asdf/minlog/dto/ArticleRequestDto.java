package com.asdf.minlog.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ArticleRequestDto {
  @NonNull private String content;

  @Deprecated(since = "2.0",forRemoval = true)
    @Schema(
            description = "작성자 ID (이 필드는 더 이상 사용되지 않습니다.)",
            example = "0",
            required = true,
            deprecated = true)
    private Long authorId;
}
