export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface AIChatRequest {
  message: string;
  conversationId?: string;
  context?: string;
}

export interface AIChatResponse {
  reply: string;
  conversationId: string;
  tokensUsed?: number;
}

export interface AITutorRequest {
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  courseId?: string;
  format?: 'explanation' | 'example' | 'summary' | 'analogy';
}

export interface PDFChatRequest {
  pdfUrl: string;
  question: string;
  conversationId?: string;
}

export interface GenerateNotesRequest {
  lectureId?: string;
  content: string;
  format?: 'bullet' | 'paragraph' | 'structured';
}

export interface GenerateQuizRequest {
  topic: string;
  count: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'mcq' | 'true_false' | 'fill';
  courseId?: string;
}

export interface IGeneratedQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GenerateFlashcardsRequest {
  topic: string;
  count: number;
}

export interface IFlashcard {
  front: string;
  back: string;
  hint?: string;
}

export interface GenerateMindMapRequest {
  topic: string;
  depth?: number;
}

export interface IMindMapNode {
  id: string;
  label: string;
  children?: IMindMapNode[];
}

export interface CareerRecommendationRequest {
  skills: string[];
  interests: string[];
  experience?: string;
  education?: string;
}

export interface ICareerRecommendation {
  role: string;
  matchScore: number;
  description: string;
  requiredSkills: string[];
  missingSkills: string[];
  averageSalary?: string;
  growthProspect?: string;
  courses?: string[];
}

export interface SkillGapRequest {
  targetRole: string;
  currentSkills: string[];
}

export interface ISkillGapResult {
  targetRole: string;
  matchPercentage: number;
  strongSkills: string[];
  missingSkills: ISkillGapItem[];
  learningPath: ILearningPathItem[];
  estimatedTimeWeeks: number;
}

export interface ISkillGapItem {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  resources?: string[];
}

export interface ILearningPathItem {
  step: number;
  skill: string;
  duration: string;
  resources: string[];
}

export interface StudyPlanRequest {
  goal: string;
  availableHoursPerDay: number;
  targetDate: string;
  currentLevel?: string;
}

export interface IStudyPlan {
  goal: string;
  totalWeeks: number;
  phases: IStudyPhase[];
  dailySchedule: IDailySchedule[];
}

export interface IStudyPhase {
  phase: number;
  title: string;
  weeks: number;
  topics: string[];
  milestones: string[];
}

export interface IDailySchedule {
  day: string;
  tasks: string[];
  estimatedHours: number;
}

export interface ResumeAnalyzeRequest {
  resumeText: string;
  targetRole?: string;
}

export interface IResumeAnalysis {
  atsScore: number;
  overallRating: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: IResumeSuggestion[];
  keywordsFound: string[];
  keywordsMissing: string[];
  formattingScore: number;
  contentScore: number;
}

export interface IResumeSuggestion {
  section: string;
  issue: string;
  recommendation: string;
  priority: 'high' | 'medium' | 'low';
}

export interface MockInterviewRequest {
  role: string;
  company?: string;
  level: 'junior' | 'mid' | 'senior';
  type: 'technical' | 'hr' | 'behavioral' | 'case';
}

export interface IInterviewQuestion {
  id: string;
  question: string;
  type: string;
  hints?: string[];
  followUps?: string[];
}

export interface InterviewAnswerRequest {
  sessionId: string;
  questionId: string;
  answer: string;
}

export interface IInterviewFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  modelAnswer: string;
  communication: number;
  technical: number;
  confidence: number;
}

export interface OCRRequest {
  imageUrl: string;
  language?: string;
}

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface LectureSummaryRequest {
  lectureId?: string;
  transcript: string;
  format?: 'brief' | 'detailed' | 'bullets';
}
