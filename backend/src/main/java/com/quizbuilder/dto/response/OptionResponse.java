package com.quizbuilder.dto.response;

public class OptionResponse {
    private Long id;
    private String optionText;
    private Integer orderIndex;
    private Boolean isCorrect; // null when taking quiz, populated for creator/management or result review

    public OptionResponse() {}

    public OptionResponse(Long id, String optionText, Integer orderIndex, Boolean isCorrect) {
        this.id = id;
        this.optionText = optionText;
        this.orderIndex = orderIndex;
        this.isCorrect = isCorrect;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}
