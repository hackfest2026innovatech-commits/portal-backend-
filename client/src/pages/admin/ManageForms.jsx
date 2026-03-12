import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as formService from '../../services/form.service';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import {
  ArrowLeftIcon,
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function ManageForms() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForms();
  }, []);

  async function fetchForms() {
    setLoading(true);
    try {
      const data = await formService.getForms({ limit: 100 });
      const raw = data.data?.data || data.data?.forms || data.data || []; setForms(Array.isArray(raw) ? raw : []);
    } catch (error) {
      toast.error('Failed to load forms');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(formId, title) {
    if (!window.confirm(`Delete form "${title}"?`)) return;
    try {
      await formService.deleteForm(formId);
      setForms((prev) => prev.filter((f) => f._id !== formId));
      toast.success('Form deleted');
    } catch {
      toast.error('Failed to delete form');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/dashboard" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ArrowLeftIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Forms</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{forms.length} forms</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : forms.length === 0 ? (
          <div className="card p-12 text-center">
            <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No forms created yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {forms.map((form) => (
              <div key={form._id} className="card-hover p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{form.title}</h3>
                    {form.description && (
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                      <span>{form.fields?.length || 0} fields</span>
                      <span>Created {formatDate(form.createdAt)}</span>
                      {form.deadline && <span>Deadline: {formatDate(form.deadline)}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      to={`/forms/${form._id}`}
                      className="btn-secondary text-sm py-1.5 gap-1.5"
                    >
                      <EyeIcon className="w-4 h-4" />
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(form._id, form.title)}
                      className="btn-danger text-sm py-1.5 px-3"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
