import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as githubService from '../../services/github.service';
import * as teamService from '../../services/team.service';
import { formatDateTime, timeAgo } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  CodeBracketIcon,
  ArrowPathIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

export default function MyCommits() {
  const [team, setTeam] = useState(null);
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const teamData = await teamService.getMyTeam();
      const myTeam = teamData.data?.team || teamData.team || teamData.data;
      setTeam(myTeam);

      if (myTeam?._id) {
        const commitData = await githubService.getCommits(myTeam._id, { limit: 50 });
        const rawCommits = commitData.data?.data || commitData.data?.commits || commitData.data || []; setCommits(Array.isArray(rawCommits) ? rawCommits : []);
      }
    } catch (error) {
      console.log('Failed to fetch data:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync() {
    if (!team?._id) return;
    setSyncing(true);
    try {
      await githubService.syncCommits(team._id);
      toast.success('Commits synced!');
      // Refetch commits
      const commitData = await githubService.getCommits(team._id, { limit: 50 });
      const rawCommits = commitData.data?.data || commitData.data?.commits || commitData.data || []; setCommits(Array.isArray(rawCommits) ? rawCommits : []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sync commits');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Commits</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {team ? `Tracking: ${team.teamName || team.name}` : 'GitHub activity tracking'}
            </p>
          </div>
          {team && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className="btn-secondary gap-1.5"
            >
              <ArrowPathIcon className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card p-4 animate-pulse flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-800 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : !team ? (
          <div className="card p-12 text-center">
            <CodeBracketIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Join a team to start tracking commits</p>
            <Link to="/my-team" className="mt-4 btn-primary inline-block">Go to My Team</Link>
          </div>
        ) : commits.length === 0 ? (
          <div className="card p-12 text-center">
            <CodeBracketIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No commits found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Make sure your team has a GitHub repository linked, then click Sync.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {commits.map((commit, idx) => (
              <div key={commit._id || commit.sha || idx} className="card p-4 animate-slide-up" style={{ animationDelay: `${idx * 30}ms` }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CodeBracketIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {commit.message}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span>{commit.author || commit.authorName || 'Unknown'}</span>
                      <span>{timeAgo(commit.timestamp || commit.date || commit.createdAt)}</span>
                      {commit.sha && (
                        <code className="font-mono text-gray-400 dark:text-gray-500">
                          {commit.sha.slice(0, 7)}
                        </code>
                      )}
                    </div>
                  </div>
                  {commit.url && (
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                    >
                      <LinkIcon className="w-4 h-4 text-gray-400" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
