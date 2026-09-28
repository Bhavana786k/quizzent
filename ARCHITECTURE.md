# ARCHITECTURE.md - System Architecture

## 3-Tier Layered Architecture

```text
ReactJS Frontend (Vite, Axios, React Router)
                  │
                  │ REST API (JSON + Bearer JWT Header)
                  ▼
Spring Boot Backend (Controller ➔ Service ➔ Repository)
                  │
                  │ JPA / Hibernate ORM
                  ▼
MySQL Database (quizzent_db)
```

## Backend Layer Separation

1. **Controller Layer** (`com.quizbuilder.controller`): Handles HTTP routing, input validation (`@Valid`), and maps responses into standardized `ApiResponse<T>`.
2. **Service Layer** (`com.quizbuilder.service`): Enforces all business rules (MSQ option limits, schedule checks, passcode verification, partial scoring algorithms, leaderboard ranking).
3. **Repository Layer** (`com.quizbuilder.repository`): Executes optimized JPA/Spring Data database queries.
4. **Security Layer** (`com.quizbuilder.security`): Intercepts requests via `JwtFilter`, verifies HMAC-SHA256 signatures, and injects `Authentication` into Spring `SecurityContext`.

## Key Component Responsibilities
- `QuizService`: Manages quiz creation, updates, soft-deletion, DTO mapping, and security answer-key stripping.
- `EvaluationService`: Evaluates answers for MCQ, True/False, MSQ, Matching, and Very Short Answer types.
- `AttemptService`: Controls start attempt permissions, schedule validation, timer limits, auto-scoring, and result visibility.
- `LeaderboardService`: Sorts attempts by score DESC and completion time ASC, providing top 3 highlights.
- `SearchService`: Provides title keyword search, category filtering, tag filtering, input debouncing support, and pagination.
