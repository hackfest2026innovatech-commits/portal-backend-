import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as evaluationService from '../../services/evaluation.service';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function fetchAssignments() {
    setLoading(true);
    try {
      const data = await evaluationService.getAssignments();
      const raw = data.data?.data || data.data?.assignments || data.data || []; setAssignments(Array.isArray(raw) ? raw : []);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Assignments</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Teams assigned for your evaluation</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="card p-12 text-center">
            <ClipboardDocumentListIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No assignments yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              The admin will assign teams to you for evaluation.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const team = assignment.team || assignment;
              const evaluated = assignment.evaluated || assignment.hasEvaluation;

              return (
                <div key={team._id || assignment._id} className="card-hover p-6 animate-slide-up">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {team.name || 'Team'}
                        </h3>
                        {evaluated ? (
                          <span className="badge-success text-xs gap-1">
                            <CheckCircleIcon className="w-3.5 h-3.5" />
                            Evaluated
                          </span>
                        ) : (
                          <span className="badge-warning text-xs">Pending</span>
                        )}
                      </div>
                      {team.description && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {team.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        {team.members?.length || 0} members
                      </p>
                    </div>
                    <Link
                      to={`/evaluate/${team._id}`}
                      className="btn-primary text-sm py-2 px-4 gap-1.5 ml-4 flex-shrink-0"
                    >
                      {evaluated ? 'Update' : 'Evaluate'}
                      <ArrowRightIcon className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
