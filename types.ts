
export type Language = 'ar' | 'en';

export interface Question {
  type: 'mcq' | 'truefalse';
  text: string;
  options?: string[];
  correct_index?: number;
  correct?: boolean;
  explanation: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  level: string; // 'basic' | 'advanced' | 'ToT'
  title: Record<Language, string>;
  category: string;
  duration: string;
  duration_min: number;
  learning_outcomes: string[];
  sections: string[];
  scenario: string;
  questions: Question[];
  reflection: Record<Language, string[]>;
  mini_task: {
    title: string;
    steps: string[];
    evidence: string;
  };
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  agenda: string[];
  decisions: {
    text: string;
    owner: string;
    deadline: string;
    status: 'pending' | 'completed';
  }[];
}

export interface Feedback {
  id: string;
  category: string;
  message: string;
  isAnonymous: boolean;
  date: string;
}

export interface LibraryItem {
  id: string;
  title: Record<Language, string>;
  type: 'manual' | 'guide' | 'template';
  description: Record<Language, string>;
  content?: Record<Language, string[]>;
}
