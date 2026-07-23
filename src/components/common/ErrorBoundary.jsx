import { Component } from 'react';
import Button from './Button';
import './ErrorBoundary.css';

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5 22 20H2L12 2.5Z" />
      <path d="M12 9.5v4.5" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Catches rendering errors anywhere in the component tree below it and shows
 * a friendly fallback instead of a blank white screen.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log for debugging; no external reporting since this app has no backend.
    console.error('Unexpected application error:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__icon">
            <AlertIcon />
          </div>
          <h2>Something went wrong</h2>
          <p>
            An unexpected error occurred while displaying this page. Your entered data was not
            saved anywhere, so it's safe to start over.
          </p>
          <Button variant="primary" onClick={this.handleReload}>
            Reload App
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;