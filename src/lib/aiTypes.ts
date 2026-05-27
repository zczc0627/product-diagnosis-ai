// ─── Request types ───

export interface AIDiagnoseRequest {
  productTitle: string;
  category: string;
  price: string;
  targetUser: string;
  sellingPoints: string;
  mainImageCopy: string;
  detailDescription: string;
  platform: string;
  competitorInfo: string;
  userGoal: string;
}

// ─── Response types ───

export interface AIScores {
  titleAttraction: number;
  sellingPointClarity: number;
  mainImageClickPower: number;
  purchaseDesire: number;
  differentiation: number;
  trustAndObjectionHandling: number;
}

export interface AIProblem {
  title: string;
  description: string;
  impact: string;
}

export interface AIPaidPreview {
  unlockReason: string;
  includedItems: string[];
}

export interface AIOptimizedTitle {
  title: string;
  reason: string;
}

export interface AICoreSellingPoint {
  point: string;
  customerLanguage: string;
  conversionReason: string;
}

export interface AIMainImageCopy {
  copy: string;
  visualSuggestion: string;
  reason: string;
}

export interface AIDetailSection {
  section: string;
  content: string;
  purpose: string;
}

export interface AIBuyerConcern {
  concern: string;
  answer: string;
}

export interface AIPaidSolution {
  optimizedTitles: AIOptimizedTitle[];
  coreSellingPoints: AICoreSellingPoint[];
  mainImageCopywriting: AIMainImageCopy[];
  detailPageStructure: AIDetailSection[];
  buyerConcerns: AIBuyerConcern[];
  differentiationStrategy: string;
  finalCopyBlock: string;
}

export interface AIDiagnoseResponse {
  overallScore: number;
  conversionLevel: string;
  summary: string;
  scores: AIScores;
  freeProblems: AIProblem[];
  freeSuggestion: string;
  paidPreview: AIPaidPreview;
  paidSolution: AIPaidSolution;
}
