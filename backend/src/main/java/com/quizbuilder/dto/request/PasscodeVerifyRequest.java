package com.quizbuilder.dto.request;

import jakarta.validation.constraints.NotBlank;

public class PasscodeVerifyRequest {
    @NotBlank(message = "Passcode is required")
    private String passcode;

    public PasscodeVerifyRequest() {}

    public PasscodeVerifyRequest(String passcode) {
        this.passcode = passcode;
    }

    public String getPasscode() {
        return passcode;
    }

    public void setPasscode(String passcode) {
        this.passcode = passcode;
    }
}
