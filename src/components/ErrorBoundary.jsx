import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-card">
            <h2>Oops! Something went wrong.</h2>
            <p>The Memory Lab encountered a rendering error. You can try refreshing or continuing to use other parts of the app.</p>
            <button onClick={() => this.setState({ hasError: false })}>Try Again</button>
            <pre style={{ fontSize: '10px', marginTop: '10px', opacity: 0.7 }}>
              {this.state.error?.message}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
