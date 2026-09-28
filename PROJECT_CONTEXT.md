# PROJECT_CONTEXT.md - Quizzent Platform

## Overview
**Quizzent** is a 3-tier, full-stack online quiz builder and assessment platform built with ReactJS, Spring Boot, Spring Security (JWT), Spring Data JPA, and MySQL.

The application allows every registered user to both **create interactive quizzes** and **attempt quizzes** created by others across two operational modes: **Practice Mode** and **Competition Mode**.

---

## Core Technical Decisions

### 1. Technology Stack
- **Frontend**: React 18+, Vite, React Router DOM, Axios, Lucide React icons, CSS variables.
- **Backend**: Spring Boot 3+, Spring Web, Spring Data JPA, Spring Security 6, JWT (JJWT 0.11.5), BCrypt Password Encoder, Bean Validation.
- **Database**: MySQL 8.0 (`quizzent_db`) with Hibernate DDL Auto.
- **Build Tools**: Maven Wrapper (`mvnw.cmd` / `./mvnw`) and NPM.

### 2. Business Rules & Enforcement
1. **User Equality**: All registered users can create, edit, delete their own quizzes and attempt any eligible quiz.
2. **5 Question Types**:
   - MCQ: Max 6 options, 1 correct choice. 100% or 0%.
   - True/False: 2 options, 1 correct choice. 100% or 0%.
   - MSQ (Multiple Select Question): Max 6 options, multiple correct choices.
     - **Selection Limit Lock**: User selection count cannot exceed count of correct options (`selectedCount <= maxSelectionsAllowed`). Enforced on both frontend UI & backend validation.
     - **Partial Scoring**: `Total Marks / Count(Correct Options)` per correct selection. No negative marking.
   - Matching Pairs: `Total Marks / Count(Pairs)` per correct pair. Order independent.
   - Very Short Answer: Case-insensitive normalized exact match after trimming whitespace.
3. **Privacy & Security**:
   - Public quizzes appear in public search.
   - Private Link Only: Accessible via unique share code URL.
   - Private Link + Passcode: Requires passcode verification before attempt start. Passcodes hashed with BCrypt.
   - Answer Key Protection: `isCorrect` flags and short answer keys are strictly filtered out of attempt payload DTOs.
4. **Schedule & Attempt Limits**:
   - Server-enforced start/end date time windows.
   - Server-enforced per-user attempt limits.
5. **Leaderboard & Ranking**:
   - Primary sorting: Score DESC.
   - Tie-breaker: Time taken seconds ASC.
   - Top 3 visual podium highlights (🥇 Gold, 🥈 Silver, 🥉 Bronze).
6. **Soft Delete**:
   - Quiz deletion sets `is_deleted = true`, preserving relational history while hiding quiz from search and attempt listings.
7. **In-App Documentation**:
   - Accessible at `/help`, explaining all rules, quiz modes, and scoring formulas in simple language.
