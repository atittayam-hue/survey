export interface Question {
  id: number;
  title: string;
  category: string;
  description: string;
}

export interface SurveyResponse {
  id: string;
  timestamp: string; // ISO String
  ratings: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    q5: number;
  };
  overallAvg: number;
  feedback?: string;
  device?: string;
}

export interface LikertLevel {
  min: number;
  max: number;
  label: string;
  labelEn: string;
  color: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
}

export type ActiveTab = 'survey' | 'dashboard' | 'guide';
