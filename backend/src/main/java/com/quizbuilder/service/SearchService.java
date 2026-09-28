package com.quizbuilder.service;

import com.quizbuilder.dto.response.QuizResponse;
import com.quizbuilder.entity.Question;
import com.quizbuilder.entity.Quiz;
import com.quizbuilder.entity.enums.QuizVisibility;
import com.quizbuilder.repository.QuestionRepository;
import com.quizbuilder.repository.QuizRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizService quizService;

    public SearchService(QuizRepository quizRepository, QuestionRepository questionRepository, QuizService quizService) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.quizService = quizService;
    }

    public Page<QuizResponse> searchPublicQuizzes(String query, String category, String tag, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        String cleanQuery = query != null && !query.trim().isEmpty() ? query.trim() : null;
        String cleanCategory = category != null && !category.trim().isEmpty() ? category.trim() : null;

        Page<Quiz> quizPage = quizRepository.searchPublicQuizzes(QuizVisibility.PUBLIC, cleanCategory, cleanQuery, pageable);

        List<QuizResponse> filteredResponses = quizPage.getContent().stream()
                .filter(q -> {
                    if (tag == null || tag.trim().isEmpty()) return true;
                    return q.getTags().stream().anyMatch(t -> t.getName().equalsIgnoreCase(tag.trim()));
                })
                .map(q -> {
                    List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(q.getId());
                    return quizService.mapToQuizResponse(q, questions);
                })
                .collect(Collectors.toList());

        return new PageImpl<>(filteredResponses, pageable, quizPage.getTotalElements());
    }
}
