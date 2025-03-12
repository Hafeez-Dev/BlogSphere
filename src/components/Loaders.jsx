// Skeleton Loader for Post Grid
export const PostGridLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-48 w-full" />
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-6 bg-gray-200 rounded w-4/5" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
                <div className="h-3 bg-gray-200 rounded w-4/6" />
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-200 rounded-full" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-200 rounded w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Content Loader for Single Post
export const ContentLoader = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-5 animate-pulse">
      <div className="mb-8">
        <div className="bg-gray-200 h-96 w-full rounded-xl" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Circular Spinner
export const Spinner = ({ size = 8 }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-4 border-solid border-current border-r-transparent h-${size} w-${size}`}
        style={{ borderWidth: "3px" }}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

// Full Page Loader
export const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-solid border-blue-600 border-r-transparent mx-auto" />
        <p className="mt-4 text-gray-600 font-medium">Loading Content...</p>
      </div>
    </div>
  );
};

// Button Loading State
export const ButtonLoader = () => {
  return (
    <div className="inline-flex items-center justify-center">
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span>Processing...</span>
    </div>
  );
};
