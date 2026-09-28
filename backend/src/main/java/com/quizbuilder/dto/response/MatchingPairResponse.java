package com.quizbuilder.dto.response;

public class MatchingPairResponse {
    private Long id;
    private String leftItem;
    private String rightItem;

    public MatchingPairResponse() {}

    public MatchingPairResponse(Long id, String leftItem, String rightItem) {
        this.id = id;
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
