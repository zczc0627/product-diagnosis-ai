export interface DiagnosticScore {
  overall: number;
  titleAttractiveness: number;
  clarityOfSellingPoints: number;
  mainImageClickability: number;
  purchaseDesire: number;
  differentiation: number;
}

export interface DiagnosticIssue {
  id: string;
  category: "title" | "selling_point" | "main_image" | "detail_page" | "differentiation";
  severity: "critical" | "warning" | "suggestion";
  title: string;
  description: string;
}

export interface OptimizationTitle {
  version: number;
  title: string;
  expectedCTR: string;
  reasoning: string;
}

export interface OptimizationSellingPoint {
  title: string;
  description: string;
  angle: string;
}

export interface OptimizationMainImage {
  version: number;
  concept: string;
  description: string;
  expectedImpact: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FullOptimizationResult {
  optimizedTitles: OptimizationTitle[];
  sellingPoints: OptimizationSellingPoint[];
  mainImageConcepts: OptimizationMainImage[];
  detailPageStructure: string[];
  userFAQs: FAQItem[];
  differentiationPoints: string[];
}

export interface DiagnosticResult {
  id: string;
  productName: string;
  category: string;
  platform: string;
  originalTitle: string;
  score: DiagnosticScore;
  issues: DiagnosticIssue[];
  freeOptimizations: OptimizationTitle[];
  fullResult: FullOptimizationResult;
  createdAt: string;
}

export interface ProductInput {
  productName: string;
  category: string;
  platform: string;
  price: string;
  targetUser: string;
  currentTitle: string;
  currentSellingPoints: string;
  mainImageDescription: string;
  productDescription: string;
  competitorTitle?: string;
  competitorSellingPoints?: string;
  userGoal: string;
}

// Re-export AI types for convenience
export type {
  AIDiagnoseRequest,
  AIDiagnoseResponse,
  AIScores,
  AIProblem,
  AIPaidPreview,
  AIOptimizedTitle,
  AICoreSellingPoint,
  AIMainImageCopy,
  AIDetailSection,
  AIBuyerConcern,
  AIPaidSolution,
} from "./aiTypes";

export interface HistoryItem {
  id: string;
  productName: string;
  platform: string;
  score: number;
  date: string;
  isCompleted: boolean;
}
