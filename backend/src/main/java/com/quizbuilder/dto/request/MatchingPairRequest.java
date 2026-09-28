package com.quizbuilder.dto.request;

import jakarta.validation.constraints.NotBlank;

public class MatchingPairRequest {
    private Long id;

    @NotBlank(message = "Left item is required")
    private String leftItem;

    @NotBlank(message = "Right item is required")
    private String rightItem;

    public MatchingPairRequest() {}

    public MatchingPairRequest(String leftItem, String rightItem) {
        this.leftItem = leftItem;
        this.rightItem = rightItem;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLeftItem() {
        return leftItem;
    }

    public void setLeftItem(String leftItem) {
        this.leftItem = leftItem;
    }

    public String getRightItem() {
        return rightItem;
    }

    public void setRightItem(String rightItem) {
        this.rightItem = rightItem;
    }
}
