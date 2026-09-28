# API_DOCUMENTATION.md - Quizzent REST APIs

Base URL: `http://localhost:8080/api`

---

## 1. Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Request Body**:
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Response**: `ApiResponse<AuthResponse>` (JWT Token + User Profile).

### Login User
- **POST** `/auth/login`
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "password123"
  }
  ```
- **Response**: `ApiResponse<AuthResponse>`.

### Get Current User Profile
- **GET** `/auth/me`
- **Header**: `Authorization: Bearer <token>`
- **Response**: `ApiResponse<UserDto>`.

---

## 2. Quiz Management Endpoints

### Create Quiz
- **POST** `/quizzes`
- **Header**: `Authorization: Bearer <token>`
- **Request Body**: `QuizRequest` (Title, description, category, tags, mode, visibility, questions).
- **Response**: `ApiResponse<QuizDetailResponse>`.

### Update Quiz
- **PUT** `/quizzes/{id}`
- **Header**: `Authorization: Bearer <token>`

### Soft Delete Quiz
- **DELETE** `/quizzes/{id}`
- **Header**: `Authorization: Bearer <token>`

### List Creator Quizzes
- **GET** `/quizzes/my-quizzes`

### Get Quiz Public Summary
- **GET** `/quizzes/{id}/summary`

### Get Quiz By Share Code
- **GET** `/quizzes/share/{shareCode}`

---

## 3. Quiz Attempt Endpoints

### Start Attempt
- **POST** `/attempts/start/{quizId}`
- **Header**: `Authorization: Bearer <token>`
- **Request Body** (Optional for private passcode quiz):
  ```json
  {
    "passcode": "secret123"
  }
  ```
- **Response**: `ApiResponse<AttemptStartResponse>` (Attempt ID, quiz metadata, questions with answer keys stripped).

### Submit Attempt
- **POST** `/attempts/{attemptId}/submit`
- **Header**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "answers": [
      {
        "questionId": 1,
        "selectedOptionIds": [10, 12]
      },
      {
        "questionId": 2,
        "matchingPairs": { "Java": "Language", "MySQL": "Database" }
      },
      {
        "questionId": 3,
        "textAnswer": "Delhi"
      }
    ]
  }
  ```
- **Response**: `ApiResponse<AttemptResultResponse>`.

### Get Attempt Result
- **GET** `/attempts/{attemptId}/result`

### Get User Attempt History
- **GET** `/attempts/history`

---

## 4. Leaderboard Endpoints

### Get Quiz Leaderboard
- **GET** `/leaderboards/{quizId}`
- **Response**: `ApiResponse<LeaderboardResponse>` (Top 3 podium highlights + ranked list).

---

## 5. Search & Media Endpoints

### Search Public Quizzes
- **GET** `/search?q=java&category=Education&tag=Spring&page=0&size=10`

### Upload Media File
- **POST** `/media/upload` (multipart/form-data)
- **Response**: `ApiResponse<{ mediaUrl, mediaType }>`
