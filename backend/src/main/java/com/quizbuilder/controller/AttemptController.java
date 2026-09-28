package com.quizbuilder.controller;

import com.quizbuilder.dto.request.PasscodeVerifyRequest;
import com.quizbuilder.dto.request.SubmitAttemptRequest;
import com.quizbuilder.dto.response.ApiResponse;
import com.quizbuilder.dto.response.AttemptResultResponse;
import com.quizbuilder.dto.response.AttemptStartResponse;
import com.quizbuilder.service.AttemptService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attempts")
public class AttemptController {

    private final AttemptService attemptService;

    public AttemptController(AttemptService attemptService) {
        this.attemptService = attemptService;
    }

    @PostMapping("/start/{quizId}")
    public ResponseEntity<ApiResponse<AttemptStartResponse>> startAttempt(
            @PathVariable Long quizId,
            @RequestBody(required = false) PasscodeVerifyRequest request) {
        String passcode = request != null ? request.getPasscode() : null;
        AttemptStartResponse response = attemptService.startAttempt(quizId, passcode);
        return ResponseEntity.ok(ApiResponse.success("Attempt started successfully", response));
    }

    @PostMapping("/{attemptId}/submit")
    public ResponseEntity<ApiResponse<AttemptResultResponse>> submitAttempt(
            @PathVariable Long attemptId,
            @Valid @RequestBody SubmitAttemptRequest request) {
        AttemptResultResponse response = attemptService.submitAttempt(attemptId, request);
        return ResponseEntity.ok(ApiResponse.success("Quiz attempt submitted successfully", response));
    }

    @GetMapping("/{attemptId}/result")
    public ResponseEntity<ApiResponse<AttemptResultResponse>> getAttemptResult(@PathVariable Long attemptId) {
        AttemptResultResponse response = attemptService.getAttemptResult(attemptId);
        return ResponseEntity.ok(ApiResponse.success("Attempt result retrieved", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<AttemptResultResponse>>> getUserAttemptHistory() {
        List<AttemptResultResponse> history = attemptService.getUserAttemptHistory();
        return ResponseEntity.ok(ApiResponse.success("Attempt history retrieved", history));
    }
}
