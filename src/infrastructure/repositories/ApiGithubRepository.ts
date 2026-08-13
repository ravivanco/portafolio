import { GithubRepository, GithubStats } from '../../core/domain/repositories/GithubRepository';

export class ApiGithubRepository implements GithubRepository {
  async getStats(username: string): Promise<GithubStats> {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    
    return {
      projects: data.public_repos || 0,
      followers: data.followers || 0
    };
  }
}
