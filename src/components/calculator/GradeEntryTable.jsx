import './GradeEntryTable.css';

/**
 * Auto-numbered grade entry rows (Subject 1, Subject 2, ...).
 * Fixed row count based on Step 2.
 */
function GradeEntryTable({ subjects, onChange, errors = {} }) {
  return (
    <div className="grade-entry">
      {subjects.map((subject, index) => {
        const rowErrors = errors[subject.id] || {};
        const hasError = rowErrors.units || rowErrors.grade;

        return (
          <div 
            className={`grade-entry__card ${hasError ? 'grade-entry__card--error' : ''}`} 
            key={subject.id}
          >
            {/* Subject Indicator Badge */}
            <div className="grade-entry__header">
              <span className="grade-entry__badge">
                <span className="grade-entry__dot"></span>
                Subject {index + 1}
              </span>
            </div>

            {/* Inputs Container */}
            <div className="grade-entry__fields">
              {/* Units Input */}
              <div className="grade-entry__field">
                <label className="grade-entry__label" htmlFor={`units-${subject.id}`}>
                  Units
                </label>
                <div className="grade-entry__input-wrapper">
                  <input
                    id={`units-${subject.id}`}
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="e.g. 3.0"
                    className={`grade-entry__input ${rowErrors.units ? 'grade-entry__input--error' : ''}`}
                    value={subject.units}
                    onChange={(e) => onChange(subject.id, 'units', e.target.value)}
                  />
                </div>
                {rowErrors.units && <span className="grade-entry__error">{rowErrors.units}</span>}
              </div>

              {/* Grade Input */}
              <div className="grade-entry__field">
                <label className="grade-entry__label" htmlFor={`grade-${subject.id}`}>
                  Grade
                </label>
                <div className="grade-entry__input-wrapper">
                  <input
                    id={`grade-${subject.id}`}
                    type="number"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    placeholder="e.g. 1.25"
                    className={`grade-entry__input ${rowErrors.grade ? 'grade-entry__input--error' : ''}`}
                    value={subject.grade}
                    onChange={(e) => onChange(subject.id, 'grade', e.target.value)}
                  />
                </div>
                {rowErrors.grade && <span className="grade-entry__error">{rowErrors.grade}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GradeEntryTable;