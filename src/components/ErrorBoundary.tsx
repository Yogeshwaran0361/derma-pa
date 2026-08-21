import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error Boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">DermaVision AI Notice</h1>
          <p className="text-xs text-slate-400 max-w-md font-medium">
            Unable to load this notification right now. Please refresh and try again.
          </p>
          {this.state.error && (
            <div className="w-full max-w-lg p-4 bg-rose-950/80 border border-rose-500/40 rounded-2xl text-left overflow-auto max-h-48 text-rose-300 font-mono text-[11px]">
              <strong className="text-rose-200 block mb-1">Diagnostic Log:</strong>
              <p className="font-bold">{this.state.error.name}: {this.state.error.message}</p>
              <pre className="mt-2 text-[10px] text-rose-400 whitespace-pre-wrap">{this.state.error.stack}</pre>
            </div>
          )}
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Home Page</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
