package com.asdf.minlog.repository;

import com.asdf.minlog.entity.Like;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Long> {
  Optional<Like> findByUserIdAndArticleId(Long userId, Long articleId);
  long countByArticleId(Long articleId);
  boolean existsByUserIdAndArticleId(Long userId, Long articleId);
}
