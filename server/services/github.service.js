const { Octokit } = require('@octokit/rest');
const { GITHUB_TOKEN } = require('../config/env');
const GitHubCommit = require('../models/GitHubCommit');
const Team = require('../models/Team');
const AppError = require('../utils/AppError');

function getOctokit() {
  const options = {};
  // Only use token if it's a real value (not the placeholder)
  if (GITHUB_TOKEN && GITHUB_TOKEN !== 'your-github-token') {
    options.auth = GITHUB_TOKEN;
  }
  return new Octokit(options);
}

function parseRepoUrl(url) {
  if (!url) {
    throw new AppError('Repository URL is required', 400);
  }

  let owner;
  let repo;

  // Handle formats: https://github.com/owner/repo, github.com/owner/repo, owner/repo
  const cleaned = url.replace(/\.git$/, '').replace(/\/$/, '');

  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+)/;
  const match = cleaned.match(githubRegex);

  if (match) {
    owner = match[1];
    repo = match[2];
  } else if (/^[^/]+\/[^/]+$/.test(cleaned)) {
    const parts = cleaned.split('/');
    owner = parts[0];
    repo = parts[1];
  } else {
    throw new AppError(
      'Invalid repository URL. Expected format: https://github.com/owner/repo or owner/repo',
      400
    );
  }

  return { owner, repo };
}

async function fetchCommitsFromGitHub(owner, repo, since = null) {
  const octokit = getOctokit();

  const params = {
    owner,
    repo,
    per_page: 100,
  };

  if (since) {
    params.since = new Date(since).toISOString();
  }

  const allCommits = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await octokit.repos.listCommits({ ...params, page });
    const commits = response.data;

    if (commits.length === 0) {
      hasMore = false;
    } else {
      allCommits.push(...commits);
      page += 1;
      if (commits.length < 100) {
        hasMore = false;
      }
    }
  }

  return allCommits.map((c) => ({
    sha: c.sha,
    message: c.commit.message,
    author: c.commit.author ? c.commit.author.name : 'Unknown',
    timestamp: c.commit.author ? c.commit.author.date : new Date().toISOString(),
    additions: c.stats ? c.stats.additions : 0,
    deletions: c.stats ? c.stats.deletions : 0,
  }));
}

async function syncAndStoreCommits(teamId) {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError('Team not found', 404);
  }

  if (!team.githubRepo) {
    throw new AppError('Team does not have a GitHub repository configured', 400);
  }

  const { owner, repo } = parseRepoUrl(team.githubRepo);
  const repoFullName = `${owner}/${repo}`;

  // Find the latest stored commit for this team to do incremental sync
  const latestCommit = await GitHubCommit.findOne({ teamId })
    .sort({ timestamp: -1 })
    .lean();

  const since = latestCommit ? latestCommit.timestamp : null;
  const commits = await fetchCommitsFromGitHub(owner, repo, since);

  const operations = commits.map((commit) => ({
    updateOne: {
      filter: { sha: commit.sha, repoFullName },
      update: {
        $setOnInsert: {
          teamId,
          sha: commit.sha,
          message: commit.message,
          author: commit.author,
          timestamp: commit.timestamp,
          additions: commit.additions,
          deletions: commit.deletions,
          repoFullName,
        },
      },
      upsert: true,
    },
  }));

  if (operations.length > 0) {
    await GitHubCommit.bulkWrite(operations);
  }

  return {
    synced: operations.length,
    repoFullName,
  };
}

module.exports = {
  parseRepoUrl,
  fetchCommitsFromGitHub,
  syncAndStoreCommits,
};
