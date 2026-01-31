package com.asdf.minlog.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponseDto {
    @NonNull private Long id;
    @NonNull private String username;
}
