import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as teamService from '../../services/team.service';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  async function fetchTeams() {
    setLoading(true);
    try {
      const res = await teamService.getAllTeams({ limit: 100 });
      const list = res.data?.data || res.data?.teams || res.data || [];
      setTeams(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      toast.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(teamId, teamName) {
    if (!window.confirm(`Are you sure you want to delete team "${teamName}"? This cannot be undone.`)) return;
    try {
      await teamService.deleteTeam(teamId);
      setTeams((prev) => prev.filter((t) => t._id !== teamId));
      toast.success('Team deleted');
    } catch (error) {
      toast.error('Failed to delete team');
    }
  }

  const filtered = teams.filter((t) =>
    (t.teamName || t.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Teams</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{filtered.length} teams</p>
          </div>
        </div>

        {/* Search */}
        <div className="card p-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search teams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Teams Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <UserGroupIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No teams found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((team) => (
              <div key={team._id} className="card-hover p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{team.teamName || team.name}</h3>
                  <span className="badge-primary text-xs ml-2 flex-shrink-0">
                    {team.members?.length || 0} members
                  </span>
                </div>
                {team.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {team.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                  Created {formatDate(team.createdAt)}
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/teams/${team._id}`}
                    className="flex-1 btn-secondary text-sm py-1.5 gap-1.5"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(team._id, team.teamName || team.name)}
                    className="btn-danger text-sm py-1.5 px-3"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
