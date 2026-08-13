import { ResumeRepository } from '../../core/domain/repositories/ResumeRepository';
import { Language } from '../../core/domain/entities/types';
import { getResumeData } from '../data/resumeData';

export class LocalResumeRepository implements ResumeRepository {
  getResumeData(language: Language): any {
    return getResumeData(language);
  }
}
