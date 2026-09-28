package com.quizbuilder.service;

import com.quizbuilder.dto.request.*;
import com.quizbuilder.dto.response.*;
import com.quizbuilder.entity.*;
import com.quizbuilder.entity.enums.PrivateAccessType;
import com.quizbuilder.entity.enums.QuestionType;
import com.quizbuilder.entity.enums.QuizVisibility;
import com.quizbuilder.exception.BadRequestException;
import com.quizbuilder.exception.ResourceNotFoundException;
import com.quizbuilder.exception.UnauthorizedException;
import com.quizbuilder.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final TagRepository tagRepository;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public QuizService(QuizRepository quizRepository,
                       QuestionRepository questionRepository,
                       TagRepository tagRepository,
                       UserService userService,
                       PasswordEncoder passwordEncoder) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.tagRepository = tagRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public QuizDetailResponse createQuiz(QuizRequest request) {
        User currentUser = userService.getCurrentUserEntity();

        Quiz quiz = new Quiz();
        quiz.setCreator(currentUser);
        quiz.setTitle(request.getTitle().trim());
        quiz.setDescription(request.getDescription());
        quiz.setCategory(request.getCategory().trim());
        quiz.setMode(request.getMode());
        quiz.setVisibility(request.getVisibility());
        quiz.setPrivateAccessType(request.getPrivateAccessType());

        if (request.getVisibility() == QuizVisibility.PRIVATE &&
            request.getPrivateAccessType() == PrivateAccessType.LINK_PASSCODE) {
            if (request.getPasscode() == null || request.getPasscode().trim().isEmpty()) {
                throw new BadRequestException("Passcode is required for Link + Passcode private quizzes");
            }
            quiz.setPasscodeHash(passwordEncoder.encode(request.getPasscode().trim()));
        }

        quiz.setAttemptLimit(request.getAttemptLimit());
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setRandomizeQuestions(request.getRandomizeQuestions());
        quiz.setRandomizeOptions(request.getRandomizeOptions());
        quiz.setShowResultsImmediately(request.getShowResultsImmediately());
        quiz.setShowCorrectAnswers(request.getShowCorrectAnswers());
        quiz.setStartTime(request.getStartTime());
        quiz.setEndTime(request.getEndTime());
        quiz.setEnableLeaderboard(request.getEnableLeaderboard());

        // Process tags
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            Set<Tag> tags = processTags(request.getTags());
            quiz.setTags(tags);
        }

        Quiz savedQuiz = quizRepository.save(quiz);

        // Process questions
        List<Question> savedQuestions = new ArrayList<>();
        if (request.getQuestions() != null) {
            int order = 1;
            for (QuestionRequest qReq : request.getQuestions()) {
                Question question = buildQuestionEntity(qReq, savedQuiz, order++);
                savedQuestions.add(questionRepository.save(question));
            }
        }

        return buildQuizDetailResponse(savedQuiz, savedQuestions, false);
    }

    @Transactional
    public QuizDetailResponse updateQuiz(Long quizId, QuizRequest request) {
        User currentUser = userService.getCurrentUserEntity();
        Quiz quiz = quizRepository.findByIdAndIsDeletedFalse(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        if (!quiz.getCreator().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to edit this quiz");
        }

        quiz.setTitle(request.getTitle().trim());
        quiz.setDescription(request.getDescription());
        quiz.setCategory(request.getCategory().trim());
        quiz.setMode(request.getMode());
        quiz.setVisibility(request.getVisibility());
        quiz.setPrivateAccessType(request.getPrivateAccessType());

        if (request.getVisibility() == QuizVisibility.PRIVATE &&
            request.getPrivateAccessType() == PrivateAccessType.LINK_PASSCODE &&
            request.getPasscode() != null && !request.getPasscode().trim().isEmpty()) {
            quiz.setPasscodeHash(passwordEncoder.encode(request.getPasscode().trim()));
        }

        quiz.setAttemptLimit(request.getAttemptLimit());
        quiz.setTimeLimitMinutes(request.getTimeLimitMinutes());
        quiz.setRandomizeQuestions(request.getRandomizeQuestions());
        quiz.setRandomizeOptions(request.getRandomizeOptions());
        quiz.setShowResultsImmediately(request.getShowResultsImmediately());
        quiz.setShowCorrectAnswers(request.getShowCorrectAnswers());
        quiz.setStartTime(request.getStartTime());
        quiz.setEndTime(request.getEndTime());
        quiz.setEnableLeaderboard(request.getEnableLeaderboard());

        if (request.getTags() != null) {
            quiz.setTags(processTags(request.getTags()));
        }

        // Replace questions
        List<Question> existingQuestions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quizId);
        questionRepository.deleteAll(existingQuestions);

        Quiz savedQuiz = quizRepository.save(quiz);
        List<Question> savedQuestions = new ArrayList<>();
        if (request.getQuestions() != null) {
            int order = 1;
            for (QuestionRequest qReq : request.getQuestions()) {
                Question question = buildQuestionEntity(qReq, savedQuiz, order++);
                savedQuestions.add(questionRepository.save(question));
            }
        }

        return buildQuizDetailResponse(savedQuiz, savedQuestions, false);
    }

    @Transactional
    public void deleteQuiz(Long quizId) {
        User currentUser = userService.getCurrentUserEntity();
        Quiz quiz = quizRepository.findByIdAndIsDeletedFalse(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        if (!quiz.getCreator().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You are not authorized to delete this quiz");
        }

        quiz.setIsDeleted(true);
        quizRepository.save(quiz);
    }

    public QuizDetailResponse getQuizDetailsForCreator(Long quizId) {
        User currentUser = userService.getCurrentUserEntity();
        Quiz quiz = quizRepository.findByIdAndIsDeletedFalse(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        if (!quiz.getCreator().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("Only quiz creator can access full management details");
        }

        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quizId);
        return buildQuizDetailResponse(quiz, questions, false);
    }

    public QuizResponse getQuizByShareCode(String shareCode) {
        Quiz quiz = quizRepository.findByShareCodeAndIsDeletedFalse(shareCode)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quiz.getId());
        return mapToQuizResponse(quiz, questions);
    }

    public QuizResponse getQuizSummary(Long quizId) {
        Quiz quiz = quizRepository.findByIdAndIsDeletedFalse(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(quizId);
        return mapToQuizResponse(quiz, questions);
    }

    public List<QuizResponse> getMyCreatedQuizzes() {
        User currentUser = userService.getCurrentUserEntity();
        List<Quiz> quizzes = quizRepository.findByCreatorIdAndIsDeletedFalseOrderByCreatedAtDesc(currentUser.getId());
        return quizzes.stream().map(q -> {
            List<Question> questions = questionRepository.findByQuizIdOrderByOrderIndexAsc(q.getId());
            return mapToQuizResponse(q, questions);
        }).collect(Collectors.toList());
    }

    private Set<Tag> processTags(Set<String> tagNames) {
        Set<Tag> tags = new HashSet<>();
        for (String tagName : tagNames) {
            String cleanName = tagName.trim();
            if (!cleanName.isEmpty()) {
                Tag tag = tagRepository.findByNameIgnoreCase(cleanName)
                        .orElseGet(() -> tagRepository.save(new Tag(cleanName)));
                tags.add(tag);
            }
        }
        return tags;
    }

    private Question buildQuestionEntity(QuestionRequest qReq, Quiz quiz, int orderIndex) {
        Question question = new Question();
        question.setQuiz(quiz);
        question.setQuestionText(qReq.getQuestionText().trim());
        question.setQuestionType(qReq.getQuestionType());
        question.setMarks(qReq.getMarks() != null && qReq.getMarks() > 0 ? qReq.getMarks() : 1.0);
        question.setMediaUrl(qReq.getMediaUrl());
        question.setMediaType(qReq.getMediaType());
        question.setOrderIndex(orderIndex);

        // Option limit validation (Rule 2 & 18: Max 6 options)
        if (qReq.getQuestionType() == QuestionType.MCQ || qReq.getQuestionType() == QuestionType.MSQ) {
            if (qReq.getOptions() == null || qReq.getOptions().size() < 2) {
                throw new BadRequestException("MCQ and MSQ questions must have at least 2 options");
            }
            if (qReq.getOptions().size() > 6) {
                throw new BadRequestException("Question options cannot exceed maximum limit of 6 options");
            }
        }

        if (qReq.getQuestionType() == QuestionType.TRUE_FALSE) {
            if (qReq.getOptions() == null || qReq.getOptions().size() != 2) {
                throw new BadRequestException("True/False questions must have exactly 2 options (True and False)");
            }
        }

        if (qReq.getQuestionType() == QuestionType.MCQ || qReq.getQuestionType() == QuestionType.TRUE_FALSE) {
            long correctCount = qReq.getOptions().stream().filter(o -> Boolean.TRUE.equals(o.getIsCorrect())).count();
            if (correctCount != 1) {
                throw new BadRequestException("MCQ and True/False questions must have exactly 1 correct answer");
            }
        }

        if (qReq.getQuestionType() == QuestionType.MSQ) {
            long correctCount = qReq.getOptions().stream().filter(o -> Boolean.TRUE.equals(o.getIsCorrect())).count();
            if (correctCount < 1) {
                throw new BadRequestException("MSQ questions must have at least 1 correct answer defined");
            }
        }

        if (qReq.getQuestionType() == QuestionType.VERY_SHORT_ANSWER) {
            if (qReq.getShortAnswerCorrect() == null || qReq.getShortAnswerCorrect().trim().isEmpty()) {
                throw new BadRequestException("Very Short Answer question requires a correct answer string");
            }
            question.setShortAnswerCorrect(qReq.getShortAnswerCorrect().trim());
        }

        if (qReq.getQuestionType() == QuestionType.MATCHING) {
            if (qReq.getMatchingPairs() == null || qReq.getMatchingPairs().size() < 1) {
                throw new BadRequestException("Matching questions must have at least 1 matching pair");
            }
        }

        // Build Options
        if (qReq.getOptions() != null) {
            int optOrder = 1;
            for (OptionRequest oReq : qReq.getOptions()) {
                Option option = new Option(oReq.getOptionText().trim(), Boolean.TRUE.equals(oReq.getIsCorrect()));
                option.setOrderIndex(optOrder++);
                question.addOption(option);
            }
        }

        // Build Matching Pairs
        if (qReq.getMatchingPairs() != null) {
            for (MatchingPairRequest mReq : qReq.getMatchingPairs()) {
                MatchingPair pair = new MatchingPair(mReq.getLeftItem().trim(), mReq.getRightItem().trim());
                question.addMatchingPair(pair);
            }
        }

        return question;
    }

    public QuizDetailResponse buildQuizDetailResponse(Quiz quiz, List<Question> questions, boolean isForAttempt) {
        QuizResponse quizResp = mapToQuizResponse(quiz, questions);
        List<QuestionResponse> questionResps = questions.stream()
                .map(q -> mapToQuestionResponse(q, isForAttempt))
                .collect(Collectors.toList());
        return new QuizDetailResponse(quizResp, questionResps);
    }

    public QuizResponse mapToQuizResponse(Quiz quiz, List<Question> questions) {
        QuizResponse response = new QuizResponse();
        response.setId(quiz.getId());
        response.setCreator(new UserDto(quiz.getCreator().getId(), quiz.getCreator().getFullName(), quiz.getCreator().getEmail()));
        response.setTitle(quiz.getTitle());
        response.setDescription(quiz.getDescription());
        response.setCategory(quiz.getCategory());
        response.setTags(quiz.getTags().stream().map(Tag::getName).collect(Collectors.toList()));
        response.setMode(quiz.getMode());
        response.setVisibility(quiz.getVisibility());
        response.setPrivateAccessType(quiz.getPrivateAccessType());
        response.setShareCode(quiz.getShareCode());
        response.setAttemptLimit(quiz.getAttemptLimit());
        response.setTimeLimitMinutes(quiz.getTimeLimitMinutes());
        response.setRandomizeQuestions(quiz.getRandomizeQuestions());
        response.setRandomizeOptions(quiz.getRandomizeOptions());
        response.setShowResultsImmediately(quiz.getShowResultsImmediately());
        response.setShowCorrectAnswers(quiz.getShowCorrectAnswers());
        response.setStartTime(quiz.getStartTime());
        response.setEndTime(quiz.getEndTime());
        response.setEnableLeaderboard(quiz.getEnableLeaderboard());
        response.setQuestionCount(questions != null ? questions.size() : 0);
        response.setTotalMarks(questions != null ? questions.stream().mapToDouble(Question::getMarks).sum() : 0.0);
        response.setCreatedAt(quiz.getCreatedAt());
        response.setUpdatedAt(quiz.getUpdatedAt());
        return response;
    }

    public QuestionResponse mapToQuestionResponse(Question question, boolean isForAttempt) {
        QuestionResponse qResp = new QuestionResponse();
        qResp.setId(question.getId());
        qResp.setQuestionText(question.getQuestionText());
        qResp.setQuestionType(question.getQuestionType());
        qResp.setMarks(question.getMarks());
        qResp.setMediaUrl(question.getMediaUrl());
        qResp.setMediaType(question.getMediaType());
        qResp.setOrderIndex(question.getOrderIndex());

        // For MSQ: Calculate maxSelectionsAllowed (count of correct options)
        if (question.getQuestionType() == QuestionType.MSQ) {
            long correctCount = question.getOptions().stream().filter(Option::getIsCorrect).count();
            qResp.setMaxSelectionsAllowed((int) correctCount);
        }

        // Hide correct answer string for VERY_SHORT_ANSWER during attempt taking
        if (!isForAttempt) {
            qResp.setShortAnswerCorrect(question.getShortAnswerCorrect());
        }

        // Options
        if (question.getOptions() != null) {
            List<OptionResponse> optResps = question.getOptions().stream().map(opt -> {
                OptionResponse oResp = new OptionResponse();
                oResp.setId(opt.getId());
                oResp.setOptionText(opt.getOptionText());
                oResp.setOrderIndex(opt.getOrderIndex());
                // CRITICAL SECURITY RULE: Do NOT expose isCorrect during quiz attempt taking!
                if (!isForAttempt) {
                    oResp.setIsCorrect(opt.getIsCorrect());
                }
                return oResp;
            }).collect(Collectors.toList());
            qResp.setOptions(optResps);
        }

        // Matching Pairs
        if (question.getMatchingPairs() != null) {
            List<MatchingPairResponse> matchResps = question.getMatchingPairs().stream().map(m ->
                new MatchingPairResponse(m.getId(), m.getLeftItem(), m.getRightItem())
            ).collect(Collectors.toList());
            qResp.setMatchingPairs(matchResps);
        }

        return qResp;
    }
}
