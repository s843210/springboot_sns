package com.asdf.minlog.controller;

import com.asdf.minlog.dto.LikeResponseDto;
import com.asdf.minlog.security.MinilogUserDetails;
import com.asdf.minlog.service.LikeService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/article/{articleId}/like")
public class LikeController {

  private final LikeService likeService;

  @Autowired
  public LikeController(LikeService likeService) {
    this.likeService = likeService;
  }

  @PostMapping
  @Operation(summary = "좋아요 토글 (좋아요/취소)")
  public ResponseEntity<LikeResponseDto> toggleLike(
      @AuthenticationPrincipal MinilogUserDetails userDetails,
      @PathVariable Long articleId) {
    LikeResponseDto result = likeService.toggleLike(userDetails.getId(), articleId);
    return ResponseEntity.ok(result);
  }

  @GetMapping
  @Operation(summary = "좋아요 상태 조회")
  public ResponseEntity<LikeResponseDto> getLikeStatus(
      @AuthenticationPrincipal MinilogUserDetails userDetails,
      @PathVariable Long articleId) {
    LikeResponseDto result = likeService.getLikeStatus(userDetails.getId(), articleId);
    return ResponseEntity.ok(result);
  }
}
