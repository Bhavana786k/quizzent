package com.quizbuilder.dto.response;

import java.util.ArrayList;
import java.util.List;

public class QuizDetailResponse {
    private QuizResponse quiz;
    private List<QuestionResponse> questions = new ArrayList<>();

    public QuizDetailResponse() {}

    public QuizDetailResponse(QuizResponse quiz, List<QuestionResponse> questions) {
        this.quiz = quiz;
        this.questions = questions;
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
}
