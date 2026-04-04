/**
 * MONOLITH (Before): All types and DTOs scattered across modules
 * MICROSERVICES (After): Centralized API contracts shared across all services
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */

// Common response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  timestamp: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
  correlationId?: string;
  path?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth contracts
export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  expiresIn: number;
}

export interface UserResponse {
  id: string;
  email: string;
  createdAt: Date | string;
}

// Notes contracts
export interface CreateNoteRequest {
  title: string;
  content: string;
  topic?: string;
}

export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  topic?: string;
}

export interface NoteResponse {
  id: string;
  userId: string;
  title: string;
  content: string;
  topic: string | null;
  aiExplanation: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  hasQuiz?: boolean;
}

export interface GroupedNotesResponse {
  topic: string;
  notes: NoteResponse[];
}

// Quiz contracts
export interface GenerateQuizRequest {
  noteId: string;
}

export interface QuizQuestion {
  id?: string;
  question: string;
  type?: string;
  options?: string[];
  expectedKeyPoints?: string[];
  expected_key_points?: string[];
}

export interface GenerateQuizResponse {
  quizId: string;
  questions: QuizQuestion[];
}

export interface QuizResponse {
  id: string;
  noteId: string;
  questions: { questions: QuizQuestion[] };
  createdAt: Date | string;
  attempts: QuizAttemptResponse[];
}

export interface SubmitQuizRequest {
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
}

export interface QuizAttemptResponse {
  id: string;
  quizId: string;
  answers: QuizAnswer[];
  score: number;
  feedback: unknown;
  createdAt: Date | string;
}

// AI contracts
export interface GenerateQuizAIRequest {
  noteContent: string;
  aiExplanation: string;
}

export interface EvaluateAnswerRequest {
  question: QuizQuestion;
  userAnswer: string;
}

export interface EvaluateAnswerResponse {
  score: number;
  feedback: string;
  correctPoints: string[];
  missingPoints: string[];
}
