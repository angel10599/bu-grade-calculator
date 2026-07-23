import { useLocation, useNavigate, Navigate, Link } from 'react-router-dom';
import ResultCard from '../components/calculator/ResultCard';
import LatinHonorResultCard from '../components/calculator/LatinHonorResultCard';
import Button from '../components/common/Button';
import { usePageTitle } from '../utils/usePageTitle';
import './ResultsPage.css';

// Per-calculator copy/navigation metadata. Keeping this in one small map
// lets a single ResultsPage component serve both calculators instead of
// duplicating the page markup.
const RESULT_META = {
  'deans-lister': {
    pageTitle: "President's / Dean's Lister Result",
    eyebrow: "President's / Dean's Lister Calculator",
    subtitle: 'Here is your computed GWA and academic standing for the semester.',
    calculatorPath: '/deans-lister',
  },
  'latin-honors': {
    pageTitle: 'Latin Honors Result',
    eyebrow: 'Latin Honors Calculator',
    subtitle: 'Here is your overall GWA and Latin Honors eligibility.',
    calculatorPath: '/latin-honors',
  },
};

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const meta = data ? RESULT_META[data.resultType] : null;

  usePageTitle(meta ? meta.pageTitle : 'Result');

  // Guard against direct/refresh navigation to this route, which arrives
  // with no router state to render. Send the user somewhere useful instead
  // of showing a blank or broken page.
  if (!data || !meta) {
    return <Navigate to="/" replace />;
  }

  const { fullName, gwa, standing, honor } = data;

  return (
    <div className="page results-page">
      <div className="results-page__glow" aria-hidden="true" />
      <div className="container results-page__inner">
        <div className="results-page__header animate-fade-up">
          <span className="results-page__eyebrow">{meta.eyebrow}</span>
          <h1 className="results-page__title">Your Result</h1>
          <p className="results-page__subtitle">{meta.subtitle}</p>
        </div>

        <div className="results-page__card-wrap animate-fade-up" style={{ animationDelay: '0.08s' }}>
          {data.resultType === 'deans-lister' ? (
            <ResultCard fullName={fullName} gwa={gwa} standing={standing} />
          ) : (
            <LatinHonorResultCard fullName={fullName} gwa={gwa} honor={honor} />
          )}
        </div>

        <div className="results-page__actions animate-fade-up" style={{ animationDelay: '0.16s' }}>
          <Button variant="outline" onClick={() => navigate(meta.calculatorPath)}>
            ← Calculate Again
          </Button>
          <Link to="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;