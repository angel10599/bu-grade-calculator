import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import StepIndicator from '../components/calculator/StepIndicator';
import GradeEntryTable from '../components/calculator/GradeEntryTable';
import { calculateGWA, determineLatinHonor } from '../utils/gradeUtils';
import { PROGRAM_OPTIONS } from '../utils/programOptions';
import { usePageTitle } from '../utils/usePageTitle';
import './LatinHonorsCalculator.css';

const STEP_LABELS = ['Student Info', 'Term Setup', 'Grade Entry'];

const YEAR_DEFS = [
  { id: 'y1', label: '1st Year' },
  { id: 'y2', label: '2nd Year' },
  { id: 'y3', label: '3rd Year' },
  { id: 'y4', label: '4th Year' },
];

const makeInitialYears = () =>
  YEAR_DEFS.map((y) => ({
    id: y.id,
    label: y.label,
    firstCount: '',
    secondCount: '',
    midyearEnabled: false,
    midyearCount: '',
  }));

let nextId = 1;

/** Resize a term's subject array without discarding already-entered data. */
const adjustRows = (currentRows, targetCount) => {
  if (currentRows.length === targetCount) return currentRows;
  if (currentRows.length > targetCount) return currentRows.slice(0, targetCount);
  const extra = Array.from({ length: targetCount - currentRows.length }, () => ({
    id: `subj-${nextId++}`,
    units: '',
    grade: '',
  }));
  return [...currentRows, ...extra];
};

/** Builds the flat list of terms (with counts) from the years configuration. */
const buildTermList = (years) => {
  const terms = [];
  years.forEach((y) => {
    terms.push({ termId: `${y.id}-first`, yearLabel: y.label, termLabel: '1st Semester', count: Number(y.firstCount) || 0 });
    terms.push({ termId: `${y.id}-second`, yearLabel: y.label, termLabel: '2nd Semester', count: Number(y.secondCount) || 0 });
    if (y.midyearEnabled) {
      terms.push({ termId: `${y.id}-midyear`, yearLabel: y.label, termLabel: 'Midyear/Summer Term', count: Number(y.midyearCount) || 0 });
    }
  });
  return terms;
};

