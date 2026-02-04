package com.asdf.minlog.service;

import com.asdf.minlog.dto.ArticleResponseDto;
import com.asdf.minlog.entity.Article;
import com.asdf.minlog.entity.User;
import com.asdf.minlog.exception.ArticleNotFoundException;
import com.asdf.minlog.exception.UserNotFoundException;
import com.asdf.minlog.repository.ArticleRepository;
import com.asdf.minlog.repository.UserRepository;
import com.asdf.minlog.util.EntityDtoMapper;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(isolation = Isolation.REPEATABLE_READ)
public class ArticleService {

  private final ArticleRepository articleRepository;
  private final UserRepository userRepository;

  @Autowired
  public ArticleService(ArticleRepository articleRepository, UserRepository userRepository) {
    this.articleRepository = articleRepository;
    this.userRepository = userRepository;
  }

  public ArticleResponseDto createArticle(String content, Long userId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(
                () ->
                    new UserNotFoundException(
                        String.format("해당 아이디(%d)를 가진 사용자를 찾을 수 없습니다.", userId)));

    Article aticle = Article.builder().content(content).author(user).build();

    Article savedArticle = articleRepository.save(aticle);
    return EntityDtoMapper.toDto(savedArticle);
  }

  public void deleteArticle(Long articleId) {
    Article article =
        articleRepository
            .findById(articleId)
            .orElseThrow(
                () ->
                    new ArticleNotFoundException(
                        String.format("해당 아이디(%d)를 가진 게시글을 찾을 수 없스니다.", articleId)));
    articleRepository.deleteById(articleId);
  }

  public ArticleResponseDto updateArticle(Long articleId, String content) {
    Article article =
        articleRepository
            .findById(articleId)
            .orElseThrow(
                () ->
                    new ArticleNotFoundException(
                        String.format("해당 아이디(%d)를 가진 게시글을 찾을 수없습니다.", articleId)));
    article.setContent(content);
    Article updatedArticle = articleRepository.save(article);
    return EntityDtoMapper.toDto(updatedArticle);
  }

  @Transactional(readOnly = true)
  public ArticleResponseDto getArticleById(Long articleId) {
    Article article =
        articleRepository
            .findById(articleId)
            .orElseThrow(
                () ->
                    new ArticleNotFoundException(
                        String.format("해당 아이디(%d)를 가진 게시글을 찾을 수 없습니다", articleId)));
    return EntityDtoMapper.toDto(article);
  }

  @Transactional(readOnly = true)
  public List<ArticleResponseDto> getFeedListByFollowerId(Long userId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(
                () ->
                    new UserNotFoundException(
                        String.format("해당 아이디(%d)를 가진 사용자를 찾을 수 없습니다.", userId)));
    var feedList = articleRepository.findAllByFollowerId(user.getId());
    return feedList.stream().map(EntityDtoMapper::toDto).toList();
  }

  @Transactional(readOnly = true)
  public List<ArticleResponseDto> getArticleListByUserId(Long userId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(
                () ->
                    new UserNotFoundException(
                        String.format("해당 아이디(%d)를 가진 사용자를 찾을 수 없습니다.", userId)));

    var articleList = articleRepository.findAllByAuthorId(user.getId());
    return articleList.stream().map(EntityDtoMapper::toDto).toList();
  }
}
