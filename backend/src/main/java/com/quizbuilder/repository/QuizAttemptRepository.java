package com.quizbuilder.repository;

import com.quizbuilder.entity.QuizAttempt;
import com.quizbuilder.entity.enums.AttemptStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    long countByUserIdAndQuizId(Long userId, Long quizId);

    List<QuizAttempt> findByUserIdOrderByStartTimeDesc(Long userId);

    List<QuizAttempt> findByQuizIdAndStatusOrderByScoreDescTimeTakenSecondsAsc(Long quizId, AttemptStatus status);

    Optional<QuizAttempt> findByIdAndUserId(Long id, Long userId);
}
