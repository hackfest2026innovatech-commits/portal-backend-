import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import * as teamService from '../../services/team.service';
import { useForm } from 'react-hook-form';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  UserGroupIcon,
  PlusIcon,
  LinkIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';

export default function MyTeam() {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const createForm = useForm({ defaultValues: { name: '', description: '', repoUrl: '' } });
  const joinForm = useForm({ defaultValues: { teamId: '', joinCode: '' } });

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    setLoading(true);
    try {
      const data = await teamService.getMyTeam();
      setTeam(data.data?.team || data.team || data.data || null);
    } catch {
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(data) {
    try {
      const result = await teamService.createTeam(data);
      setTeam(result.data?.team || result.team || result.data);
      setShowCreate(false);
      toast.success('Team created!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create team');
    }
  }

  async function handleJoin(data) {
    try {
      const result = await teamService.joinTeam(data.teamId, data.joinCode);
      setTeam(result.data?.team || result.team || result.data);
      setShowJoin(false);
      toast.success('Joined team!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join team');
    }
  }

  function copyJoinCode() {
    const code = team?.inviteCode || team?.joinCode;
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success('Join code copied!');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Team</h1>
        </div>

        {!team ? (
          /* No team - show create/join options */
          <div className="space-y-6 animate-fade-in">
            <div className="card p-10 text-center">
              <UserGroupIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Team Yet</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Create a new team or join an existing one</p>
              <div className="flex items-center justify-center gap-3">
                <button onClick={() => { setShowCreate(true); setShowJoin(false); }} className="btn-primary gap-2">
                  <PlusIcon className="w-5 h-5" />
                  Create Team
                </button>
                <button onClick={() => { setShowJoin(true); setShowCreate(false); }} className="btn-secondary gap-2">
                  <LinkIcon className="w-5 h-5" />
                  Join Team
                </button>
              </div>
            </div>

            {showCreate && (
              <div className="card p-6 animate-slide-up">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Create a Team</h3>
                <form onSubmit={createForm.handleSubmit(handleCreate)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team Name</label>
                    <input className="input-field" placeholder="Awesome Hackers" {...createForm.register('name', { required: true })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea className="input-field resize-none" rows={3} placeholder="What are you building?" {...createForm.register('description')} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub Repo URL</label>
                    <input className="input-field" placeholder="https://github.com/..." {...createForm.register('repoUrl')} />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary">Create</button>
                    <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {showJoin && (
              <div className="card p-6 animate-slide-up">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Join a Team</h3>
                <form onSubmit={joinForm.handleSubmit(handleJoin)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team ID</label>
                    <input className="input-field" placeholder="Enter team ID" {...joinForm.register('teamId', { required: true })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Join Code</label>
                    <input className="input-field" placeholder="Enter join code" {...joinForm.register('joinCode', { required: true })} />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="btn-primary">Join</button>
                    <button type="button" onClick={() => setShowJoin(false)} className="btn-secondary">Cancel</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* Has team - show team details */
          <div className="space-y-6 animate-fade-in">
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{team.teamName || team.name}</h2>
                  {team.description && (
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{team.description}</p>
                  )}
                </div>
                <span className="badge-primary">{team.members?.length || 0} members</span>
              </div>

              {(team.inviteCode || team.joinCode) && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 mb-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Join Code:</span>
                  <code className="font-mono font-bold text-primary-600 dark:text-primary-400">{team.inviteCode || team.joinCode}</code>
                  <button onClick={copyJoinCode} className="ml-auto p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ClipboardIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
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
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Team Members</h3>
              <div className="space-y-3">
                {team.members?.map((member, idx) => {
                  // members can be { userId: { _id, name, email }, role } or flat user objects
                  const userObj = member.userId || member;
                  const m = typeof userObj === 'object' ? userObj : { _id: userObj, name: 'Member' };
                  const memberRole = member.role;
                  return (
                    <div key={m._id || idx} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{m.name?.charAt(0)?.toUpperCase() || '?'}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{m.name}</p>
                        {m.email && <p className="text-xs text-gray-500 dark:text-gray-400">{m.email}</p>}
                      </div>
                      {memberRole === 'leader' && (
                        <span className="badge-warning text-xs">Leader</span>
                      )}
                      {m._id === user?._id && (
                        <span className="badge-primary text-xs">You</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
