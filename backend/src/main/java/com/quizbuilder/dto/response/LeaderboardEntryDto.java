package com.quizbuilder.dto.response;

import java.time.LocalDateTime;

public class LeaderboardEntryDto {
    private Integer rank;
    private Long userId;
    private String fullName;
    private Double score;
    private Double totalMarks;
    private Long timeTakenSeconds;
    private LocalDateTime submitTime;

    public LeaderboardEntryDto() {}

    public LeaderboardEntryDto(Integer rank, Long userId, String fullName, Double score, Double totalMarks, Long timeTakenSeconds, LocalDateTime submitTime) {
        this.rank = rank;
        this.userId = userId;
        this.fullName = fullName;
        this.score = score;
        this.totalMarks = totalMarks;
        this.timeTakenSeconds = timeTakenSeconds;
        this.submitTime = submitTime;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(Double totalMarks) {
        this.totalMarks = totalMarks;
    }

    public Long getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(Long timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }

    public LocalDateTime getSubmitTime() {
        return submitTime;
    }

    public void setSubmitTime(LocalDateTime submitTime) {
        this.submitTime = submitTime;
    }
}
