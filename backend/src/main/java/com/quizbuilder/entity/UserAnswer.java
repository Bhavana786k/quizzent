package com.quizbuilder.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "answers")
public class UserAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "attempt_id", nullable = false)
    private QuizAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    // Comma-separated option IDs for MCQ, True/False, MSQ
    private String selectedOptionIds;

    // JSON map of leftItem -> rightItem for MATCHING
    @Column(columnDefinition = "TEXT")
    private String matchingResponseJson;

    // For VERY_SHORT_ANSWER
    private String textAnswer;

    private Double marksEarned = 0.0;

    public UserAnswer() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public QuizAttempt getAttempt() {
        return attempt;
    }

    public void setAttempt(QuizAttempt attempt) {
        this.attempt = attempt;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getSelectedOptionIds() {
        return selectedOptionIds;
    }

    public void setSelectedOptionIds(String selectedOptionIds) {
        this.selectedOptionIds = selectedOptionIds;
    }

    public String getMatchingResponseJson() {
        return matchingResponseJson;
    }

    public void setMatchingResponseJson(String matchingResponseJson) {
        this.matchingResponseJson = matchingResponseJson;
    }

    public String getTextAnswer() {
        return textAnswer;
    }

    public void setTextAnswer(String textAnswer) {
        this.textAnswer = textAnswer;
    }

    public Double getMarksEarned() {
        return marksEarned;
    }

    public void setMarksEarned(Double marksEarned) {
        this.marksEarned = marksEarned;
    }
}
