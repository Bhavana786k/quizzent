package com.quizbuilder.repository;

import com.quizbuilder.entity.Quiz;
import com.quizbuilder.entity.enums.QuizVisibility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long>, JpaSpecificationExecutor<Quiz> {

    Optional<Quiz> findByIdAndIsDeletedFalse(Long id);

    Optional<Quiz> findByShareCodeAndIsDeletedFalse(String shareCode);

    List<Quiz> findByCreatorIdAndIsDeletedFalseOrderByCreatedAtDesc(Long creatorId);

    @Query("SELECT q FROM Quiz q WHERE q.isDeleted = false AND q.visibility = :visibility " +
           "AND (:category IS NULL OR LOWER(q.category) = LOWER(:category)) " +
           "AND (:query IS NULL OR LOWER(q.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(q.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Quiz> searchPublicQuizzes(
            @Param("visibility") QuizVisibility visibility,
            @Param("category") String category,
            @Param("query") String query,
            Pageable pageable
    );
}
