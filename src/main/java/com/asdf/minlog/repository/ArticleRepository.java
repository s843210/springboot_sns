package com.asdf.minlog.repository;

import com.asdf.minlog.entity.Article;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ArticleRepository extends JpaRepository<Article, Long> {
  List<Article> findAllByAuthorId(Long authorId);

  @Query(
      "SELECT a FROM Article a JOIN a.author u JOIN Follow f"
          + " ON u.id = f.followee.id WHERE"
          + " f.follower.id = :authorId ORDER BY a.createdAt DESC")
  List<Article> findAllByFollowerId(@Param("authorId") Long authorId);
}
