package com.quizbuilder.dto.response;

import com.quizbuilder.entity.enums.PrivateAccessType;
import com.quizbuilder.entity.enums.QuizMode;
import com.quizbuilder.entity.enums.QuizVisibility;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class QuizResponse {

    private Long id;
    private UserDto creator;
    private String title;
    private String description;
    private String category;
    private List<String> tags = new ArrayList<>();
    private QuizMode mode;
    private QuizVisibility visibility;
    private PrivateAccessType privateAccessType;
    private String shareCode;
    private Integer attemptLimit;
    private Integer timeLimitMinutes;
    private Boolean randomizeQuestions;
    private Boolean randomizeOptions;
    private Boolean showResultsImmediately;
    private Boolean showCorrectAnswers;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean enableLeaderboard;
    private Integer questionCount;
    private Double totalMarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public QuizResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserDto getCreator() {
        return creator;
    }

    public void setCreator(UserDto creator) {
        this.creator = creator;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public QuizMode getMode() {
        return mode;
    }

    public void setMode(QuizMode mode) {
        this.mode = mode;
    }

    public QuizVisibility getVisibility() {
        return visibility;
    }

    public void setVisibility(QuizVisibility visibility) {
        this.visibility = visibility;
    }

    public PrivateAccessType getPrivateAccessType() {
        return privateAccessType;
    }

    public void setPrivateAccessType(PrivateAccessType privateAccessType) {
        this.privateAccessType = privateAccessType;
    }

    public String getShareCode() {
        return shareCode;
    }

    public void setShareCode(String shareCode) {
        this.shareCode = shareCode;
    }

    public Integer getAttemptLimit() {
        return attemptLimit;
    }

    public void setAttemptLimit(Integer attemptLimit) {
        this.attemptLimit = attemptLimit;
    }

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Boolean getRandomizeQuestions() {
        return randomizeQuestions;
    }

    public void setRandomizeQuestions(Boolean randomizeQuestions) {
        this.randomizeQuestions = randomizeQuestions;
    }

    public Boolean getRandomizeOptions() {
        return randomizeOptions;
    }

    public void setRandomizeOptions(Boolean randomizeOptions) {
        this.randomizeOptions = randomizeOptions;
    }

    public Boolean getShowResultsImmediately() {
        return showResultsImmediately;
    }

    public void setShowResultsImmediately(Boolean showResultsImmediately) {
        this.showResultsImmediately = showResultsImmediately;
    }

    public Boolean getShowCorrectAnswers() {
        return showCorrectAnswers;
    }

    public void setShowCorrectAnswers(Boolean showCorrectAnswers) {
        this.showCorrectAnswers = showCorrectAnswers;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Boolean getEnableLeaderboard() {
        return enableLeaderboard;
    }

    public void setEnableLeaderboard(Boolean enableLeaderboard) {
        this.enableLeaderboard = enableLeaderboard;
    }

    public Integer getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }

    public Double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Double totalMarks) {
        this.totalMarks = totalMarks;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
