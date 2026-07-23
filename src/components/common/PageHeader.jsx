import { Link } from 'react-router-dom';
import './PageHeader.css';

/**
 * Shared page header for calculator pages.
 * Shows a breadcrumb (Home > Current Page), a title, and an optional subtitle.
 */
function PageHeader({ title, subtitle, accent = 'blue' }) {
  return (
    <div className={`page-header page-header--${accent}`}>
      <div className="container page-header__inner">
        <nav className="page-header__breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="page-header__crumb-link">
            Home
          </Link>
          <span className="page-header__crumb-sep">/</span>
          <span className="page-header__crumb-current">{title}</span>
        </nav>
        <h1 className="page-header__title">{title}</h1>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default PageHeader;