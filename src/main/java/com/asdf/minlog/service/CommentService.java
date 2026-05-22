package com.asdf.minlog.service;

import com.asdf.minlog.dto.CommentResponseDto;
import com.asdf.minlog.entity.Article;
import com.asdf.minlog.entity.Comment;
import com.asdf.minlog.entity.User;
import com.asdf.minlog.exception.ArticleNotFoundException;
import com.asdf.minlog.exception.NotAuthorizedException;
import com.asdf.minlog.exception.UserNotFoundException;
import com.asdf.minlog.repository.ArticleRepository;
import com.asdf.minlog.repository.CommentRepository;
import com.asdf.minlog.repository.UserRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CommentService {

  private final CommentRepository commentRepository;
  private final ArticleRepository articleRepository;
  private final UserRepository userRepository;

  @Autowired
  public CommentService(
      CommentRepository commentRepository,
      ArticleRepository articleRepository,
      UserRepository userRepository) {
    this.commentRepository = commentRepository;
    this.articleRepository = articleRepository;
    this.userRepository = userRepository;
  }

  public CommentResponseDto createComment(Long userId, Long articleId, String content) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다."));

    Article article =
        articleRepository
            .findById(articleId)
            .orElseThrow(() -> new ArticleNotFoundException("게시글을 찾을 수 없습니다."));

    Comment comment = Comment.builder().content(content).author(user).article(article).build();
    Comment saved = commentRepository.save(comment);
    return toDto(saved);
  }

  @Transactional(readOnly = true)
  public List<CommentResponseDto> getComments(Long articleId) {
    return commentRepository.findAllByArticleIdOrderByCreatedAtAsc(articleId).stream()
        .map(this::toDto)
        .toList();
  }

  public void deleteComment(Long userId, Long commentId) {
    Comment comment =
        commentRepository
            .findById(commentId)
            .orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다."));

    if (!comment.getAuthor().getId().equals(userId)) {
      throw new NotAuthorizedException("댓글 작성자만 삭제할 수 있습니다.");
    }
    commentRepository.deleteById(commentId);
  }

  private CommentResponseDto toDto(Comment c) {
    return CommentResponseDto.builder()
        .commentId(c.getId())
        .content(c.getContent())
        .authorId(c.getAuthor().getId())
        .authorName(c.getAuthor().getUsername())
        .articleId(c.getArticle().getId())
        .createdAt(c.getCreatedAt())
        .build();
  }
}
