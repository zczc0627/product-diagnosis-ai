import type { ProductInput } from "./types";

const STORAGE_KEY = "diagnosis_form_data";

export function saveFormData(data: ProductInput): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadFormData(): ProductInput | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProductInput;
  } catch {
    return null;
  }
}

export function clearFormData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export interface FeedbackEntry {
  id: string;
  productName: string;
  category: string;
  platform: string;
  score: number;
  helpfulness: string;
  pricingAcceptance: string;
  contact: string;
  createdAt: string;
  unlocked: boolean;
  hasCompetitorInfo: boolean;
}

const FEEDBACKS_KEY = "product_diagnosis_feedbacks";

export function saveFeedback(data: FeedbackEntry): void {
  if (typeof window === "undefined") return;
  const existing = loadFeedbacks();
  existing.push(data);
  localStorage.setItem(FEEDBACKS_KEY, JSON.stringify(existing));
}

export function loadFeedbacks(): FeedbackEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FEEDBACKS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveHistoryItem(item: {
  id: string;
  productName: string;
  platform: string;
  score: number;
  date: string;
  isCompleted: boolean;
}): void {
  if (typeof window === "undefined") return;
  const existing = JSON.parse(localStorage.getItem("diagnosis_history") || "[]");
  existing.unshift(item);
  localStorage.setItem("diagnosis_history", JSON.stringify(existing.slice(0, 20)));
}

export function loadHistory(): Array<{
  id: string;
  productName: string;
  platform: string;
  score: number;
  date: string;
  isCompleted: boolean;
}> {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("diagnosis_history") || "[]");
  } catch {
    return [];
  }
}
