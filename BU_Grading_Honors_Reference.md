# Bicol University — Grading, Honors & GWA Computation Reference
*Extracted from the Bicol University Student Handbook, Revised 2019, for use in building a grade calculation website.*

---

## 1. Base Grading System
**Source: BOR Resolution No. 89 s. 2006**

Numeric grades range from **1.0 (highest) to 5.0 (failure)**, in 0.1 increments.

| Adjectival Rating | Grade Range | % Equivalent |
|---|---|---|
| Outstanding | 1.0 – 1.4 | 95–100 |
| Superior | 1.5 – 1.7 | 92–94 |
| Very Satisfactory | 1.8 – 2.5 | 84–91 |
| Satisfactory | 2.6 – 2.8 | 78–83 |
| Fair/Average | 2.9 – 3.0 | 75–77 (3.0 = 75, Passing) |
| Poor | 3.1 – 4.0 | Below 75, Conditional (lowest possible **mid-term** rating) |
| Failure | 5.0 | Lowest possible **final** rating |

**Graduate School:** Passing grade is 3.0, but a GWA of 2.0 must be maintained to sit for comprehensive exams. A failing mark may be retaken **no more than two times**.

**Grade of Incomplete (INC):** Allowed only when a small part of coursework is missing and the student is otherwise passing. **Not counted in GWA** until removed. Must be completed within **one school year** or converts to a failing grade.

---

## 2. Academic Distinctions — Dean's Lister / President's Lister
*(Per-term recognition, non-graduating students)*

| Distinction | Grade Requirement |
|---|---|
| **President's Lister** | 1.00 ≤ Grade ≤ 1.45 |
| **Dean's Lister** | 1.45 < Grade ≤ 1.75 |

**Eligibility rule:** No grade lower than **2.4** in any subject that semester.

**Related — Academic Recognition:** High average rating for **two consecutive preceding terms** → medal + Certificate of Recognition. One high-rating term alone → Certificate of Recognition only.

---

## 3. Graduation with Honors (Latin Honors)

| Honor | GWA Requirement |
|---|---|
| **Summa Cum Laude** | GWA ≤ 1.25 |
| **Magna Cum Laude** | 1.25 < GWA ≤ 1.45 |
| **Cum Laude** | 1.45 < GWA ≤ 1.75 |

### Eligibility conditions (ALL must be met):
1. No grade lower than **3.0** in any subject, following the curriculum faithfully.
2. GWA computed to the **4th decimal place**, based on units.
3. Must have carried the **regular/full load** each semester — **underload disqualifies**.
4. Must be a **Regular Student** (organized program of study, registered for formal academic credits, carried curriculum-prescribed subjects each semester).
5. Must satisfy the **required residence period** in the college.

### Fallback: "With Academic Distinction"
Applies when GWA requirement is met but other requirements are not.

- Only grades/credits earned **toward the degree** are counted.
- **No grade lower than 3.0**, regardless of whether taken at BU or elsewhere.
- Transfer credit and curriculum sequencing rules must have been followed.
- Must have completed **≥75% of total curriculum units at Bicol University**.
- Must be **in residence for ≥6 semesters/terms** immediately preceding graduation.

**Evaluating body:** College Evaluation Committee on Graduation with Honors — College/Campus Registrar (Chair), Department/Program Chair (Co-Chair), College Student Affairs Coordinator, College Guidance Coordinator, Associate Dean, one College Faculty Expert in Math.

---

## 4. Ladderized/Ladder-Type Program Recognition

| Recognition | GWA Requirement |
|---|---|
| With highest honor | GWA ≤ 1.25 |
| With higher honor | 1.25 < GWA ≤ 1.45 |
| With high honor | 1.45 < GWA ≤ 1.75 |

Same evaluation committee as Latin Honors; awarded during the College Recognition Program.

---

## 5. GWA Computation Formula
*(Standard Philippine SUC method — not explicitly formularized in the handbook text itself; recommend confirming with BU Registrar/OSAS before launch)*

```
GWA = Σ (Grade × Units) / Σ (Units)
```

### Worked Example

| Subject | Grade | Units | Grade × Units |
|---|---|---|---|
| Math 101 | 1.25 | 3 | 3.75 |
| Eng 101 | 1.50 | 3 | 4.50 |
| PE 1 | 1.00 | 2 | 2.00 |
| NSTP 1 | 1.75 | 3 | 5.25 |

```
GWA = (3.75 + 4.50 + 2.00 + 5.25) / (3+3+2+3)
    = 15.5 / 11
    = 1.4091
```

---

## 6. Implementation Notes for the Website

**Precision:** Carry full decimal precision through calculations — do not round to 2 decimals before the final honor-tier comparison, since boundaries (e.g., 1.25) are exact cutoffs and 4-decimal precision is specified for honors.

**Boundary inclusivity** (apply exactly as written):
- Summa: `GWA ≤ 1.25` (inclusive)
- Magna: `1.25 < GWA ≤ 1.45`
- Cum Laude: `1.45 < GWA ≤ 1.75`
- Same pattern for President's/Dean's Lister and ladderized honors.

**Units to include/exclude:**
- Include all graded academic subjects counted toward the degree.
- Exclude INC grades until resolved.
- Only credits earned toward the degree count for the "With Academic Distinction" fallback.
- Confirm whether PE/NSTP are numerically weighted in GWA or Pass/Fail only — this varies by institution and isn't specified in the handbook.

**Transfer/shifter units:** Regular Latin Honors allow transfer credits if no grade below 3.0; the "With Academic Distinction" fallback specifically requires ≥75% of units earned at BU — track "units earned at BU" separately from "total units."

**Per-term vs. cumulative:**
- Dean's/President's Lister → **per-term** computation (recompute each semester).
- Latin Honors GWA → **cumulative**, across the whole program.
- Keep these as separate computation functions.

---

## 7. Suggested Logic Pseudocode

```
FUNCTION checkDeansPresidentsLister(termGrades, termUnits):
    IF any grade > 2.4: RETURN "NOT QUALIFIED"
    average = Σ(grade × units) / Σ(units)
    IF 1.00 <= average <= 1.45: RETURN "President's Lister"
    ELSE IF 1.45 < average <= 1.75: RETURN "Dean's Lister"
    ELSE: RETURN "NOT QUALIFIED"

FUNCTION checkLatinHonors(allGrades, allUnits, isRegularStudent,
                           metResidency, unitsEarnedAtBU, totalUnits):
    IF any grade > 3.0: RETURN "NOT QUALIFIED"
    GWA = round(Σ(grade × units) / Σ(units), 4)

    fullyEligible = isRegularStudent AND metResidency AND noUnderload

    IF fullyEligible:
        IF GWA <= 1.25: RETURN "Summa Cum Laude"
        ELIF GWA <= 1.45: RETURN "Magna Cum Laude"
        ELIF GWA <= 1.75: RETURN "Cum Laude"
        ELSE: RETURN "NOT QUALIFIED"
    ELSE:
        ratioAtBU = unitsEarnedAtBU / totalUnits
        IF GWA <= 1.75 AND ratioAtBU >= 0.75 AND residencyTerms >= 6:
            RETURN "With Academic Distinction"
        ELSE:
            RETURN "NOT QUALIFIED"
```

---

*Note: This document consolidates handbook-stated rules with standard Philippine SUC GWA computation conventions where the handbook itself does not specify a formula. Confirm PE/NSTP weighting and rounding-vs-truncation conventions with the BU Registrar or OSAS before finalizing the website's calculator.*
