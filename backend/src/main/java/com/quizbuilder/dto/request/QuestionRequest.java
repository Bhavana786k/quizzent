package com.quizbuilder.dto.request;

import com.quizbuilder.entity.enums.MediaType;
import com.quizbuilder.entity.enums.QuestionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class QuestionRequest {
    private Long id;

    @NotBlank(message = "Question text is required")
    private String questionText;

    @NotNull(message = "Question type is required")
    private QuestionType questionType;

    private Double marks = 1.0;
    private String mediaUrl;
    private MediaType mediaType;
    private Integer orderIndex = 0;
    private String shortAnswerCorrect;

    private List<OptionRequest> options = new ArrayList<>();
    private List<MatchingPairRequest> matchingPairs = new ArrayList<>();

    public QuestionRequest() {}

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

    public String getShortAnswerCorrect() {
        return shortAnswerCorrect;
    }

    public void setShortAnswerCorrect(String shortAnswerCorrect) {
        this.shortAnswerCorrect = shortAnswerCorrect;
    }

    public List<OptionRequest> getOptions() {
        return options;
    }

    public void setOptions(List<OptionRequest> options) {
        this.options = options;
    }

    public List<MatchingPairRequest> getMatchingPairs() {
        return matchingPairs;
    }

    public void setMatchingPairs(List<MatchingPairRequest> matchingPairs) {
        this.matchingPairs = matchingPairs;
    }
}
