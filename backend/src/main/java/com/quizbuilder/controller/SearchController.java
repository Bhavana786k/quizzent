package com.quizbuilder.controller;

import com.quizbuilder.dto.response.ApiResponse;
import com.quizbuilder.dto.response.QuizResponse;
import com.quizbuilder.service.SearchService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<QuizResponse>>> searchPublicQuizzes(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<QuizResponse> results = searchService.searchPublicQuizzes(q, category, tag, page, size);
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved", results));
    }
}
