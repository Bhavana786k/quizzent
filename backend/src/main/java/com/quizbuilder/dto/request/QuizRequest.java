package com.quizbuilder.dto.request;

import com.quizbuilder.entity.enums.PrivateAccessType;
import com.quizbuilder.entity.enums.QuizMode;
import com.quizbuilder.entity.enums.QuizVisibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class QuizRequest {

    @NotBlank(message = "Quiz title is required")
    private String title;

    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private Set<String> tags = new HashSet<>();

    @NotNull(message = "Quiz mode is required")
    private QuizMode mode = QuizMode.PRACTICE;

    @NotNull(message = "Visibility is required")
    private QuizVisibility visibility = QuizVisibility.PUBLIC;

    private PrivateAccessType privateAccessType;

    private String passcode; // Plain text input, will be BCrypt hashed if privateAccessType == LINK_PASSCODE

    private Integer attemptLimit;

    private Integer timeLimitMinutes;

    private Boolean randomizeQuestions = false;

    private Boolean randomizeOptions = false;

    private Boolean showResultsImmediately = true;

    private Boolean showCorrectAnswers = true;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Boolean enableLeaderboard = true;

    private List<QuestionRequest> questions = new ArrayList<>();

    public QuizRequest() {}

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

    public Set<String> getTags() {
        return tags;
    }

    public void setTags(Set<String> tags) {
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

    public String getPasscode() {
        return passcode;
    }

    public void setPasscode(String passcode) {
        this.passcode = passcode;
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

    public List<QuestionRequest> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuestionRequest> questions) {
        this.questions = questions;
    }
}
