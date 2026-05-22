package com.asdf.minlog.service;

import com.asdf.minlog.dto.LikeResponseDto;
import com.asdf.minlog.entity.Article;
import com.asdf.minlog.entity.Like;
import com.asdf.minlog.entity.User;
import com.asdf.minlog.exception.ArticleNotFoundException;
import com.asdf.minlog.exception.UserNotFoundException;
import com.asdf.minlog.repository.ArticleRepository;
import com.asdf.minlog.repository.LikeRepository;
import com.asdf.minlog.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LikeService {

  private final LikeRepository likeRepository;
  private final ArticleRepository articleRepository;
  private final UserRepository userRepository;

  @Autowired
  public LikeService(
      LikeRepository likeRepository,
      ArticleRepository articleRepository,
      UserRepository userRepository) {
    this.likeRepository = likeRepository;
    this.articleRepository = articleRepository;
    this.userRepository = userRepository;
  }

  /** 좋아요 토글 — 이미 눌렀으면 취소, 안 눌렀으면 추가 */
  public LikeResponseDto toggleLike(Long userId, Long articleId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(
                () -> new UserNotFoundException("사용자를 찾을 수 없습니다."));

    Article article =
        articleRepository
            .findById(articleId)
            .orElseThrow(
                () -> new ArticleNotFoundException("게시글을 찾을 수 없습니다."));

    boolean liked;
    var existing = likeRepository.findByUserIdAndArticleId(userId, articleId);
    if (existing.isPresent()) {
      likeRepository.delete(existing.get());
      liked = false;
    } else {
      likeRepository.save(Like.builder().user(user).article(article).build());
      liked = true;
    }

    long count = likeRepository.countByArticleId(articleId);
    return LikeResponseDto.builder()
        .articleId(articleId)
        .likeCount(count)
        .likedByMe(liked)
        .build();
  }

  @Transactional(readOnly = true)
  public LikeResponseDto getLikeStatus(Long userId, Long articleId) {
    boolean liked = likeRepository.existsByUserIdAndArticleId(userId, articleId);
    long count = likeRepository.countByArticleId(articleId);
    return LikeResponseDto.builder()
        .articleId(articleId)
        .likeCount(count)
        .likedByMe(liked)
        .build();
  }
}
