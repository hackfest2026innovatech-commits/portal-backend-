import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Input from '../common/Input';
import Select from '../common/Select';
import Spinner from '../common/Spinner';

export default function RegisterForm({ onSubmit, loading = false, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
  });

  const password = watch('password');

  const onFormSubmit = (data) => {
    const { confirmPassword, ...payload } = data;
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Create an account
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Join the hackathon platform
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <Input
        label="Full name"
        type="text"
        placeholder="John Doe"
        icon={UserIcon}
        error={errors.name?.message}
        required
        {...register('name', {
          required: 'Name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters',
          },
        })}
      />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        icon={EnvelopeIcon}
        error={errors.email?.message}
        required
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
      />

      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a password"
          icon={LockClosedIcon}
          error={errors.password?.message}
          required
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={clsx(
            'absolute right-3 top-[38px] text-gray-400 transition-colors duration-150',
            'hover:text-gray-600 dark:hover:text-gray-300'
          )}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="relative">
        <Input
          label="Confirm password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Confirm your password"
          icon={LockClosedIcon}
          error={errors.confirmPassword?.message}
          required
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === password || 'Passwords do not match',
          })}
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className={clsx(
            'absolute right-3 top-[38px] text-gray-400 transition-colors duration-150',
            'hover:text-gray-600 dark:hover:text-gray-300'
          )}
          tabIndex={-1}
        >
          {showConfirm ? (
            <EyeSlashIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      <Select
        label="Role"
        error={errors.role?.message}
        required
        options={[
          { value: 'student', label: 'Student' },
          { value: 'judge', label: 'Judge' },
        ]}
        placeholder="Select your role"
        {...register('role', {
          required: 'Please select a role',
        })}
      />

      <button
        type="submit"
        disabled={loading}
        className={clsx(
          'relative flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white',
          'bg-gradient-to-r from-indigo-600 to-purple-600',
          'hover:from-indigo-700 hover:to-purple-700',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800',
          'transition-all duration-200 ease-in-out',
          'shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40',
          'active:scale-[0.98]',
          loading && 'opacity-80 cursor-not-allowed'
        )}
      >
        {loading ? (
          <Spinner size="sm" className="text-white/80" />
        ) : (
          'Create account'
        )}
      </button>
    </form>
  );
}
