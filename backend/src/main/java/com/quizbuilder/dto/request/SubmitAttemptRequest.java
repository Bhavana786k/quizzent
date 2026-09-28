package com.quizbuilder.dto.request;

import java.util.ArrayList;
import java.util.List;

public class SubmitAttemptRequest {

    private List<SubmitAnswerRequest> answers = new ArrayList<>();

    public SubmitAttemptRequest() {}

    public List<SubmitAnswerRequest> getAnswers() {
        return answers;
    }

    public void setAnswers(List<SubmitAnswerRequest> answers) {
        this.answers = answers;
    }
}
