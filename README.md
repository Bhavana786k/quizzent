# Quizzent - Configurable Quiz & Assessment Platform

**Quizzent** is a full-stack interactive online quiz builder and assessment platform designed for education, training, entertainment, and competitive assessments.

Built with **ReactJS (Vite)** on the frontend, **Spring Boot** on the backend, and **MySQL** database.

---

## Key Features

1. **User System**: JWT authentication & BCrypt password hashing. All users can both create and attempt quizzes.
2. **Dual Quiz Modes**:
   - **Practice Mode**: Self-paced revision with retries and immediate feedback.
   - **Competition Mode**: Timed assessments, schedule windows, live leaderboards, and top 3 podium highlights.
3. **5 Question Types**:
   - MCQ (Single Choice, Max 6 options)
   - True / False (2 choices)
   - Multiple Select Question (MSQ - Multi Choice, Selection count capped at correct options count, Partial scoring)
   - Matching Pairs (Partial scoring per pair)
   - Very Short Answer (1-2 words, Case-insensitive normalized matching)
4. **Access Control**: Public & Private quizzes (Link Only or Link + Passcode).
5. **Security**: Option `isCorrect` flags and short answer keys are strictly stripped from attempt payloads to prevent network inspection.
6. **Search & Debouncing**: Public search with category, tags, and 300ms input debouncing.
7. **In-App Manual**: Integrated `/help` page explaining all platform rules and scoring formulas.

---

## How to Run the Application

### Prerequisites
- Java 21 LTS installed
- Node.js 18+ & NPM installed
- MySQL Server 8.0 running on `localhost:3306`

### 1. Run Spring Boot Backend
```bash
cd backend
./mvnw spring-boot:run
```
Backend will start on `http://localhost:8080`.

### 2. Run React Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on `http://localhost:5173`.

---

## Project Documentation
- [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- [DATABASE_DESIGN.md](./DATABASE_DESIGN.md)
