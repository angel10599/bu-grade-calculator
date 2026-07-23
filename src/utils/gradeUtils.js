// Grade computation utilities.

/**
 * Computes the General Weighted Average (GWA).
 * GWA = Σ (Grade × Units) ÷ Σ Units
 * @param {Array<{grade: number, units: number}>} subjects
 * @returns {number|null} GWA (unrounded — round only for display), or null if no valid units
 */
export function calculateGWA(subjects) {
  if (!subjects || subjects.length === 0) return null;

  const totalUnits = subjects.reduce((sum, s) => sum + Number(s.units || 0), 0);
  if (totalUnits === 0) return null;

  const weightedSum = subjects.reduce(
    (sum, s) => sum + Number(s.grade || 0) * Number(s.units || 0),
    0
  );

  return weightedSum / totalUnits;
}

// Latin Honors thresholds (per BU Student Handbook, Revised 2019 / BOR Resolution No. 89 s. 2006)
export const LATIN_HONORS_THRESHOLDS = {
  SUMMA_CUM_LAUDE: 1.25,
  MAGNA_CUM_LAUDE: 1.45,
  CUM_LAUDE: 1.75,
};

// A candidate is disqualified from Latin Honors if any grade is worse than 3.0
export const MIN_PASSING_GRADE_FOR_HONORS = 3.0;

// President's Lister / Dean's Lister thresholds
// Source: BU Student Handbook (Revised 2019) — per-term recognition.
export const DEANS_LIST_THRESHOLDS = {
  PRESIDENTS_LISTER: {
    maxGwa: 1.45, // 1.00 <= GWA <= 1.45
    minGradeAllowed: 2.4, // no individual grade may exceed 2.4
  },
  DEANS_LISTER: {
    maxGwa: 1.75, // 1.45 < GWA <= 1.75
    minGradeAllowed: 2.4,
  },
};

export const ACADEMIC_STANDING = {
  PRESIDENTS_LISTER: "President's Lister",
  DEANS_LISTER: "Dean's Lister",
  NOT_QUALIFIED: 'Not Qualified',
};

/**
 * Determines President's Lister / Dean's Lister / Not Qualified status.
 * Rule (BU Student Handbook): President's Lister requires 1.00 <= GWA <= 1.45;
 * Dean's Lister requires 1.45 < GWA <= 1.75. In both cases, no individual grade
 * may exceed 2.4.
 *
 * @param {number|null} gwa - the computed semester GWA
 * @param {Array<{grade: number|string}>} subjects
 * @returns {string} one of ACADEMIC_STANDING values
 */
export function determineAcademicStanding(gwa, subjects) {
  if (gwa === null || gwa === undefined || !subjects || subjects.length === 0) {
    return ACADEMIC_STANDING.NOT_QUALIFIED;
  }

  const worstGrade = Math.max(...subjects.map((s) => Number(s.grade || 5)));

  const { PRESIDENTS_LISTER, DEANS_LISTER } = DEANS_LIST_THRESHOLDS;

  if (gwa <= PRESIDENTS_LISTER.maxGwa && worstGrade <= PRESIDENTS_LISTER.minGradeAllowed) {
    return ACADEMIC_STANDING.PRESIDENTS_LISTER;
  }

  if (gwa <= DEANS_LISTER.maxGwa && worstGrade <= DEANS_LISTER.minGradeAllowed) {
    return ACADEMIC_STANDING.DEANS_LISTER;
  }

  return ACADEMIC_STANDING.NOT_QUALIFIED;
}

export const LATIN_HONOR_LABELS = {
  SUMMA: 'Summa Cum Laude',
  MAGNA: 'Magna Cum Laude',
  CUM_LAUDE: 'Cum Laude',
  ACADEMIC_DISTINCTION: 'With Academic Distinction',
  NONE: 'No Latin Honor',
};

// Fallback honor for students who meet the GWA requirement but are not fully
// eligible for regular Latin Honors (e.g. irregular students, transferees,
// or those who carried an underload in some semester).
// Source: BU Student Handbook (Revised 2019).
export const ACADEMIC_DISTINCTION_THRESHOLDS = {
  maxGwa: 1.75,
  minBuUnitRatio: 0.75, // at least 75% of total curriculum units earned at BU
  minResidencyTerms: 6, // in residence for at least 6 semesters/terms immediately preceding graduation
};

/**
 * Determines Latin Honors eligibility.
 *
 * Per the BU Student Handbook, full Latin Honors (Summa/Magna/Cum Laude) requires:
 *  - No grade worse than 3.0 in any subject
 *  - GWA within the relevant cutoff
 *  - Regular student status: full/regular load every semester (no underload)
 *    AND the required college residency period satisfied
 *
 * If the GWA/grade requirement is met but the student is NOT a fully eligible
 * regular student (e.g. irregular student, transferee, had an underload term),
 * they may instead qualify for the "With Academic Distinction" fallback, which
 * requires: GWA <= 1.75, at least 75% of total units earned at BU, and at
 * least 6 semesters/terms of residency immediately preceding graduation.
 *
 * @param {number|null} overallGwa - the computed overall GWA across all years/semesters
 * @param {Array<{grade: number|string}>} allSubjects - every subject across the whole course
 * @param {Object} [eligibility]
 * @param {boolean} [eligibility.isFullyEligible=true] - true if the student is a Regular
 *   Student who carried a full/regular load every semester (no underload) and has
 *   satisfied the college's required residency period
 * @param {number} [eligibility.buUnitRatio=1] - fraction (0-1) of total curriculum units
 *   earned at Bicol University (only relevant when isFullyEligible is false)
 * @param {number} [eligibility.residencyTerms=Infinity] - number of semesters/terms in
 *   residence immediately preceding graduation (only relevant when isFullyEligible is false)
 * @returns {string} one of LATIN_HONOR_LABELS values
 */
export function determineLatinHonor(overallGwa, allSubjects, eligibility = {}) {
  const {
    isFullyEligible = true,
    buUnitRatio = 1,
    residencyTerms = Infinity,
  } = eligibility;

  if (overallGwa === null || overallGwa === undefined || !allSubjects || allSubjects.length === 0) {
    return LATIN_HONOR_LABELS.NONE;
  }

  const hasDisqualifyingGrade = allSubjects.some(
    (s) => Number(s.grade) > MIN_PASSING_GRADE_FOR_HONORS
  );
  if (hasDisqualifyingGrade) {
    return LATIN_HONOR_LABELS.NONE;
  }

  if (isFullyEligible) {
    if (overallGwa <= LATIN_HONORS_THRESHOLDS.SUMMA_CUM_LAUDE) {
      return LATIN_HONOR_LABELS.SUMMA;
    }
    if (overallGwa <= LATIN_HONORS_THRESHOLDS.MAGNA_CUM_LAUDE) {
      return LATIN_HONOR_LABELS.MAGNA;
    }
    if (overallGwa <= LATIN_HONORS_THRESHOLDS.CUM_LAUDE) {
      return LATIN_HONOR_LABELS.CUM_LAUDE;
    }
    return LATIN_HONOR_LABELS.NONE;
  }

  // Not fully eligible for regular Latin Honors — check the
  // "With Academic Distinction" fallback instead.
  const { maxGwa, minBuUnitRatio, minResidencyTerms } = ACADEMIC_DISTINCTION_THRESHOLDS;
  if (overallGwa <= maxGwa && buUnitRatio >= minBuUnitRatio && residencyTerms >= minResidencyTerms) {
    return LATIN_HONOR_LABELS.ACADEMIC_DISTINCTION;
  }

  return LATIN_HONOR_LABELS.NONE;
}