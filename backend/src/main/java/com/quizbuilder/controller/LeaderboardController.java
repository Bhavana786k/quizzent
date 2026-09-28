package com.quizbuilder.controller;

import com.quizbuilder.dto.response.ApiResponse;
import com.quizbuilder.dto.response.LeaderboardResponse;
import com.quizbuilder.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/leaderboards")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<ApiResponse<LeaderboardResponse>> getLeaderboard(@PathVariable Long quizId) {
        LeaderboardResponse response = leaderboardService.getLeaderboard(quizId);
        return ResponseEntity.ok(ApiResponse.success("Leaderboard retrieved", response));
    }
}
