import { ResumeRepository } from '../../domain/repositories/ResumeRepository';
import { Language } from '../../domain/entities/types';

export class GetResumeDataUseCase {
  constructor(private resumeRepository: ResumeRepository) {}

  execute(language: Language) {
    return this.resumeRepository.getResumeData(language);
  }
}
