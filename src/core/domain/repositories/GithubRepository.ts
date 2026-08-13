export interface GithubStats {
  projects: number;
  followers: number;
}

export interface GithubRepository {
  getStats(username: string): Promise<GithubStats>;
}
