package com.asdf.minlog.dto;

import lombok.*;

@Getter
@Setter
@Builder
public class AuthenticationResponseDto {
    @NonNull
    private String jwt;
}
