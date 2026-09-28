package com.quizbuilder.service;

import com.quizbuilder.dto.request.SubmitAnswerRequest;
import com.quizbuilder.dto.request.SubmitAttemptRequest;
import com.quizbuilder.dto.response.*;
import com.quizbuilder.entity.*;
import com.quizbuilder.entity.enums.AttemptStatus;
import com.quizbuilder.entity.enums.PrivateAccessType;
import com.quizbuilder.entity.enums.QuizVisibility;
import com.quizbuilder.exception.BadRequestException;
import com.quizbuilder.exception.ResourceNotFoundException;
import com.quizbuilder.exception.UnauthorizedException;
import com.quizbuilder.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class AttemptService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptRepository attemptRepository;
    private final UserAnswerRepository userAnswerRepository;
    private final UserService userService;
    private final QuizService quizService;
    private final EvaluationService evaluationService;
    private final PasswordEncoder passwordEncoder;

    public AttemptService(QuizRepository quizRepository,
                          QuestionRepository questionRepository,
                          QuizAttemptRepository attemptRepository,
                          UserAnswerRepository userAnswerRepository,
                          UserService userService,
                          QuizService quizService,
                          EvaluationService evaluationService,
                          PasswordEncoder passwordEncoder) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
        this.userAnswerRepository = userAnswerRepository;
        this.userService = userService;
        this.quizService = quizService;
        this.evaluationService = evaluationService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AttemptStartResponse startAttempt(Long quizId, String passcode) {
        User user = userService.getCurrentUserEntity();
        Quiz quiz = quizRepository.findByIdAndIsDeletedFalse(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        // Schedule Checks (Rule 10, 20)
        LocalDateTime now = LocalDateTime.now();
        if (quiz.getStartTime() != null && now.isBefore(quiz.getStartTime())) {
            throw new BadRequestException("Quiz has not started yet. Starts at: " + quiz.getStartTime());
        }
        if (quiz.getEndTime() != null && now.isAfter(quiz.getEndTime())) {
            throw new BadRequestException("Quiz availability window has ended at: " + quiz.getEndTime());
        }

        // Attempt Limit Checks (Rule 11, 22)
        long attemptCount = attemptRepository.countByUserIdAndQuizId(user.getId(), quizId);
        if (quiz.getAttemptLimit() != null && attemptCount >= quiz.getAttemptLimit()) {
            throw new BadRequestException("You have reached the maximum allowed attempt limit (" + quiz.getAttemptLimit() + ") for this quiz");
        }

        // Private Access Validation (Rule 9.2, 47)
        if (quiz.getVisibility() == QuizVisibility.PRIVATE &&
            quiz.getPrivateAccessType() == PrivateAccessType.LINK_PASSCODE) {
            if (passcode == null || passcode.trim().isEmpty() ||
                !passwordEncoder.matches(passcode.trim(), quiz.getPasscodeHash())) {
                throw new UnauthorizedException("Invalid or missing passcode for this private quiz");
            }
        }

        // Create QuizAttempt
        QuizAttempt attempt = new QuizAttempt();
        attempt.setUser(user);
        attempt.setQuiz(quiz);
        attempt.setAttemptNumber((int) attemptCount + 1);
        attempt.setStartTime(now);
        attempt.setStatus(AttemptStatus.IN_PROGRESS);

        QuizAttempt savedAttempt = attemptRepository.save(attempt);

        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quizId);

        // Randomize questions if configured
        if (Boolean.TRUE.equals(quiz.getRandomizeQuestions())) {
            Collections.shuffle(questions);
        }

        // Map questions for attempt (isForAttempt = true strips correct answers!)
        List<QuestionResponse> questionResps = questions.stream().map(q -> {
            QuestionResponse resp = quizService.mapToQuestionResponse(q, true);
            if (Boolean.TRUE.equals(quiz.getRandomizeOptions()) && resp.getOptions() != null) {
                Collections.shuffle(resp.getOptions());
            }
            return resp;
        }).collect(Collectors.toList());

        QuizResponse quizResp = quizService.mapToQuizResponse(quiz, questions);

        return new AttemptStartResponse(
                savedAttempt.getId(),
                quizResp,
                questionResps,
                savedAttempt.getStartTime(),
                quiz.getTimeLimitMinutes()
        );
    }

    @Transactional
    public AttemptResultResponse submitAttempt(Long attemptId, SubmitAttemptRequest request) {
        User user = userService.getCurrentUserEntity();
        QuizAttempt attempt = attemptRepository.findByIdAndUserId(attemptId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));

        if (attempt.getStatus() != AttemptStatus.IN_PROGRESS) {
            throw new BadRequestException("This attempt has already been submitted");
        }

        Quiz quiz = attempt.getQuiz();
        LocalDateTime now = LocalDateTime.now();
        long secondsTaken = Duration.between(attempt.getStartTime(), now).getSeconds();

        // Map submitted answers by questionId
        Map<Long, SubmitAnswerRequest> submitMap = request.getAnswers() != null ?
                request.getAnswers().stream().collect(Collectors.toMap(SubmitAnswerRequest::getQuestionId, Function.identity(), (a, b) -> a))
                : Collections.emptyMap();

        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quiz.getId());

        double totalEarnedScore = 0.0;
        double totalQuizMarks = 0.0;
        List<UserAnswerResultDto> answerResults = new ArrayList<>();

        for (Question q : questions) {
            totalQuizMarks += q.getMarks();
            SubmitAnswerRequest userAnsReq = submitMap.get(q.getId());

            UserAnswerResultDto resultDto = evaluationService.evaluateQuestion(q, userAnsReq, Boolean.TRUE.equals(quiz.getShowCorrectAnswers()));
            totalEarnedScore += resultDto.getMarksEarned();
            answerResults.add(resultDto);

            // Save UserAnswer record
            UserAnswer uAns = new UserAnswer();
            uAns.setAttempt(attempt);
            uAns.setQuestion(q);
            if (userAnsReq != null) {
                if (userAnsReq.getSelectedOptionIds() != null && !userAnsReq.getSelectedOptionIds().isEmpty()) {
                    uAns.setSelectedOptionIds(userAnsReq.getSelectedOptionIds().stream().map(Object::toString).collect(Collectors.joining(",")));
                }
                if (userAnsReq.getMatchingPairs() != null && !userAnsReq.getMatchingPairs().isEmpty()) {
                    uAns.setMatchingResponseJson(evaluationService.serializeMatchingPairs(userAnsReq.getMatchingPairs()));
                }
                uAns.setTextAnswer(userAnsReq.getTextAnswer());
            }
            uAns.setMarksEarned(resultDto.getMarksEarned());
            userAnswerRepository.save(uAns);
        }

        attempt.setSubmitTime(now);
        attempt.setScore(totalEarnedScore);
        attempt.setTotalMarks(totalQuizMarks);
        attempt.setTimeTakenSeconds(secondsTaken);
        attempt.setStatus(AttemptStatus.COMPLETED);

        attemptRepository.save(attempt);

        return buildAttemptResultResponse(attempt, quiz, answerResults);
    }

    public AttemptResultResponse getAttemptResult(Long attemptId) {
        User user = userService.getCurrentUserEntity();
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));

        Quiz quiz = attempt.getQuiz();

        // Verify user is either attempt taker or quiz creator
        if (!attempt.getUser().getId().equals(user.getId()) && !quiz.getCreator().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to view this attempt result");
        }

        List<UserAnswer> userAnswers = userAnswerRepository.findByAttemptId(attemptId);
        Map<Long, UserAnswer> answerMap = userAnswers.stream()
                .collect(Collectors.toMap(u -> u.getQuestion().getId(), Function.identity(), (a, b) -> a));

        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quiz.getId());
        List<UserAnswerResultDto> answerResults = new ArrayList<>();

        for (Question q : questions) {
            UserAnswer uAns = answerMap.get(q.getId());
            SubmitAnswerRequest dummyReq = new SubmitAnswerRequest();
            dummyReq.setQuestionId(q.getId());

            if (uAns != null) {
                if (uAns.getSelectedOptionIds() != null && !uAns.getSelectedOptionIds().isEmpty()) {
                    List<Long> optIds = Arrays.stream(uAns.getSelectedOptionIds().split(","))
                            .map(String::trim).map(Long::parseLong).collect(Collectors.toList());
                    dummyReq.setSelectedOptionIds(optIds);
                }
                if (uAns.getMatchingResponseJson() != null) {
                    dummyReq.setMatchingPairs(evaluationService.deserializeMatchingPairs(uAns.getMatchingResponseJson()));
                }
                dummyReq.setTextAnswer(uAns.getTextAnswer());
            }

            UserAnswerResultDto resultDto = evaluationService.evaluateQuestion(q, dummyReq, Boolean.TRUE.equals(quiz.getShowCorrectAnswers()));
            answerResults.add(resultDto);
        }

        return buildAttemptResultResponse(attempt, quiz, answerResults);
    }

    public List<AttemptResultResponse> getUserAttemptHistory() {
        User user = userService.getCurrentUserEntity();
        List<QuizAttempt> attempts = attemptRepository.findByUserIdOrderByStartTimeDesc(user.getId());

        return attempts.stream().map(att -> {
            Quiz quiz = att.getQuiz();
            AttemptResultResponse resp = new AttemptResultResponse();
            resp.setAttemptId(att.getId());
            resp.setQuizId(quiz.getId());
            resp.setQuizTitle(quiz.getTitle());
            resp.setScore(att.getScore());
            resp.setTotalMarks(att.getTotalMarks());
            double percentage = att.getTotalMarks() > 0 ? (att.getScore() / att.getTotalMarks()) * 100.0 : 0.0;
            resp.setPercentage(Math.round(percentage * 100.0) / 100.0);
            resp.setTimeTakenSeconds(att.getTimeTakenSeconds());
            resp.setStatus(att.getStatus());
            resp.setSubmitTime(att.getSubmitTime());
            resp.setShowResultsImmediately(quiz.getShowResultsImmediately());
            resp.setShowCorrectAnswers(quiz.getShowCorrectAnswers());
            return resp;
        }).collect(Collectors.toList());
    }

    private AttemptResultResponse buildAttemptResultResponse(QuizAttempt attempt, Quiz quiz, List<UserAnswerResultDto> answerResults) {
        AttemptResultResponse resp = new AttemptResultResponse();
        resp.setAttemptId(attempt.getId());
        resp.setQuizId(quiz.getId());
        resp.setQuizTitle(quiz.getTitle());
        resp.setScore(attempt.getScore());
        resp.setTotalMarks(attempt.getTotalMarks());
        double percentage = attempt.getTotalMarks() > 0 ? (attempt.getScore() / attempt.getTotalMarks()) * 100.0 : 0.0;
        resp.setPercentage(Math.round(percentage * 100.0) / 100.0);
        resp.setTimeTakenSeconds(attempt.getTimeTakenSeconds());
        resp.setStatus(attempt.getStatus());
        resp.setSubmitTime(attempt.getSubmitTime());
        resp.setShowResultsImmediately(quiz.getShowResultsImmediately());
        resp.setShowCorrectAnswers(quiz.getShowCorrectAnswers());

        // CRITICAL RULE 23 & 25: Respect showResultsImmediately configuration
        if (Boolean.TRUE.equals(quiz.getShowResultsImmediately())) {
            resp.setAnswers(answerResults);
        } else {
            // Hide detailed answers when immediate results are disabled
            resp.setAnswers(Collections.emptyList());
        }

        return resp;
    }
}
