package com.asdf.minlog.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "likes",
    uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "article_id"})})
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Like {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "article_id", nullable = false)
  private Article article;
}
