package com.asdf.minlog.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ArticleRequestDto {
    @NonNull private String content;
    @NonNull private Long authorId;
}

