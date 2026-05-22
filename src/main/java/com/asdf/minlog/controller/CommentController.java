package com.asdf.minlog.controller;

import com.asdf.minlog.dto.CommentRequestDto;
import com.asdf.minlog.dto.CommentResponseDto;
import com.asdf.minlog.security.MinilogUserDetails;
import com.asdf.minlog.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/article/{articleId}/comments")
public class CommentController {

  private final CommentService commentService;

  @Autowired
  public CommentController(CommentService commentService) {
    this.commentService = commentService;
  }

  @GetMapping
  @Operation(summary = "댓글 목록 조회")
  public ResponseEntity<List<CommentResponseDto>> getComments(@PathVariable Long articleId) {
    return ResponseEntity.ok(commentService.getComments(articleId));
  }

  @PostMapping
  @Operation(summary = "댓글 작성")
  public ResponseEntity<CommentResponseDto> createComment(
      @AuthenticationPrincipal MinilogUserDetails userDetails,
      @PathVariable Long articleId,
      @RequestBody CommentRequestDto request) {
    CommentResponseDto result =
        commentService.createComment(userDetails.getId(), articleId, request.getContent());
    return ResponseEntity.ok(result);
  }

  @DeleteMapping("/{commentId}")
  @Operation(summary = "댓글 삭제")
  public ResponseEntity<Void> deleteComment(
      @AuthenticationPrincipal MinilogUserDetails userDetails,
      @PathVariable Long articleId,
      @PathVariable Long commentId) {
    commentService.deleteComment(userDetails.getId(), commentId);
    return ResponseEntity.noContent().build();
  }
}
