export interface Company {
  id: string;
  name: string;
  slug: string;
  problemCount: number;
  easy?: number;
  med?: number;
  hard?: number;
  color: string;
  init: string;
}

export interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard" | string; 
  frequency: number;
  url: string;
  topics?: string[]; // Added this so your Company.tsx file can map the real tags
}