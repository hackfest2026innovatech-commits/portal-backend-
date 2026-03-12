/**
 * Full-screen loading indicator shown during initial app load.
 */
export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        {/* Logo / Brand */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-glow">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            </svg>
          </div>
        </div>

        {/* Spinner */}
        <div className="w-8 h-8 border-3 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin" />

        {/* Text */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Hackathon Portal
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Loading your workspace...
          </p>
        </div>
      </div>
    </div>
  );
}
