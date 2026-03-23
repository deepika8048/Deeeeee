import * as React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Something went wrong.';
      try {
        const parsed = JSON.parse(this.state.error?.message || '');
        if (parsed.error) {
          errorMessage = parsed.error;
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-black/5 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-red-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Application Error</h1>
            <p className="text-zinc-500 mb-8">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
            >
              <RefreshCcw size={20} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