function LatinHonorsCalculator() {
  usePageTitle('Latin Honors Calculator');
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1
  const [studentInfo, setStudentInfo] = useState({ fullName: '', program: '', programOther: '' });
  const [step1Errors, setStep1Errors] = useState({});

  // Eligibility (Step 1) — determines whether the student is checked against the
  // regular Latin Honors thresholds, or the "With Academic Distinction" fallback.
  const [eligibility, setEligibility] = useState({
    isFullyEligible: 'yes', // 'yes' | 'no'
    buUnitPercent: '',
    residencyTerms: '',
  });
  const [eligibilityErrors, setEligibilityErrors] = useState({});

  // Step 2
  const [years, setYears] = useState(makeInitialYears());
  const [step2Errors, setStep2Errors] = useState({});

  // Step 3
  const [subjectsByTerm, setSubjectsByTerm] = useState({});
  const [step3Errors, setStep3Errors] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // ---------- Step 1 handlers ----------
  const handleStudentInfoChange = (field, value) => {
    setStudentInfo((prev) => ({ ...prev, [field]: value }));
    setStep1Errors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateStep1 = () => {
    const errors = {};
    if (!studentInfo.fullName.trim()) errors.fullName = 'Full Name is required.';
    if (!studentInfo.program) errors.program = 'Please select a program.';
    if (studentInfo.program === 'Other' && !studentInfo.programOther.trim()) {
      errors.programOther = 'Please specify your program.';
    }
    setStep1Errors(errors);

    const eligErrors = {};
    if (eligibility.isFullyEligible === 'no') {
      const pct = Number(eligibility.buUnitPercent);
      const terms = Number(eligibility.residencyTerms);
      if (eligibility.buUnitPercent === '' || Number.isNaN(pct) || pct < 0 || pct > 100) {
        eligErrors.buUnitPercent = 'Enter a percentage between 0 and 100.';
      }
      if (
        eligibility.residencyTerms === '' ||
        !Number.isInteger(terms) ||
        terms < 0 ||
        terms > 20
      ) {
        eligErrors.residencyTerms = 'Enter a valid number of terms.';
      }
    }
    setEligibilityErrors(eligErrors);

    return Object.keys(errors).length === 0 && Object.keys(eligErrors).length === 0;
  };

  const handleEligibilityChange = (field, value) => {
    setEligibility((prev) => ({ ...prev, [field]: value }));
    setEligibilityErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const goToStep2 = () => {
    if (validateStep1()) setStep(2);
  };

  // ---------- Step 2 handlers ----------
  const handleYearFieldChange = (yearId, field, value) => {
    setYears((prev) => prev.map((y) => (y.id === yearId ? { ...y, [field]: value } : y)));
    setStep2Errors((prev) => {
      const key = `${yearId}-${field}`;
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validateStep2 = () => {
    const errors = {};
    years.forEach((y) => {
      const first = Number(y.firstCount);
      const second = Number(y.secondCount);

      if (!y.firstCount || !Number.isInteger(first) || first < 1 || first > 30) {
        errors[`${y.id}-firstCount`] = 'Enter a valid number (1–30).';
      }
      if (!y.secondCount || !Number.isInteger(second) || second < 1 || second > 30) {
        errors[`${y.id}-secondCount`] = 'Enter a valid number (1–30).';
      }
      if (y.midyearEnabled) {
        const mid = Number(y.midyearCount);
        if (!y.midyearCount || !Number.isInteger(mid) || mid < 1 || mid > 30) {
          errors[`${y.id}-midyearCount`] = 'Enter a valid number (1–30).';
        }
      }
    });
    setStep2Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const goToStep3 = () => {
    if (!validateStep2()) return;
    const terms = buildTermList(years);
    setSubjectsByTerm((prev) => {
      const next = {};
      terms.forEach((t) => {
        next[t.termId] = adjustRows(prev[t.termId] || [], t.count);
      });
      return next;
    });
    setStep(3);
  };

  // ---------- Step 3 handlers ----------
  const handleTermSubjectChange = (termId, subjectId, field, value) => {
    setSubjectsByTerm((prev) => ({
      ...prev,
      [termId]: prev[termId].map((s) => (s.id === subjectId ? { ...s, [field]: value } : s)),
    }));
    setStep3Errors((prev) => {
      if (!prev[termId] || !prev[termId][subjectId] || !prev[termId][subjectId][field]) return prev;
      const rowErr = { ...prev[termId][subjectId] };
      delete rowErr[field];
      const termErr = { ...prev[termId] };
      if (Object.keys(rowErr).length === 0) {
        delete termErr[subjectId];
      } else {
        termErr[subjectId] = rowErr;
      }
      const next = { ...prev };
      if (Object.keys(termErr).length === 0) {
        delete next[termId];
      } else {
        next[termId] = termErr;
      }
      return next;
    });
  };

  const validateStep3 = () => {
    const errors = {};
    Object.entries(subjectsByTerm).forEach(([termId, rows]) => {
      rows.forEach((s) => {
        const rowErr = {};
        const units = Number(s.units);
        const grade = Number(s.grade);
        if (s.units === '' || Number.isNaN(units) || units <= 0) rowErr.units = 'Enter valid units.';
        if (s.grade === '' || Number.isNaN(grade) || grade < 1.0 || grade > 5.0) {
          rowErr.grade = 'Grade must be 1.0–5.0.';
        }
        if (Object.keys(rowErr).length > 0) {
          errors[termId] = { ...(errors[termId] || {}), [s.id]: rowErr };
        }
      });
    });
    setStep3Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCompute = () => {
    if (!validateStep3()) return;
    const allSubjects = Object.values(subjectsByTerm).flat();
    const gwa = calculateGWA(allSubjects);
    const honor = determineLatinHonor(gwa, allSubjects, {
      isFullyEligible: eligibility.isFullyEligible === 'yes',
      buUnitRatio: eligibility.buUnitPercent === '' ? 1 : Number(eligibility.buUnitPercent) / 100,
      residencyTerms:
        eligibility.residencyTerms === '' ? Infinity : Number(eligibility.residencyTerms),
    });
    // Hand the computed result off to the dedicated results page instead of
    // rendering it inline, so the user gets a focused, distraction-free view.
    navigate('/latin-honors/results', {
      state: { resultType: 'latin-honors', fullName: displayName, gwa, honor },
    });
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const displayName = studentInfo.fullName.trim();
  const termList = buildTermList(years);

  return (
    <div className="page">
      <PageHeader
        title="Latin Honors Calculator"
        subtitle="Follow the steps below to compute your overall GWA and check your Latin Honors eligibility."
        accent="orange"
      />

      <div className="container page__body lhc-wizard">
        <StepIndicator steps={STEP_LABELS} currentStep={step} />

        {/* Step 1: Student Information */}
        {step === 1 && (
          <Card className="lhc-section">
            <h2 className="lhc-section__title">Step 1: Student Information</h2>
            <div className="lhc-grid">
              <Input
                id="fullName"
                label="Full Name"
                placeholder="Juan Dela Cruz"
                value={studentInfo.fullName}
                onChange={(e) => handleStudentInfoChange('fullName', e.target.value)}
                error={step1Errors.fullName}
              />
              <Select
                id="program"
                label="Program / Course"
                value={studentInfo.program}
                onChange={(e) => handleStudentInfoChange('program', e.target.value)}
                error={step1Errors.program}
              >
                <option value="" disabled>
                  Select program
                </option>
                {PROGRAM_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
              {studentInfo.program === 'Other' && (
                <Input
                  id="programOther"
                  label="Please specify your Program/Course"
                  placeholder="e.g. BS Data Science"
                  value={studentInfo.programOther}
                  onChange={(e) => handleStudentInfoChange('programOther', e.target.value)}
                  error={step1Errors.programOther}
                />
              )}
            </div>

            <div className="lhc-eligibility">
              <h3 className="lhc-eligibility__title">Latin Honors Eligibility</h3>
              <p className="lhc-section__hint">
                Per the BU Student Handbook, full Latin Honors (Summa/Magna/Cum Laude) requires
                Regular Student status: a full/regular course load every semester (no underload)
                and the required college residency period.
              </p>
              <Select
                id="isFullyEligible"
                label="Were you a Regular Student who carried a full/regular load every semester (no underload) and met the residency requirement?"
                value={eligibility.isFullyEligible}
                onChange={(e) => handleEligibilityChange('isFullyEligible', e.target.value)}
              >
                <option value="yes">Yes — I meet all Regular Student requirements</option>
                <option value="no">No — I had an underload term, was irregular, or transferred in</option>
              </Select>

              {eligibility.isFullyEligible === 'no' && (
                <div className="lhc-grid">
                  <Input
                    id="buUnitPercent"
                    label="% of total curriculum units earned at Bicol University"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    placeholder="e.g. 90"
                    value={eligibility.buUnitPercent}
                    onChange={(e) => handleEligibilityChange('buUnitPercent', e.target.value)}
                    error={eligibilityErrors.buUnitPercent}
                    hint="Only units earned toward the degree count."
                  />
                  <Input
                    id="residencyTerms"
                    label="Semesters/terms in residence immediately preceding graduation"
                    type="number"
                    min="0"
                    max="20"
                    step="1"
                    placeholder="e.g. 8"
                    value={eligibility.residencyTerms}
                    onChange={(e) => handleEligibilityChange('residencyTerms', e.target.value)}
                    error={eligibilityErrors.residencyTerms}
                  />
                  <p className="lhc-eligibility__note">
                    If you don't fully meet Regular Student requirements, you may still qualify
                    for <strong>"With Academic Distinction"</strong> if your GWA is ≤ 1.75, at
                    least 75% of your total units were earned at BU, and you were in residence
                    for at least 6 semesters/terms immediately before graduation.
                  </p>
                </div>
              )}
            </div>

            <div className="lhc-actions lhc-actions--end">
              <Button variant="primary" onClick={goToStep2}>
                Next →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Term Setup */}
        {step === 2 && (
          <Card className="lhc-section">
            <h2 className="lhc-section__title">Step 2: Term Setup</h2>
            <p className="lhc-section__hint">
              For each year, enter how many subjects you took per semester. If you had a
              Midyear/Summer term that year (common for OJT/practicum), enable it and enter its
              subject count too.
            </p>

            <div className="lhc-years">
              {years.map((y) => (
                <div key={y.id} className="lhc-year-block">
                  <h3 className="lhc-year-block__title">{y.label}</h3>
                  <div className="lhc-year-block__grid">
                    <Input
                      id={`${y.id}-first`}
                      label="Subjects — 1st Semester"
                      type="number"
                      min="1"
                      max="30"
                      placeholder="e.g. 6"
                      value={y.firstCount}
                      onChange={(e) => handleYearFieldChange(y.id, 'firstCount', e.target.value)}
                      error={step2Errors[`${y.id}-firstCount`]}
                    />
                    <Input
                      id={`${y.id}-second`}
                      label="Subjects — 2nd Semester"
                      type="number"
                      min="1"
                      max="30"
                      placeholder="e.g. 6"
                      value={y.secondCount}
                      onChange={(e) => handleYearFieldChange(y.id, 'secondCount', e.target.value)}
                      error={step2Errors[`${y.id}-secondCount`]}
                    />
                  </div>

                  <label className="lhc-midyear-toggle">
                    <input
                      type="checkbox"
                      checked={y.midyearEnabled}
                      onChange={(e) => handleYearFieldChange(y.id, 'midyearEnabled', e.target.checked)}
                    />
                    + Add Midyear/Summer Term for {y.label}
                  </label>

                  {y.midyearEnabled && (
                    <div className="lhc-year-block__grid lhc-year-block__grid--single">
                      <Input
                        id={`${y.id}-midyear`}
                        label="Subjects — Midyear/Summer Term"
                        type="number"
                        min="1"
                        max="30"
                        placeholder="e.g. 2"
                        value={y.midyearCount}
                        onChange={(e) => handleYearFieldChange(y.id, 'midyearCount', e.target.value)}
                        error={step2Errors[`${y.id}-midyearCount`]}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="lhc-actions lhc-actions--between">
              <Button variant="outline" onClick={handleBack}>
                ← Back
              </Button>
              <Button variant="primary" onClick={goToStep3}>
                Next →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Grade Entry */}
        {step === 3 && (
          <Card className="lhc-section">
            <h2 className="lhc-section__title">Step 3: Grade Entry</h2>
            <p className="lhc-section__hint">
              Enter the units and grade (1.0–5.0) for each subject, organized by year and term.
            </p>

            {years.map((y) => {
              const yearTerms = termList.filter((t) => t.termId.startsWith(`${y.id}-`));
              return (
                <div key={y.id} className="lhc-entry-year">
                  <h3 className="lhc-entry-year__title">{y.label}</h3>
                  {yearTerms.map((t) => (
                    <div key={t.termId} className="lhc-entry-term">
                      <h4 className="lhc-entry-term__title">{t.termLabel}</h4>
                      <GradeEntryTable
                        subjects={subjectsByTerm[t.termId] || []}
                        onChange={(subjectId, field, value) =>
                          handleTermSubjectChange(t.termId, subjectId, field, value)
                        }
                        errors={step3Errors[t.termId] || {}}
                      />
                    </div>
                  ))}
                </div>
              );
            })}

            <div className="lhc-actions lhc-actions--between">
              <Button variant="outline" onClick={handleBack}>
                ← Back
              </Button>
              <Button variant="primary" size="lg" onClick={handleCompute}>
                Compute GWA
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default LatinHonorsCalculator;