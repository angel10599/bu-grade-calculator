import Disclaimer from '../common/Disclaimer';
import './Footer.css';

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.5 4.5 5.5v6c0 5 3.2 8.4 7.5 10 4.3-1.6 7.5-5 7.5-10v-6L12 2.5Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="app-footer">
      <div className="container app-footer__inner">
        <div className="app-footer__brand">
          <span className="app-footer__seal">BU</span>
          <span>BU Grade Computation Portal</span>
        </div>
        <p className="app-footer__text">
          <ShieldIcon />
          All calculations are performed locally in your browser. No data is stored or
          transmitted.
        </p>
        <Disclaimer variant="block" />
        <p className="app-footer__copyright mt-2">
          &copy; {new Date().getFullYear()} Bicol University.
        </p>
      </div>
    </footer>
  );
}

export default Footer;