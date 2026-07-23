import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import StepIndicator from '../components/calculator/StepIndicator';
import GradeEntryTable from '../components/calculator/GradeEntryTable';
import { calculateGWA, determineAcademicStanding } from '../utils/gradeUtils';
import { PROGRAM_OPTIONS } from '../utils/programOptions';
import { usePageTitle } from '../utils/usePageTitle';
import './DeansListerCalculator.css';

const STEP_LABELS = ['Student Info', 'Subject Count', 'Grade Entry'];
const YEAR_LEVELS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SEMESTERS = ['1st Semester', '2nd Semester', 'Summer'];

let nextId = 1;


/**
 * Resizes the subjects array to match targetCount without discarding
 * data already entered for rows that still exist (e.g. when the user
 * goes Back to Step 2, re-confirms/edits the count, then returns to Step 3).
 */
const adjustSubjectCount = (currentSubjects, targetCount) => {
  if (currentSubjects.length === targetCount) return currentSubjects;
  if (currentSubjects.length > targetCount) {
    return currentSubjects.slice(0, targetCount);
  }
  const additionalRows = Array.from(
    { length: targetCount - currentSubjects.length },
    () => ({ id: `subj-${nextId++}`, units: '', grade: '' })
  );
  return [...currentSubjects, ...additionalRows];
};

function DeansListerCalculator() {
  usePageTitle("President's / Dean's Lister Calculator");
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 state
  const [studentInfo, setStudentInfo] = useState({
    fullName: '',
    program: '',
    programOther: '',
    yearLevel: '',
    semester: '',
  });
  const [step1Errors, setStep1Errors] = useState({});

  // Step 2 state
  const [subjectCount, setSubjectCount] = useState('');
  const [step2Error, setStep2Error] = useState('');

  // Step 3 state
  const [subjects, setSubjects] = useState([]);
  const [step3Errors, setStep3Errors] = useState({});

  // Scroll to top whenever the step changes, so users on mobile always see
  // the top of the new step instead of staying scrolled where they were.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleStudentInfoChange = (field, value) => {
    setStudentInfo((prev) => ({ ...prev, [field]: value }));
    // Clear the field's error the moment the user starts correcting it.
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
    if (!studentInfo.yearLevel) errors.yearLevel = 'Please select a year level.';
    if (!studentInfo.semester) errors.semester = 'Please select a semester.';
    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const count = Number(subjectCount);
    if (!subjectCount || !Number.isInteger(count) || count < 1) {
      setStep2Error('Please enter a valid whole number of subjects (at least 1).');
      return false;
    }
    if (count > 30) {
      setStep2Error('That seems too high. Please enter 30 or fewer subjects.');
      return false;
    }
    setStep2Error('');
    return true;
  };

  const validateStep3 = () => {
    const errors = {};
    subjects.forEach((s) => {
      const rowErr = {};
      const units = Number(s.units);
      const grade = Number(s.grade);
      if (s.units === '' || Number.isNaN(units) || units <= 0) {
        rowErr.units = 'Enter valid units.';
      }
      if (s.grade === '' || Number.isNaN(grade) || grade < 1.0 || grade > 5.0) {
        rowErr.grade = 'Grade must be 1.0–5.0.';
      }
      if (Object.keys(rowErr).length > 0) errors[s.id] = rowErr;
    });
    setStep3Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const goToStep2 = () => {
    if (validateStep1()) setStep(2);
  };

  const goToStep3 = () => {
    if (validateStep2()) {
      const targetCount = Number(subjectCount);
      setSubjects((prev) => adjustSubjectCount(prev, targetCount));
      setStep(3);
    }
  };

  const handleSubjectChange = (id, field, value) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
    // Clear that specific field's error as the user corrects it.
    setStep3Errors((prev) => {
      if (!prev[id] || !prev[id][field]) return prev;
      const rowErr = { ...prev[id] };
      delete rowErr[field];
      const next = { ...prev };
      if (Object.keys(rowErr).length === 0) {
        delete next[id];
      } else {
        next[id] = rowErr;
      }
      return next;
    });
  };

  const handleCompute = () => {
    if (!validateStep3()) return;
    const gwa = calculateGWA(subjects);
    const standing = determineAcademicStanding(gwa, subjects);
    // Hand the computed result off to the dedicated results page instead of
    // rendering it inline, so the user gets a focused, distraction-free view.
    navigate('/deans-lister/results', {
      state: { resultType: 'deans-lister', fullName: displayName, gwa, standing },
    });
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const displayName = studentInfo.fullName.trim();

  return (
    <div className="page">
      <PageHeader
        title="President's / Dean's Lister Calculator"
        subtitle="Follow the steps below to compute your semester GWA and check your academic standing."
        accent="blue"
      />

      <div className="container page__body dlc-wizard">
        <StepIndicator steps={STEP_LABELS} currentStep={step} />

        {/* Step 1: Student Information */}
        {step === 1 && (
          <Card className="dlc-section">
            <h2 className="dlc-section__title">Step 1: Student Information</h2>
            <div className="dlc-grid">
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

              <Select
                id="yearLevel"
                label="Year Level"
                value={studentInfo.yearLevel}
                onChange={(e) => handleStudentInfoChange('yearLevel', e.target.value)}
                error={step1Errors.yearLevel}
              >
                <option value="" disabled>
                  Select year level
                </option>
                {YEAR_LEVELS.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </Select>
              <Select
                id="semester"
                label="Semester"
                value={studentInfo.semester}
                onChange={(e) => handleStudentInfoChange('semester', e.target.value)}
                error={step1Errors.semester}
              >
                <option value="" disabled>
                  Select semester
                </option>
                {SEMESTERS.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </Select>
            </div>
            <div className="dlc-actions dlc-actions--end">
              <Button variant="primary" onClick={goToStep2}>
                Next →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Number of Subjects */}
        {step === 2 && (
          <Card className="dlc-section">
            <h2 className="dlc-section__title">Step 2: Number of Subjects</h2>
            <div className="dlc-count-field">
              <Input
                id="subjectCount"
                label="How many subjects do you have this semester?"
                type="number"
                min="1"
                max="30"
                placeholder="e.g. 7"
                value={subjectCount}
                onChange={(e) => {
                  setSubjectCount(e.target.value);
                  if (step2Error) setStep2Error('');
                }}
                error={step2Error}
              />
            </div>
            <div className="dlc-actions dlc-actions--between">
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
          <Card className="dlc-section">
            <h2 className="dlc-section__title">Step 3: Grade Entry</h2>
            <p className="dlc-section__hint">
              Enter the units and grade (1.0–5.0) for each subject below.
            </p>
            <GradeEntryTable
              subjects={subjects}
              onChange={handleSubjectChange}
              errors={step3Errors}
            />
            <div className="dlc-actions dlc-actions--between">
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

export default DeansListerCalculator;