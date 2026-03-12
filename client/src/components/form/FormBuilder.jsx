import { useState, useCallback } from 'react';
import clsx from 'clsx';
import {
  PlusIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import * as formService from '../../services/form.service';
import toast from 'react-hot-toast';

const QUESTION_TYPES = [
  { value: 'text', label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'file', label: 'File Upload' },
  { value: 'link', label: 'URL / Link' },
];

/**
 * Generate a unique local ID for questions.
 */
let questionIdCounter = 0;
function generateId() {
  questionIdCounter += 1;
  return `q_${Date.now()}_${questionIdCounter}`;
}

/**
 * Single question editor row.
 */
function QuestionEditor({
  question,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}) {
  const handleFieldChange = (field, value) => {
    onChange(question._localId, { ...question, [field]: value });
  };

  return (
    <div
      className={clsx(
        'group relative flex flex-col gap-3 p-4 rounded-lg',
        'border border-gray-200 dark:border-gray-700',
        'bg-gray-50/50 dark:bg-gray-800/30',
        'hover:border-gray-300 dark:hover:border-gray-600',
        'transition-colors duration-150'
      )}
    >
      {/* Question number badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Question {index + 1}
        </span>
        <div className="flex items-center gap-1">
          {/* Reorder buttons */}
          <button
            type="button"
            onClick={() => onMoveUp(question._localId)}
            disabled={index === 0}
            className={clsx(
              'p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
              'hover:bg-gray-200 dark:hover:bg-gray-700',
              'transition-colors duration-150',
              'disabled:opacity-30 disabled:cursor-not-allowed'
            )}
            aria-label="Move up"
          >
            <ChevronUpIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(question._localId)}
            disabled={index === total - 1}
            className={clsx(
              'p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300',
              'hover:bg-gray-200 dark:hover:bg-gray-700',
              'transition-colors duration-150',
              'disabled:opacity-30 disabled:cursor-not-allowed'
            )}
            aria-label="Move down"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </button>
          {/* Remove */}
          <button
            type="button"
            onClick={() => onRemove(question._localId)}
            className={clsx(
              'p-1 rounded text-gray-400 hover:text-red-500 dark:hover:text-red-400',
              'hover:bg-red-50 dark:hover:bg-red-900/20',
              'transition-colors duration-150'
            )}
            aria-label="Remove question"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Question text */}
      <Input
        placeholder="Enter question text..."
        value={question.text || ''}
        onChange={(e) => handleFieldChange('text', e.target.value)}
      />

      {/* Type + Required row */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Select
            label="Answer Type"
            options={QUESTION_TYPES}
            value={question.type || 'text'}
            onChange={(e) => handleFieldChange('type', e.target.value)}
          />
        </div>

        <label
          className={clsx(
            'inline-flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer',
            'border border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-gray-800/50',
            'hover:bg-gray-50 dark:hover:bg-gray-800',
            'transition-colors duration-150',
            'select-none'
          )}
        >
          <input
            type="checkbox"
            checked={question.required || false}
            onChange={(e) => handleFieldChange('required', e.target.checked)}
            className={clsx(
              'h-4 w-4 rounded border-gray-300 dark:border-gray-600',
              'text-indigo-600 focus:ring-indigo-500 dark:bg-gray-700',
              'transition-colors duration-150'
            )}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Required</span>
        </label>
      </div>
    </div>
  );
}

/**
 * Admin form builder: create forms with title and dynamic questions.
 * Each question has text, type (text/textarea/file/link), and required flag.
 * Questions are reorderable. Save calls the API.
 *
 * @param {object} props
 * @param {object} [props.existingForm] - Existing form to edit (for update mode)
 * @param {Function} [props.onSaved] - Callback after successful save
 * @param {string} [props.className]
 */
export default function FormBuilder({ existingForm, onSaved, className }) {
  const [title, setTitle] = useState(existingForm?.title || '');
  const [description, setDescription] = useState(existingForm?.description || '');
  const [questions, setQuestions] = useState(() => {
    if (existingForm?.fields?.length) {
      return existingForm.fields.map((f, idx) => ({
        ...f,
        _localId: f._id || generateId(),
      }));
    }
    return [
      {
        _localId: generateId(),
        text: '',
        type: 'text',
        required: false,
      },
    ];
  });
  const [saving, setSaving] = useState(false);

  const addQuestion = useCallback(() => {
    setQuestions((prev) => [
      ...prev,
      {
        _localId: generateId(),
        text: '',
        type: 'text',
        required: false,
      },
    ]);
  }, []);

  const removeQuestion = useCallback((localId) => {
    setQuestions((prev) => {
      if (prev.length <= 1) {
        toast.error('Form must have at least one question');
        return prev;
      }
      return prev.filter((q) => q._localId !== localId);
    });
  }, []);

  const updateQuestion = useCallback((localId, updated) => {
    setQuestions((prev) =>
      prev.map((q) => (q._localId === localId ? { ...updated, _localId: localId } : q))
    );
  }, []);

  const moveUp = useCallback((localId) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q._localId === localId);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((localId) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q._localId === localId);
      if (idx === -1 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, []);

  const handleSave = async () => {
    // Validation
    if (!title.trim()) {
      toast.error('Please enter a form title');
      return;
    }

    const emptyQuestions = questions.filter((q) => !q.text.trim());
    if (emptyQuestions.length > 0) {
      toast.error('Please fill in all question texts');
      return;
    }

    const formData = {
      title: title.trim(),
      description: description.trim(),
      fields: questions.map(({ _localId, ...rest }) => ({
        text: rest.text,
        type: rest.type,
        required: rest.required,
      })),
    };

    setSaving(true);
    try {
      if (existingForm?._id) {
        await formService.updateForm(existingForm._id, formData);
        toast.success('Form updated successfully');
      } else {
        await formService.createForm(formData);
        toast.success('Form created successfully');
      }
      onSaved?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={clsx(
        'rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700',
        'shadow-sm overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <DocumentTextIcon className="h-5 w-5 text-indigo-500" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {existingForm ? 'Edit Form' : 'Create New Form'}
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Title & description */}
        <div className="space-y-4">
          <Input
            label="Form Title"
            placeholder="e.g., Project Submission Form"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="Description (optional)"
            placeholder="Brief description of this form's purpose..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700" />

        {/* Questions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Questions ({questions.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              icon={PlusIcon}
              onClick={addQuestion}
            >
              Add Question
            </Button>
          </div>

          <div className="space-y-3">
            {questions.map((question, idx) => (
              <QuestionEditor
                key={question._localId}
                question={question}
                index={idx}
                total={questions.length}
                onChange={updateQuestion}
                onRemove={removeQuestion}
                onMoveUp={moveUp}
                onMoveDown={moveDown}
              />
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="primary"
            loading={saving}
            onClick={handleSave}
          >
            {existingForm ? 'Update Form' : 'Save Form'}
          </Button>
        </div>
      </div>
    </div>
  );
}
