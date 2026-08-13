import { GithubRepository, GithubStats } from '../../domain/repositories/GithubRepository';

export class GetGithubStatsUseCase {
  constructor(private githubRepository: GithubRepository) {}

  async execute(username: string): Promise<GithubStats> {
    return this.githubRepository.getStats(username);
  }
}
