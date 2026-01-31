package com.asdf.minlog.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ArticleResponseDto {
    @NonNull private Long articleId;
    @NonNull private String content;
    @NonNull private Long authorId;
    @NonNull private String authorName;
    @NonNull private LocalDateTime createdAt;
}
