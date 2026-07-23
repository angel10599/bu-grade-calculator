import { useEffect, useState, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// Lazy-load the calculator pages so the initial bundle (Home page) stays small.
// Each calculator's code only downloads when the user actually navigates to it.
const DeansListerCalculator = lazy(() => import('./pages/DeansListerCalculator'));
const LatinHonorsCalculator = lazy(() => import('./pages/LatinHonorsCalculator'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));

function PageLoadingFallback() {
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <span className="page-loading__spinner" aria-hidden="true" />
      <span>Loading…</span>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content" style={{ flex: 1 }}>
        <ErrorBoundary>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/deans-lister" element={<DeansListerCalculator />} />
              <Route path="/deans-lister/results" element={<ResultsPage />} />
              <Route path="/latin-honors" element={<LatinHonorsCalculator />} />
              <Route path="/latin-honors/results" element={<ResultsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}

export default App;