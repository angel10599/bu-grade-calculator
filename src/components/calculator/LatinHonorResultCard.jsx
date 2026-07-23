import { useState, useEffect, useRef } from 'react';
import { LATIN_HONOR_LABELS } from '../../utils/gradeUtils';
import { getRandomQuote, getHonorTier } from '../../utils/motivationalQuotes';
import './ResultCard.css';

function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9 7.3 11.3 12 5.2l4.7 6.1L20 9l-1.4 8.5H5.4L4 9Z" />
      <path d="M5.6 20h12.8" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.2 3h7.6l-2.6 6.2M8.2 3 5.6 3M8.2 3l2.7 6.2" />
      <circle cx="12" cy="15" r="6" />
      <path d="M12 12.3v3l2.1 1.2" />
    </svg>
  );
}

function GraduationCapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4 2.5 8.8 12 13.5l9.5-4.7L12 4Z" />
      <path d="M6.5 11.3v4c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4" />
      <path d="M21 9v5.5" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 3h7l4 4v13a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M13.5 3v4h4" />
      <path d="M8.5 12.5h7M8.5 15.8h4.5" />
    </svg>
  );
}

// --- HONOR CONFIGURATIONS ---
// Mirrors the structure of ResultCard's STANDING_CONFIG so both calculators
// share the same visual language (theme class, icon, message, confetti).
const HONOR_CONFIG = {
  [LATIN_HONOR_LABELS.SUMMA]: {
    themeClass: 'result-card--gold',
    badgeText: LATIN_HONOR_LABELS.SUMMA,
    icon: <CrownIcon />,
    personalizedMessage: 'Outstanding! You qualify for Summa Cum Laude — the highest honor Bicol University confers.',
    showConfetti: true,
  },
  [LATIN_HONOR_LABELS.MAGNA]: {
    themeClass: 'result-card--silver',
    badgeText: LATIN_HONOR_LABELS.MAGNA,
    icon: <MedalIcon />,
    personalizedMessage: 'Excellent work! Your consistent performance across your entire course has earned Magna Cum Laude.',
    showConfetti: true,
  },
  [LATIN_HONOR_LABELS.CUM_LAUDE]: {
    themeClass: 'result-card--bronze',
    badgeText: LATIN_HONOR_LABELS.CUM_LAUDE,
    icon: <GraduationCapIcon />,
    personalizedMessage: 'Congratulations! Your dedication throughout your course has earned you Cum Laude honors.',
    showConfetti: false,
  },
  [LATIN_HONOR_LABELS.ACADEMIC_DISTINCTION]: {
    themeClass: 'result-card--bronze',
    badgeText: LATIN_HONOR_LABELS.ACADEMIC_DISTINCTION,
    icon: <DocumentIcon />,
    personalizedMessage:
      'Your GWA meets the honors cutoff. Since the full Regular Student/residency requirements for Latin Honors were not met, you qualify for "With Academic Distinction" instead.',
    showConfetti: false,
  },
  [LATIN_HONOR_LABELS.NONE]: {
    themeClass: 'result-card--neutral',
    badgeText: LATIN_HONOR_LABELS.NONE,
    icon: <DocumentIcon />,
    personalizedMessage: 'You did not meet the GWA cutoff or grade requirement for Latin Honors this course.',
    showConfetti: false,
  },
};

function LatinHonorResultCard({ fullName, gwa, honor }) {
  const [displayGwa, setDisplayGwa] = useState(null);
  const [quote, setQuote] = useState(null);
  const animFrameRef = useRef(null);

  const config = HONOR_CONFIG[honor] || HONOR_CONFIG[LATIN_HONOR_LABELS.NONE];

  // Random quote picker on render/computation — shares the same quote bank
  // as the President's/Dean's Lister result card for a consistent tone.
  useEffect(() => {
    setQuote(getRandomQuote(getHonorTier(honor)));
  }, [honor, gwa]);

  // GWA count-up animation, matching ResultCard's behavior.
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
      <div className="result-card__bg-glow" aria-hidden="true" />

      {config.showConfetti && (
        <div className="result-card__confetti-wrapper" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <span key={i} className={`confetti-particle particle-${i + 1}`} />
          ))}
        </div>
      )}

      <div className="result-card__header">
        <span className="result-card__bu-tag">Bicol University</span>
        <div className="result-card__icon-wrap">{config.icon}</div>
      </div>

      {fullName && <h3 className="result-card__name">{fullName}</h3>}

      <div className="result-card__gwa-container">
        <span className="result-card__gwa-label">Overall GWA</span>
        <div className="result-card__gwa">{displayGwa !== null ? displayGwa.toFixed(4) : '—'}</div>
      </div>

      <div className="result-card__standing-wrap">
        <span className="result-card__standing">{config.badgeText}</span>
      </div>

      <p className="result-card__message">{config.personalizedMessage}</p>

      {quote && (
        <div className="result-card__quote-box">
          <blockquote className="result-card__quote-text">&ldquo;{quote.text}&rdquo;</blockquote>
          <cite className="result-card__quote-author">— {quote.author}</cite>
        </div>
      )}
    </div>
  );
}

export default LatinHonorResultCard;