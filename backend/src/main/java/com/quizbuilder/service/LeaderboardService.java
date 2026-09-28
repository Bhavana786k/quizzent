package com.quizbuilder.service;

import com.quizbuilder.dto.response.LeaderboardEntryDto;
import com.quizbuilder.dto.response.LeaderboardResponse;
import com.quizbuilder.entity.Quiz;
import com.quizbuilder.entity.QuizAttempt;
import com.quizbuilder.entity.enums.AttemptStatus;
import com.quizbuilder.exception.ResourceNotFoundException;
import com.quizbuilder.repository.QuizAttemptRepository;
import com.quizbuilder.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class LeaderboardService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository attemptRepository;

    public LeaderboardService(QuizRepository quizRepository, QuizAttemptRepository attemptRepository) {
        this.quizRepository = quizRepository;
        this.attemptRepository = attemptRepository;
    }

    public LeaderboardResponse getLeaderboard(Long quizId) {
        Quiz quiz = quizRepository.findByIdAndIsDeletedFalse(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        LeaderboardResponse response = new LeaderboardResponse();
        response.setQuizId(quiz.getId());
        response.setQuizTitle(quiz.getTitle());

        if (Boolean.FALSE.equals(quiz.getEnableLeaderboard())) {
            response.setIsAvailable(false);
            response.setAvailabilityMessage("Leaderboard is disabled for this quiz.");
            return response;
        }

        // Scheduled Competition Check: Leaderboard is available after quiz ends
        if (quiz.getEndTime() != null && LocalDateTime.now().isBefore(quiz.getEndTime())) {
            response.setIsAvailable(false);
            response.setAvailabilityMessage("Leaderboard will become available after the quiz competition ends on " + quiz.getEndTime());
            return response;
        }

        response.setIsAvailable(true);
        response.setAvailabilityMessage("Leaderboard active");

        List<QuizAttempt> attempts = attemptRepository.findByQuizIdAndStatusOrderByScoreDescTimeTakenSecondsAsc(quizId, AttemptStatus.COMPLETED);

        List<LeaderboardEntryDto> entries = new ArrayList<>();
        int rank = 1;
        for (QuizAttempt att : attempts) {
            LeaderboardEntryDto entry = new LeaderboardEntryDto(
                    rank++,
                    att.getUser().getId(),
                    att.getUser().getFullName(),
                    att.getScore(),
                    att.getTotalMarks(),
                    att.getTimeTakenSeconds(),
                    att.getSubmitTime()
            );
            entries.add(entry);
        }

        response.setTotalParticipants(entries.size());
        response.setRankings(entries);

        // Highlight top 3 performers
        List<LeaderboardEntryDto> topThree = entries.stream().limit(3).toList();
        response.setTopThree(topThree);

        return response;
    }
}
