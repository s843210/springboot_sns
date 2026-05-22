package com.asdf.minlog.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // /uploads/** 요청 → 로컬 uploads/ 폴더에서 파일 서빙
    registry
        .addResourceHandler("/uploads/**")
        .addResourceLocations("file:uploads/");
  }
}
