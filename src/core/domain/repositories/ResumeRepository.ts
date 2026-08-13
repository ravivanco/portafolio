import { Language } from '../entities/types';

export interface ResumeRepository {
  getResumeData(language: Language): any;
}
