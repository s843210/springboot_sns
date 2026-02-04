package com.asdf.minlog.repository;

import com.asdf.minlog.entity.Follow;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FollowRepository extends JpaRepository<Follow, Long> {
  List<Follow> findByFollowerId(Long followerId);

  Optional<Follow> findByFollowerIdAndFolloweeId(Long followerId, Long followeeId);
}
