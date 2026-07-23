import { ACADEMIC_STANDING, LATIN_HONOR_LABELS } from './gradeUtils';

// Quote pools grouped by achievement tier. Every pool is written to be
// encouraging — even the "growth" pool (shown for Not Qualified / No Latin
// Honor) is framed around perseverance and progress rather than failure,
// so every student receives encouragement regardless of outcome.
//
// This is the single source of truth for motivational quotes shown on both
// the President's/Dean's Lister result card and the Latin Honors result
// card, so the two calculators feel like one cohesive product instead of
// having their own separate copy/paste quote banks.
export const QUOTE_TIERS = {
  HIGH: 'high',
  SOLID: 'solid',
  GROWTH: 'growth',
};

const QUOTES = {
  [QUOTE_TIERS.HIGH]: [
    { text: 'Excellence is not an accident — it is the result of discipline, focus, and heart, all of which you\u2019ve clearly shown.', author: 'Academic Mindset' },
    { text: 'You didn\u2019t just meet the standard, you set a new one for yourself to chase next time.', author: 'Academic Mindset' },
    { text: 'Excellence is not an act, but a habit.', author: 'Aristotle' },
    { text: 'Success is no accident. It is hard work, perseverance, learning, and sacrifice.', author: 'Pelé' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
    { text: 'Talent opens the door, but discipline is what walked you through it.', author: 'Academic Mindset' },
  ],
  [QUOTE_TIERS.SOLID]: [
    { text: 'Solid, steady progress like this is what real growth is built on.', author: 'Academic Mindset' },
    { text: 'You\u2019re proof that consistency beats intensity over the long run.', author: 'Academic Mindset' },
    { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    { text: 'Success is the sum of small efforts, repeated day in and day out.', author: 'Robert Collier' },
    { text: 'Good things happen when you show up for yourself, semester after semester.', author: 'Academic Mindset' },
    { text: 'Strong results like this don\u2019t happen by chance — they happen by choice.', author: 'Academic Mindset' },
  ],
  [QUOTE_TIERS.GROWTH]: [
    { text: 'Every setback is simply data for your next comeback. Keep going.', author: 'Academic Mindset' },
    { text: 'This semester is a chapter, not the whole story. Write the next one stronger.', author: 'Academic Mindset' },
    { text: 'Growth is rarely a straight line — what matters is that you keep moving forward.', author: 'Academic Mindset' },
    { text: 'Believe you can and you\u2019re halfway there. Growth takes time and patience.', author: 'Theodore Roosevelt' },
    { text: 'Challenges are what make life interesting; overcoming them is what makes life meaningful.', author: 'Joshua J. Marine' },
    { text: 'The secret of getting ahead is getting started. Keep your head high.', author: 'Mark Twain' },
  ],
};

/**
 * Returns a random quote from the given tier's pool.
 * @param {'high'|'solid'|'growth'} tier
 * @returns {{text: string, author: string}}
 */
export function getRandomQuote(tier) {
  const pool = QUOTES[tier] || QUOTES[QUOTE_TIERS.GROWTH];
  return pool[Math.floor(Math.random() * pool.length)];
}

/** Maps a President's/Dean's Lister standing to a quote tier. */
export function getStandingTier(standing) {
  if (standing === ACADEMIC_STANDING.PRESIDENTS_LISTER) return QUOTE_TIERS.HIGH;
  if (standing === ACADEMIC_STANDING.DEANS_LISTER) return QUOTE_TIERS.SOLID;
  return QUOTE_TIERS.GROWTH;
}

/** Maps a Latin Honors result to a quote tier. */
export function getHonorTier(honor) {
  if (honor === LATIN_HONOR_LABELS.SUMMA) return QUOTE_TIERS.HIGH;
  if (
    honor === LATIN_HONOR_LABELS.MAGNA ||
    honor === LATIN_HONOR_LABELS.CUM_LAUDE ||
    honor === LATIN_HONOR_LABELS.ACADEMIC_DISTINCTION
  ) {
    return QUOTE_TIERS.SOLID;
  }
  return QUOTE_TIERS.GROWTH;
}
