package com.quizbuilder.dto.response;

import com.quizbuilder.entity.enums.QuestionType;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UserAnswerResultDto {
    private Long questionId;
    private String questionText;
    private QuestionType questionType;
    private Double marksEarned;
    private Double totalQuestionMarks;
    private List<Long> selectedOptionIds = new ArrayList<>();
    private List<Long> correctOptionIds = new ArrayList<>(); // Nullable if showCorrectAnswers == false
    private Map<String, String> userMatchingPairs = new HashMap<>();
    private Map<String, String> correctMatchingPairs = new HashMap<>(); // Nullable if showCorrectAnswers == false
    private String userTextAnswer;
    private String correctTextAnswer; // Nullable if showCorrectAnswers == false
    private Boolean isCorrect;

    public UserAnswerResultDto() {}

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public QuestionType getQuestionType() {
        return questionType;
    }

    public void setQuestionType(QuestionType questionType) {
        this.questionType = questionType;
    }

    public Double getMarksEarned() {
        return marksEarned;
    }

    public void setMarksEarned(Double marksEarned) {
        this.marksEarned = marksEarned;
    }

    public Double getTotalQuestionMarks() {
        return totalQuestionMarks;
    }

    public void setTotalQuestionMarks(Double totalQuestionMarks) {
        this.totalQuestionMarks = totalQuestionMarks;
    }

    public List<Long> getSelectedOptionIds() {
        return selectedOptionIds;
    }

    public void setSelectedOptionIds(List<Long> selectedOptionIds) {
        this.selectedOptionIds = selectedOptionIds;
    }

    public List<Long> getCorrectOptionIds() {
        return correctOptionIds;
    }

    public void setCorrectOptionIds(List<Long> correctOptionIds) {
        this.correctOptionIds = correctOptionIds;
    }

    public Map<String, String> getUserMatchingPairs() {
        return userMatchingPairs;
    }

    public void setUserMatchingPairs(Map<String, String> userMatchingPairs) {
        this.userMatchingPairs = userMatchingPairs;
    }

    public Map<String, String> getCorrectMatchingPairs() {
        return correctMatchingPairs;
    }

    public void setCorrectMatchingPairs(Map<String, String> correctMatchingPairs) {
        this.correctMatchingPairs = correctMatchingPairs;
    }

    public String getUserTextAnswer() {
        return userTextAnswer;
    }

    public void setUserTextAnswer(String userTextAnswer) {
        this.userTextAnswer = userTextAnswer;
    }

    public String getCorrectTextAnswer() {
        return correctTextAnswer;
    }

    public void setCorrectTextAnswer(String correctTextAnswer) {
        this.correctTextAnswer = correctTextAnswer;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}
