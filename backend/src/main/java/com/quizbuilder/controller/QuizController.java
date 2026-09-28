package com.quizbuilder.controller;

import com.quizbuilder.dto.request.QuizRequest;
import com.quizbuilder.dto.response.ApiResponse;
import com.quizbuilder.dto.response.QuizDetailResponse;
import com.quizbuilder.dto.response.QuizResponse;
import com.quizbuilder.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<QuizDetailResponse>> createQuiz(@Valid @RequestBody QuizRequest request) {
        QuizDetailResponse response = quizService.createQuiz(request);
        return ResponseEntity.ok(ApiResponse.success("Quiz created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<QuizDetailResponse>> updateQuiz(@PathVariable Long id, @Valid @RequestBody QuizRequest request) {
        QuizDetailResponse response = quizService.updateQuiz(id, request);
        return ResponseEntity.ok(ApiResponse.success("Quiz updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.ok(ApiResponse.success("Quiz deleted successfully"));
    }

    @GetMapping("/my-quizzes")
    public ResponseEntity<ApiResponse<List<QuizResponse>>> getMyQuizzes() {
        List<QuizResponse> responses = quizService.getMyCreatedQuizzes();
        return ResponseEntity.ok(ApiResponse.success("Created quizzes retrieved", responses));
    }

    @GetMapping("/share/{shareCode}")
    public ResponseEntity<ApiResponse<QuizResponse>> getQuizByShareCode(@PathVariable String shareCode) {
        QuizResponse response = quizService.getQuizByShareCode(shareCode);
        return ResponseEntity.ok(ApiResponse.success("Quiz found", response));
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<ApiResponse<QuizResponse>> getQuizSummary(@PathVariable Long id) {
        QuizResponse response = quizService.getQuizSummary(id);
        return ResponseEntity.ok(ApiResponse.success("Quiz summary retrieved", response));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<ApiResponse<QuizDetailResponse>> getQuizDetailsForCreator(@PathVariable Long id) {
        QuizDetailResponse response = quizService.getQuizDetailsForCreator(id);
        return ResponseEntity.ok(ApiResponse.success("Quiz details retrieved", response));
    }
}
