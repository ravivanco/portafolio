import type { ReactNode } from 'react';
export type NavSection = 'mission' | 'path' | 'core_tech' | 'projects' | 'connect';

export type Language = 'en' | 'es';

export type ThemeMode = 'dark' | 'light';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'mobile' | 'fullstack' | 'ai';
  date: string;
  description: string;
  bullets: string[];
  techStack: string[];
  imageUrl: string;
  githubUrl?: string;
  demoUrl?: string;
  hasAiDemo?: boolean;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  type: string;
  bullets: string[];
  techUsed: string[];
}

export interface TechCategory {
  title: string;
  skills: { name: string; level?: number; badge?: string }[];
}

export interface Certification {
  title: string;
  issuer: string;
  year?: string;
  iconName: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  category: 'Mobile' | 'AI & ML' | 'Backend' | 'Cybersecurity';
  date: string;
  readTime: string;
  content: string;
  tags: string[];
}

export interface JobProposalForm {
  senderName: string;
  senderEmail: string;
  companyName: string;
  proposalType: 'Full-time' | 'Freelance / Contract' | 'Mobile App Development' | 'AI Consulting' | 'Other';
  budgetRange: string;
  techRequired: string[];
  message: string;
}

export interface TerminalCommand {
  command: string;
  output: string | ReactNode;
  timestamp: string;
}
