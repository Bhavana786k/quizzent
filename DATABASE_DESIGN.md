# DATABASE_DESIGN.md - Quizzent Database Schema

Database Name: `quizzent_db`

```text
User 1 ─── N Quiz
Quiz 1 ─── N Question
Question 1 ─── N Option
Question 1 ─── N MatchingPair
User 1 ─── N QuizAttempt
Quiz 1 ─── N QuizAttempt
QuizAttempt 1 ─── N UserAnswer
Quiz N ─── N Tag (via quiz_tags)
```

## Schema Entities & Tables

### 1. `users`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `full_name` (VARCHAR(255), NOT NULL)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `password` (VARCHAR(255), NOT NULL - BCrypt Hashed)
- `created_at` (DATETIME, NOT NULL)
- `updated_at` (DATETIME)

### 2. `quizzes`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `creator_id` (BIGINT, FK -> users.id)
- `title` (VARCHAR(255), NOT NULL)
- `description` (TEXT)
- `category` (VARCHAR(255), NOT NULL)
- `mode` (VARCHAR(50), NOT NULL - `PRACTICE` | `COMPETITION`)
- `visibility` (VARCHAR(50), NOT NULL - `PUBLIC` | `PRIVATE`)
- `private_access_type` (VARCHAR(50) - `LINK_ONLY` | `LINK_PASSCODE`)
- `passcode_hash` (VARCHAR(255) - BCrypt Hashed)
- `share_code` (VARCHAR(255), UNIQUE, NOT NULL)
- `attempt_limit` (INT)
- `time_limit_minutes` (INT)
- `randomize_questions` (BOOLEAN)
- `randomize_options` (BOOLEAN)
- `show_results_immediately` (BOOLEAN)
- `show_correct_answers` (BOOLEAN)
- `start_time` (DATETIME)
- `end_time` (DATETIME)
- `enable_leaderboard` (BOOLEAN)
- `is_deleted` (BOOLEAN, DEFAULT FALSE)
- `created_at` (DATETIME, NOT NULL)
- `updated_at` (DATETIME)

### 3. `questions`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `quiz_id` (BIGINT, FK -> quizzes.id)
- `question_text` (TEXT, NOT NULL)
- `question_type` (VARCHAR(50), NOT NULL - `MCQ` | `TRUE_FALSE` | `MSQ` | `MATCHING` | `VERY_SHORT_ANSWER`)
- `marks` (DOUBLE, DEFAULT 1.0)
- `media_url` (VARCHAR(255))
- `media_type` (VARCHAR(50))
- `order_index` (INT)
- `short_answer_correct` (VARCHAR(255))

### 4. `options`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `question_id` (BIGINT, FK -> questions.id)
- `option_text` (VARCHAR(255), NOT NULL)
- `is_correct` (BOOLEAN, DEFAULT FALSE)
- `order_index` (INT)

### 5. `matching_pairs`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `question_id` (BIGINT, FK -> questions.id)
- `left_item` (VARCHAR(255), NOT NULL)
- `right_item` (VARCHAR(255), NOT NULL)

### 6. `tags` & `quiz_tags`
- `tags`: `id` (BIGINT, PK), `name` (VARCHAR(255), UNIQUE)
- `quiz_tags`: `quiz_id` (BIGINT, FK), `tag_id` (BIGINT, FK)

### 7. `attempts`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `user_id` (BIGINT, FK -> users.id)
- `quiz_id` (BIGINT, FK -> quizzes.id)
- `attempt_number` (INT)
- `start_time` (DATETIME, NOT NULL)
- `submit_time` (DATETIME)
- `score` (DOUBLE)
- `total_marks` (DOUBLE)
- `time_taken_seconds` (BIGINT)
- `status` (VARCHAR(50) - `IN_PROGRESS` | `COMPLETED` | `TIME_EXPIRED`)

### 8. `answers`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `attempt_id` (BIGINT, FK -> attempts.id)
- `question_id` (BIGINT, FK -> questions.id)
- `selected_option_ids` (VARCHAR(255))
- `matching_response_json` (TEXT)
- `text_answer` (VARCHAR(255))
- `marks_earned` (DOUBLE)
