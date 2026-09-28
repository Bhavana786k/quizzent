package com.quizbuilder.repository;

import com.quizbuilder.entity.MatchingPair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchingPairRepository extends JpaRepository<MatchingPair, Long> {
    List<MatchingPair> findByQuestionIdOrderByIdAsc(Long questionId);
}
