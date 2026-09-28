package com.quizbuilder.dto.request;

import jakarta.validation.constraints.NotBlank;

public class OptionRequest {
    private Long id;

    @NotBlank(message = "Option text is required")
    private String optionText;

    private Boolean isCorrect = false;
    private Integer orderIndex = 0;

    public OptionRequest() {}

    public OptionRequest(String optionText, Boolean isCorrect) {
        this.optionText = optionText;
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

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}
