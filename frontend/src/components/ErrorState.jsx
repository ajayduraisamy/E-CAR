import { AlertTriangle } from 'lucide-react';

// A simple error state component that can be reused across the application.
function ErrorState({ message = 'Something went wrong. Please try again.' }) {
  return (
    <div className="glass-panel mx-auto max-w-2xl border-red-300/50 p-6 text-center dark:border-red-800/50">
      <div className="mx-auto mb-3 w-fit rounded-2xl bg-red-100 p-3 dark:bg-red-950/60">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>
      <p className="font-medium text-red-700 dark:text-red-300">{message}</p>
    </div>
  );
}

// This component can be used in any part of the application where an error state needs to be displayed.
export default ErrorState;

