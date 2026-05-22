package com.asdf.minlog.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import com.asdf.minlog.dto.ArticleResponseDto;
import com.asdf.minlog.entity.Article;
import com.asdf.minlog.entity.User;
import com.asdf.minlog.exception.UserNotFoundException;
import com.asdf.minlog.repository.ArticleRepository;
import com.asdf.minlog.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ArticleServiceTest {

  @Mock private ArticleRepository articleRepository;
  @Mock private UserRepository userRepository;

  @InjectMocks private ArticleService articleService;

  @Test
  @DisplayName("게시글 생성 성공 테스트 - 이미지 포함")
  void createArticle_Success() {
    // given
    Long userId = 1L;
    String content = "테스트 내용";
    String imageUrl = "/uploads/test.jpg";

    User mockUser = User.builder().id(userId).username("testuser").build();
    Article mockArticle =
        Article.builder()
            .id(100L)
            .content(content)
            .imageUrl(imageUrl)
            .author(mockUser)
            .createdAt(LocalDateTime.now())
            .build();

    when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));
    when(articleRepository.save(any(Article.class))).thenReturn(mockArticle);

    // when
    ArticleResponseDto responseDto = articleService.createArticle(content, userId, imageUrl);

    // then
    assertNotNull(responseDto);
    assertEquals(100L, responseDto.getArticleId());
    assertEquals(content, responseDto.getContent());
    assertEquals(imageUrl, responseDto.getImageUrl());
    assertEquals(userId, responseDto.getAuthorId());
    assertEquals("testuser", responseDto.getAuthorName());
    
    verify(userRepository, times(1)).findById(userId);
    verify(articleRepository, times(1)).save(any(Article.class));
  }

  @Test
  @DisplayName("게시글 생성 실패 테스트 - 존재하지 않는 사용자")
  void createArticle_UserNotFound() {
    // given
    Long invalidUserId = 999L;
    String content = "테스트 내용";

    when(userRepository.findById(invalidUserId)).thenReturn(Optional.empty());

    // when & then
    assertThrows(
        UserNotFoundException.class,
        () -> articleService.createArticle(content, invalidUserId, null));

    verify(userRepository, times(1)).findById(invalidUserId);
    verify(articleRepository, never()).save(any());
  }
}
