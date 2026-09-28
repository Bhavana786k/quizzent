package com.quizbuilder.dto.response;

import java.util.ArrayList;
import java.util.List;

public class LeaderboardResponse {
    private Long quizId;
    private String quizTitle;
    private Boolean isAvailable;
    private String availabilityMessage;
    private Integer totalParticipants;
    private List<LeaderboardEntryDto> topThree = new ArrayList<>();
    private List<LeaderboardEntryDto> rankings = new ArrayList<>();

    public LeaderboardResponse() {}

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public String getAvailabilityMessage() {
        return availabilityMessage;
    }

    public void setAvailabilityMessage(String availabilityMessage) {
        this.availabilityMessage = availabilityMessage;
    }

    public Integer getTotalParticipants() {
        return totalParticipants;
    }

    public void setTotalParticipants(Integer totalParticipants) {
        this.totalParticipants = totalParticipants;
    }

    public List<LeaderboardEntryDto> getTopThree() {
        return topThree;
    }

    public void setTopThree(List<LeaderboardEntryDto> topThree) {
        this.topThree = topThree;
    }

    public List<LeaderboardEntryDto> getRankings() {
        return rankings;
    }

    public void setRankings(List<LeaderboardEntryDto> rankings) {
        this.rankings = rankings;
    }
}
