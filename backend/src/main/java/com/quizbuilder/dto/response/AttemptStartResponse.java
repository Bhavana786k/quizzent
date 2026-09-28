package com.quizbuilder.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AttemptStartResponse {
    private Long attemptId;
    private QuizResponse quiz;
    private List<QuestionResponse> questions = new ArrayList<>();
    private LocalDateTime startTime;
    private Integer timeLimitMinutes;

    public AttemptStartResponse() {}

    public AttemptStartResponse(Long attemptId, QuizResponse quiz, List<QuestionResponse> questions, LocalDateTime startTime, Integer timeLimitMinutes) {
        this.attemptId = attemptId;
        this.quiz = quiz;
        this.questions = questions;
        this.startTime = startTime;
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Long getAttemptId() {
        return attemptId;
    }

    public void setAttemptId(Long attemptId) {
        this.attemptId = attemptId;
    }

    public QuizResponse getQuiz() {
        return quiz;
    }

    public void setQuiz(QuizResponse quiz) {
        this.quiz = quiz;
    }

    public List<QuestionResponse> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionResponse> questions) {
        this.questions = questions;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }
}
