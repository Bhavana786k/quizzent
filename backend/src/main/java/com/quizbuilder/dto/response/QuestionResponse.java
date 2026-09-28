package com.quizbuilder.dto.response;

import com.quizbuilder.entity.enums.MediaType;
import com.quizbuilder.entity.enums.QuestionType;

import java.util.ArrayList;
import java.util.List;

public class QuestionResponse {
    private Long id;
    private String questionText;
    private QuestionType questionType;
    private Double marks;
    private String mediaUrl;
    private MediaType mediaType;
    private Integer orderIndex;

    // Critical for Rule 3 & Rule 14: Max allowed user selections for MSQ
    private Integer maxSelectionsAllowed;

    private String shortAnswerCorrect; // Nullable when hidden in attempt taking view

    private List<OptionResponse> options = new ArrayList<>();
    private List<MatchingPairResponse> matchingPairs = new ArrayList<>();

    public QuestionResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Double getMarks() {
        return marks;
    }

    public void setMarks(Double marks) {
        this.marks = marks;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public MediaType getMediaType() {
        return mediaType;
    }

    public void setMediaType(MediaType mediaType) {
        this.mediaType = mediaType;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Integer getMaxSelectionsAllowed() {
        return maxSelectionsAllowed;
    }

    public void setMaxSelectionsAllowed(Integer maxSelectionsAllowed) {
        this.maxSelectionsAllowed = maxSelectionsAllowed;
    }

    public String getShortAnswerCorrect() {
        return shortAnswerCorrect;
    }

    public void setShortAnswerCorrect(String shortAnswerCorrect) {
        this.shortAnswerCorrect = shortAnswerCorrect;
    }

    public List<OptionResponse> getOptions() {
        return options;
    }

    public void setOptions(List<OptionResponse> options) {
        this.options = options;
    }

    public List<MatchingPairResponse> getMatchingPairs() {
        return matchingPairs;
    }

    public void setMatchingPairs(List<MatchingPairResponse> matchingPairs) {
        this.matchingPairs = matchingPairs;
    }
}
