package com.quizbuilder.entity;

import com.quizbuilder.entity.enums.MediaType;
import com.quizbuilder.entity.enums.QuestionType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @NotBlank(message = "Question text is required")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType questionType;

    @Column(nullable = false)
    private Double marks = 1.0;

    private String mediaUrl;

    @Enumerated(EnumType.STRING)
    private MediaType mediaType;

    private Integer orderIndex = 0;

    // For VERY_SHORT_ANSWER question type
    private String shortAnswerCorrect;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("orderIndex ASC")
    private List<Option> options = new ArrayList<>();

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<MatchingPair> matchingPairs = new ArrayList<>();

    public Question() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public QuestionType getQuestionType() {
        return questionType;
    }

    public void setQuestionType(QuestionType questionType) {
        this.questionType = questionType;
    }

    public Double getMarks() {
        return marks;
    }

    public void setMarks(Double marks) {
        this.marks = marks;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public MediaType getMediaType() {
        return mediaType;
    }

    public void setMediaType(MediaType mediaType) {
        this.mediaType = mediaType;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public String getShortAnswerCorrect() {
        return shortAnswerCorrect;
    }

    public void setShortAnswerCorrect(String shortAnswerCorrect) {
        this.shortAnswerCorrect = shortAnswerCorrect;
    }

    public List<Option> getOptions() {
        return options;
    }

    public void setOptions(List<Option> options) {
        this.options = options;
    }

    public List<MatchingPair> getMatchingPairs() {
        return matchingPairs;
    }

    public void setMatchingPairs(List<MatchingPair> matchingPairs) {
        this.matchingPairs = matchingPairs;
    }

    public void addOption(Option option) {
        options.add(option);
        option.setQuestion(this);
    }

    public void addMatchingPair(MatchingPair pair) {
        matchingPairs.add(pair);
        pair.setQuestion(this);
    }
}
