package com.asdf.minlog.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserRequestDto {
  @NonNull private String username;
  @NonNull private String password;
}
