import { useState, useEffect, useRef } from 'react';
import { ACADEMIC_STANDING } from '../../utils/gradeUtils';
import { getRandomQuote, getStandingTier } from '../../utils/motivationalQuotes';
import Disclaimer from '../common/Disclaimer';
import './ResultCard.css';

// --- SVG ICONS ---
function TrophyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9C6 11.7614 8.23858 14 11 14H13C15.7614 14 18 11.7614 18 9V3H6V9Z" />
      <path d="M6 5H3V7C3 8.65685 4.34315 10 6 10" />
      <path d="M18 5H21V7C21 8.65685 19.6569 10 18 10" />
      <path d="M12 14V18" />
      <path d="M8 21H16" />
      <path d="M10 18H14" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" />
      <circle cx="12" cy="8" r="6" />
      <circle cx="12" cy="8" r="3" />
    </svg>
  );
}

function StarBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

// --- STANDING CONFIGURATIONS ---
const STANDING_CONFIG = {
  [ACADEMIC_STANDING.PRESIDENTS_LISTER]: {
    themeClass: 'result-card--gold',
    badgeText: "President's Lister",
    icon: <TrophyIcon />,
    personalizedMessage:
      'Outstanding academic achievement! Your commitment to excellence sets a benchmark at Bicol University.',
    showConfetti: true,
  },
  [ACADEMIC_STANDING.DEANS_LISTER]: {
    themeClass: 'result-card--silver',
    badgeText: "Dean's Lister",
    icon: <MedalIcon />,
    personalizedMessage: 'Commendable performance! Your hard work and diligence this semester have paid off.',
    showConfetti: true,
  },
  [ACADEMIC_STANDING.NOT_QUALIFIED]: {
    themeClass: 'result-card--bronze',
    badgeText: 'Academic Progress',
    icon: <StarBadgeIcon />,
    personalizedMessage: 'Every semester is a building block. Keep refining your approach, stay persistent, and power forward.',
    showConfetti: false,
  },
};

function ResultCard({ fullName, gwa, standing }) {
  const [displayGwa, setDisplayGwa] = useState(null);
  const [quote, setQuote] = useState(null);
  const animFrameRef = useRef(null);

  const config = STANDING_CONFIG[standing] || STANDING_CONFIG[ACADEMIC_STANDING.NOT_QUALIFIED];

  // Random quote picker on render/computation
  useEffect(() => {
    setQuote(getRandomQuote(getStandingTier(standing)));
  }, [standing, gwa]);

  // GWA count-up animation (counts down from 5.0 — the lowest possible grade
  // on BU's 1.0-5.0 scale — to the actual computed GWA).
  useEffect(() => {
    if (gwa === null || gwa === undefined || Number.isNaN(gwa)) {
      setDisplayGwa(null);
      return undefined;
    }

    const targetGwa = Number(gwa);
    const duration = 1200; // ms
    const startTime = performance.now();
    const startValue = 5.0;

    const animateGwa = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function: easeOutCubic
      const easedProgress = 1 - (1 - progress) ** 3;
      const currentValue = startValue - (startValue - targetGwa) * easedProgress;

      setDisplayGwa(currentValue);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animateGwa);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateGwa);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gwa]);

  return (
    <div className={`result-card ${config.themeClass}`}>
      {/* Subtle background decorative shapes */}
      <div className="result-card__bg-glow" aria-hidden="true" />

      {/* Confetti element overlay for high achievers */}
      {config.showConfetti && (
        <div className="result-card__confetti-wrapper" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <span key={i} className={`confetti-particle particle-${i + 1}`} />
          ))}
        </div>
      )}

      {/* BU Branding Badge Header */}
      <div className="result-card__header">
        <span className="result-card__bu-tag">Bicol University</span>
        <div className="result-card__icon-wrap">{config.icon}</div>
      </div>

      {/* Student Name */}
      {fullName && <h3 className="result-card__name">{fullName}</h3>}

      {/* Animated GWA Section */}
      <div className="result-card__gwa-container">
        <span className="result-card__gwa-label">General Weighted Average</span>
        <div className="result-card__gwa">{displayGwa !== null ? displayGwa.toFixed(4) : '—'}</div>
      </div>

      {/* Academic Standing Badge */}
      <div className="result-card__standing-wrap">
        <span className="result-card__standing">{config.badgeText}</span>
      </div>

      {/* Personalized Encouragement Message */}
      <p className="result-card__message">{config.personalizedMessage}</p>

      {/* Motivational Quote Section */}
      {quote && (
        <div className="result-card__quote-box">
          <QuoteIcon />
          <blockquote className="result-card__quote-text">&ldquo;{quote.text}&rdquo;</blockquote>
          <cite className="result-card__quote-author">— {quote.author}</cite>
        </div>
      )}
    </div>
  );
}

export default ResultCard;