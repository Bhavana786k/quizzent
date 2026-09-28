package com.quizbuilder.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quizbuilder.dto.request.SubmitAnswerRequest;
import com.quizbuilder.dto.response.UserAnswerResultDto;
import com.quizbuilder.entity.*;
import com.quizbuilder.entity.enums.QuestionType;
import com.quizbuilder.exception.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EvaluationService {

    private final ObjectMapper objectMapper;

    public EvaluationService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public UserAnswerResultDto evaluateQuestion(Question question, SubmitAnswerRequest userAns, boolean showCorrectAnswers) {
        UserAnswerResultDto result = new UserAnswerResultDto();
        result.setQuestionId(question.getId());
        result.setQuestionText(question.getQuestionText());
        result.setQuestionType(question.getQuestionType());
        result.setTotalQuestionMarks(question.getMarks());

        QuestionType type = question.getQuestionType();
        double marksEarned = 0.0;
        boolean isFullyCorrect = false;

        if (type == QuestionType.MCQ || type == QuestionType.TRUE_FALSE) {
            List<Long> selected = userAns != null && userAns.getSelectedOptionIds() != null
                    ? userAns.getSelectedOptionIds() : Collections.emptyList();
            result.setSelectedOptionIds(selected);

            List<Long> correctOptionIds = question.getOptions().stream()
                    .filter(Option::getIsCorrect)
                    .map(Option::getId)
                    .collect(Collectors.toList());

            if (showCorrectAnswers) {
                result.setCorrectOptionIds(correctOptionIds);
            }

            if (!selected.isEmpty() && correctOptionIds.contains(selected.get(0))) {
                marksEarned = question.getMarks();
                isFullyCorrect = true;
            }
        } else if (type == QuestionType.MSQ) {
            List<Long> selected = userAns != null && userAns.getSelectedOptionIds() != null
                    ? userAns.getSelectedOptionIds() : Collections.emptyList();

            List<Long> correctOptionIds = question.getOptions().stream()
                    .filter(Option::getIsCorrect)
                    .map(Option::getId)
                    .collect(Collectors.toList());

            int maxAllowedSelections = correctOptionIds.size();

            // CRITICAL BUSINESS RULE 3 & 14: User must NOT select more options than correct options count!
            if (selected.size() > maxAllowedSelections) {
                throw new BadRequestException("Submitted selections for question '" + question.getQuestionText() +
                        "' exceeds the maximum allowed count of " + maxAllowedSelections);
            }

            result.setSelectedOptionIds(selected);
            if (showCorrectAnswers) {
                result.setCorrectOptionIds(correctOptionIds);
            }

            if (maxAllowedSelections > 0) {
                double marksPerCorrectOption = question.getMarks() / maxAllowedSelections;
                long correctSelectionsCount = selected.stream().filter(correctOptionIds::contains).count();
                marksEarned = correctSelectionsCount * marksPerCorrectOption;
                isFullyCorrect = (correctSelectionsCount == maxAllowedSelections) && (selected.size() == maxAllowedSelections);
            }
        } else if (type == QuestionType.MATCHING) {
            Map<String, String> userPairs = userAns != null && userAns.getMatchingPairs() != null
                    ? userAns.getMatchingPairs() : Collections.emptyMap();

            result.setUserMatchingPairs(userPairs);

            Map<String, String> correctPairs = new HashMap<>();
            for (MatchingPair pair : question.getMatchingPairs()) {
                correctPairs.put(pair.getLeftItem(), pair.getRightItem());
            }

            if (showCorrectAnswers) {
                result.setCorrectMatchingPairs(correctPairs);
            }

            int totalPairs = correctPairs.size();
            if (totalPairs > 0) {
                double marksPerPair = question.getMarks() / totalPairs;
                int correctCount = 0;
                for (Map.Entry<String, String> entry : correctPairs.entrySet()) {
                    String left = entry.getKey();
                    String expectedRight = entry.getValue();
                    String userRight = userPairs.get(left);

                    if (userRight != null && userRight.trim().equalsIgnoreCase(expectedRight.trim())) {
                        correctCount++;
                    }
                }
                marksEarned = correctCount * marksPerPair;
                isFullyCorrect = (correctCount == totalPairs);
            }
        } else if (type == QuestionType.VERY_SHORT_ANSWER) {
            String userText = userAns != null && userAns.getTextAnswer() != null ? userAns.getTextAnswer() : "";
            result.setUserTextAnswer(userText);

            String expectedText = question.getShortAnswerCorrect() != null ? question.getShortAnswerCorrect() : "";
            if (showCorrectAnswers) {
                result.setCorrectTextAnswer(expectedText);
            }

            // RULE 7 & 17: Case-insensitive, leading/trailing whitespace ignored
            String normUser = userText.trim().toLowerCase();
            String normExpected = expectedText.trim().toLowerCase();

            if (!normUser.isEmpty() && normUser.equals(normExpected)) {
                marksEarned = question.getMarks();
                isFullyCorrect = true;
            }
        }

        result.setMarksEarned(marksEarned);
        result.setIsCorrect(isFullyCorrect);
        return result;
    }

    public String serializeMatchingPairs(Map<String, String> pairs) {
        if (pairs == null || pairs.isEmpty()) return null;
        try {
            return objectMapper.writeValueAsString(pairs);
        } catch (Exception e) {
            return null;
        }
    }

    public Map<String, String> deserializeMatchingPairs(String json) {
        if (json == null || json.trim().isEmpty()) return Collections.emptyMap();
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
        } catch (Exception e) {
            return Collections.emptyMap();
        }
    }
}
