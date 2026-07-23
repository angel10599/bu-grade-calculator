import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { usePageTitle } from '../utils/usePageTitle';
import './Home.css';

const OPTIONS = [
  {
    key: 'deans-lister',
    path: '/deans-lister',
    title: "President's / Dean's Lister Calculator",
    description:
      "Compute your semester GWA and instantly check if you qualify for President's Lister, Dean's Lister, or Not Qualified status.",
    badge: 'Per Semester',
    accent: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2 3 6.5 12 11l9-4.5L12 2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M3 6.5v6c0 .5.3 1 .8 1.3L12 18l8.2-4.2c.5-.3.8-.8.8-1.3v-6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path d="M12 11v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'latin-honors',
    path: '/latin-honors',
    title: 'Latin Honors Calculator',
    description:
      'Enter your grades across all 4 years and 8 semesters to compute your overall GWA and check your Latin Honors eligibility.',
    badge: 'Full Course',
    accent: 'orange',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.6 5.8 21 7 14 2 9.3 9 8.5 12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const INFO_ITEMS = [
  {
    key: 'private',
    title: 'Private by Design',
    description: 'No login, no accounts, no data ever leaves your browser.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4.5" y="10.5" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="12" cy="15" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: 'instant',
    title: 'Instant Results',
    description: 'GWA and eligibility are computed automatically as you type.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.5 2.5 4 14h6.5L11 21.5 20 10h-6.5L12.5 2.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: 'formula',
    title: 'Official Formula',
    description: 'Uses the standard unit-weighted GWA formula per university policy.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="3.5" width="16" height="17" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 8h8M8 12h3M8 16h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="15.5" cy="16" r="1.1" fill="currentColor" />
      </svg>
    ),
  },
];

function Home() {
  const navigate = useNavigate();
  usePageTitle('Home');

  return (
    <div className="home">
      <section className="home-hero">
        <div className="container home-hero__inner">
          <span className="home-hero__eyebrow shadow-sm">Bicol University</span>
          <h1 className="home-hero__title">Know exactly where you stand — instantly.</h1>
          <p className="home-hero__subtitle">
            Compute your General Weighted Average and check your academic standing, right in
            your browser. No sign-up, no data storage — just enter your name and grades to
            get started.
          </p>
        </div>
      </section>

      <section className="container home-options">
        <div className="home-options__header">
          <h2 className="home-options__heading">Choose a Calculator</h2>
          <p className="home-options__lead">Select the tool that matches what you need to compute.</p>
        </div>
        <div className="home-options__grid">
          {OPTIONS.map((opt) => (
            <Card
              key={opt.key}
              as="div"
              className={`option-card option-card--${opt.accent}`}
              onClick={() => navigate(opt.path)}
            >
              <div className="option-card__top">
                <div className="option-card__icon">{opt.icon}</div>
                <span className="option-card__badge shadow-sm">{opt.badge}</span>
              </div>
              <h3 className="option-card__title">{opt.title}</h3>
              <p className="option-card__description">{opt.description}</p>
              <div className="option-card__cta">
                <Button variant="primary" size="sm">
                  Get Started
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="container home-info">
        <div className="home-info__grid">
          {INFO_ITEMS.map((item) => (
            <div className="home-info__item" key={item.key}>
              <span className="home-info__icon">{item.icon}</span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;