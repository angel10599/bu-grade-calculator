import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.55 1.55M17.55 17.55l1.55 1.55M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.55-1.55M17.55 6.45l1.55-1.55" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />
    </svg>
  );
}

function Header({ theme, onToggleTheme }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-header">
      <div className="container app-header__inner">
        <Link to="/" className="app-header__brand">
          <span className="app-header__seal" aria-hidden="true">
            <span className="app-header__seal-ring" />
            <span className="app-header__seal-text">BU</span>
          </span>
          <span className="app-header__title-group">
            <span className="app-header__title">BU Grade Computation Portal</span>
            <span className="app-header__subtitle">Bicol University</span>
          </span>
        </Link>

        <nav className="app-header__nav">
          <Link
            to="/"
            className={`app-header__link ${isActive('/') ? 'app-header__link--active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/deans-lister"
            className={`app-header__link ${isActive('/deans-lister') ? 'app-header__link--active' : ''}`}
          >
            <span className="app-header__link-full">President's/Dean's Lister</span>
            <span className="app-header__link-short">Dean's Lister</span>
          </Link>
          <Link
            to="/latin-honors"
            className={`app-header__link ${isActive('/latin-honors') ? 'app-header__link--active' : ''}`}
          >
            Latin Honors
          </Link>
        </nav>

        <button
          type="button"
          className="app-header__theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}

export default Header;