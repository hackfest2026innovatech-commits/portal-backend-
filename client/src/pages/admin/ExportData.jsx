import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as exportService from '../../services/export.service';
import { downloadFromResponse } from '../../utils/downloadFile';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  TrophyIcon,
  DocumentTextIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';

function ExportCard({ icon: Icon, title, description, onExport, loading, color }) {
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
  };

  return (
    <div className="card p-6">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onExport('csv')}
              disabled={loading}
              className="btn-secondary text-sm py-1.5 gap-1.5"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              {loading ? 'Exporting...' : 'Export CSV'}
            </button>
            <button
              onClick={() => onExport('json')}
              disabled={loading}
              className="btn-ghost text-sm py-1.5 gap-1.5"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExportData() {
  const [loadingState, setLoadingState] = useState({});

  async function handleExport(type, format) {
    const key = `${type}_${format}`;
    setLoadingState((prev) => ({ ...prev, [key]: true }));
    try {
      let response;
      const filename = `hackathon_${type}_${new Date().toISOString().split('T')[0]}`;

      switch (type) {
        case 'teams':
          response = await exportService.exportTeams(format);
          break;
        case 'scores':
          response = await exportService.exportScores(format);
          break;
        case 'submissions':
          response = await exportService.exportSubmissions(undefined, format);
          break;
        case 'report':
          response = await exportService.exportFullReport();
          break;
        default:
          return;
      }

      downloadFromResponse(response, `${filename}.${format}`);
      toast.success(`${type} exported successfully`);
    } catch (error) {
      toast.error(`Failed to export ${type}`);
    } finally {
      setLoadingState((prev) => ({ ...prev, [key]: false }));
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Export Data</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Download hackathon data in various formats</p>
          </div>
        </div>

        <div className="space-y-4 animate-fade-in">
          <ExportCard
            icon={UserGroupIcon}
            title="Teams Data"
            description="Export all teams with member details, join codes, and repository links."
            color="blue"
            loading={loadingState.teams_csv || loadingState.teams_json}
            onExport={(format) => handleExport('teams', format)}
          />

          <ExportCard
            icon={TrophyIcon}
            title="Evaluation Scores"
            description="Export all evaluation scores, criteria breakdowns, and judge comments."
            color="amber"
            loading={loadingState.scores_csv || loadingState.scores_json}
            onExport={(format) => handleExport('scores', format)}
          />

          <ExportCard
            icon={DocumentTextIcon}
            title="Form Submissions"
            description="Export all form responses and submission data."
            color="green"
            loading={loadingState.submissions_csv || loadingState.submissions_json}
            onExport={(format) => handleExport('submissions', format)}
          />

          <div className="card p-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-950/30 dark:to-primary-900/20 border-primary-200 dark:border-primary-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
                <DocumentArrowDownIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">Full Report</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Generate a comprehensive hackathon report with all data combined.
                </p>
                <button
                  onClick={() => handleExport('report', 'pdf')}
                  disabled={loadingState.report_pdf}
                  className="mt-4 btn-primary text-sm py-1.5 gap-1.5"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  {loadingState.report_pdf ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
