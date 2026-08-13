import { useState, useEffect } from 'react';
import { GetGithubStatsUseCase } from '../../core/application/use-cases/GetGithubStatsUseCase';
import { ApiGithubRepository } from '../../infrastructure/repositories/ApiGithubRepository';
import { GithubStats } from '../../core/domain/repositories/GithubRepository';

const githubRepository = new ApiGithubRepository();
const getGithubStatsUseCase = new GetGithubStatsUseCase(githubRepository);

export const useGithubStats = (username: string, initialStats: GithubStats) => {
  const [stats, setStats] = useState<GithubStats>(initialStats);

  useEffect(() => {
    if (!username) return;
    
    getGithubStatsUseCase.execute(username)
      .then(fetchedStats => {
        setStats(fetchedStats);
      })
      .catch(console.error);
  }, [username]);

  return stats;
};
