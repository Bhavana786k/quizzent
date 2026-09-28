package com.quizbuilder.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SubmitAnswerRequest {

    @NotNull(message = "Question ID is required")
    private Long questionId;

    private List<Long> selectedOptionIds = new ArrayList<>();

    private Map<String, String> matchingPairs = new HashMap<>(); // leftItem -> user selected rightItem

    private String textAnswer;

    public SubmitAnswerRequest() {}

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public List<Long> getSelectedOptionIds() {
        return selectedOptionIds;
    }

    public void setSelectedOptionIds(List<Long> selectedOptionIds) {
        this.selectedOptionIds = selectedOptionIds;
    }

    public Map<String, String> getMatchingPairs() {
        return matchingPairs;
    }

    public void setMatchingPairs(Map<String, String> matchingPairs) {
        this.matchingPairs = matchingPairs;
    }

    public String getTextAnswer() {
        return textAnswer;
    }

    public void setTextAnswer(String textAnswer) {
        this.textAnswer = textAnswer;
    }
}
