import { useLanguage } from '../context/LanguageContext';
import { GetResumeDataUseCase } from '../../core/application/use-cases/GetResumeDataUseCase';
import { LocalResumeRepository } from '../../infrastructure/repositories/LocalResumeRepository';

const resumeRepository = new LocalResumeRepository();
const getResumeDataUseCase = new GetResumeDataUseCase(resumeRepository);

export const useResumeData = () => {
  const { language } = useLanguage();
  return getResumeDataUseCase.execute(language);
};
