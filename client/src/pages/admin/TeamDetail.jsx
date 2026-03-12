import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as teamService from '../../services/team.service';
import * as evaluationService from '../../services/evaluation.service';
import { formatDate, formatScore } from '../../utils/formatters';
import { EVALUATION_CRITERIA } from '../../utils/constants';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  UserGroupIcon,
  CodeBracketIcon,
  TrophyIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

export default function TeamDetail() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [teamData, evalData] = await Promise.allSettled([
          teamService.getTeamById(teamId),
          evaluationService.getByTeam(teamId),
        ]);
        if (teamData.status === 'fulfilled') {
          setTeam(teamData.value.data?.team || teamData.value.team || teamData.value.data || teamData.value);
        }
        if (evalData.status === 'fulfilled') {
          const rawEvals = evalData.value.data?.data || evalData.value.data?.evaluations || evalData.value.data || []; setEvaluations(Array.isArray(rawEvals) ? rawEvals : []);
        }
      } catch (error) {
        toast.error('Failed to load team details');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [teamId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Team not found</p>
          <Link to="/teams" className="mt-4 btn-primary inline-block">Back to Teams</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/teams" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{team.teamName || team.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Created {formatDate(team.createdAt)}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Info */}
          <div className="card p-6 animate-fade-in">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5 text-primary-500" />
              Team Info
            </h2>
            {team.description && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">{team.description}</p>
            )}
            {(team.githubRepo || team.repoUrl) && (
              <a
                href={team.githubRepo || team.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline text-sm"
              >
                <LinkIcon className="w-4 h-4" />
                {team.githubRepo || team.repoUrl}
              </a>
            )}
          </div>

          {/* Members */}
          <div className="card p-6 animate-slide-up">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5 text-blue-500" />
              Members ({team.members?.length || 0})
            </h2>
            <div className="space-y-3">
              {team.members?.map((member, idx) => {
                const user = member.userId || member;
                const m = typeof user === 'object' ? user : { _id: user, name: 'Member' };
                return (
                  <div key={m._id || idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{m.name?.charAt(0)?.toUpperCase() || '?'}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{m.name}</p>
                      {m.email && <p className="text-xs text-gray-500 dark:text-gray-400">{m.email}</p>}
                    </div>
                    {member.role === 'leader' && (
                      <span className="ml-auto badge-warning text-xs">Leader</span>
                    )}
                  </div>
                );
              })}
              {(!team.members || team.members.length === 0) && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No members yet</p>
              )}
            </div>
          </div>

          {/* Evaluations */}
          <div className="card p-6 animate-slide-up">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrophyIcon className="w-5 h-5 text-amber-500" />
              Evaluations ({evaluations.length})
            </h2>
            {evaluations.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">No evaluations yet</p>
            ) : (
              <div className="space-y-4">
                {evaluations.map((evaluation) => (
                  <div key={evaluation._id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {evaluation.judge?.name || 'Judge'}
                      </p>
                      <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                        {formatScore(evaluation.totalScore || Object.values(evaluation.scores || {}).reduce((a, b) => a + b, 0))}
                      </span>
                    </div>
                    {evaluation.scores && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {EVALUATION_CRITERIA.map((c) => (
                          <div key={c.id} className="text-xs">
                            <span className="text-gray-500 dark:text-gray-400">{c.label}: </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {evaluation.scores[c.id] ?? 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {evaluation.comments && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                        &ldquo;{evaluation.comments}&rdquo;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
