"use client";
import React, { Component, ErrorInfo } from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="p-8 shadow-md max-w-md w-full bg-card/30">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="mt-4 text-2xl font-semibold text-foreground">
                Oops! Something went wrong
              </h2>
              <p className="mt-2 text-muted-foreground">
                We apologize for the inconvenience. Please try again later.
              </p>
              {this.state.error && (
                <div className="mt-4 p-4 bg-muted/40">
                  <p className="text-sm text-card-foreground/90 font-mono break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 text-sm font-medium text-foreground border hover:bg-muted/40"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;