package com.asdf.minlog.dto;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDto {
  @NonNull
  private String content;
}
