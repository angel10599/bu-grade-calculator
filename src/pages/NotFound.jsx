import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { usePageTitle } from '../utils/usePageTitle';
import './NotFound.css';

function CompassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9.5" />
      <path d="m14.8 9.2-2 5.6-5.6 2 2-5.6 5.6-2Z" />
    </svg>
  );
}

function NotFound() {
  usePageTitle('Page Not Found');

  return (
    <div className="page not-found">
      <div className="container not-found__inner">
        <div className="not-found__icon">
          <CompassIcon />
        </div>
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__text">
          The page you're looking for doesn't exist or may have been moved. Let's get you back
          on track.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;