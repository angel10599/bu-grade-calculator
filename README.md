# BU Grade Computation Portal

A frontend-only web app for Bicol University students to compute their General Weighted
Average (GWA) and check academic standing — no login, no database, no data ever leaves your
browser.

## Features

### President's / Dean's Lister Calculator
A 3-step wizard: enter student info → number of subjects → units & grades. Instantly computes
your semester GWA and tells you whether you qualify for President's Lister, Dean's Lister, or
Not Qualified.

### Latin Honors Calculator
A 3-step wizard covering all 4 years of a course (with an optional Midyear/Summer term per
year). Computes your overall (cumulative) GWA across every semester and checks your eligibility
for Summa Cum Laude, Magna Cum Laude, Cum Laude, "With Academic Distinction" (fallback), or No
Latin Honor. Step 1 asks whether you meet full Regular Student requirements (full/regular load
every semester, no underload, required residency satisfied); if not, it asks for the percentage
of units earned at BU and your residency terms so it can correctly evaluate the "With Academic
Distinction" fallback per the handbook.

## Grading Rules Used

*Source: Bicol University Student Handbook (Revised 2019) / BOR Resolution No. 89 s. 2006 —
see `BU_Grading_Honors_Reference.md`.*

| Standing (per-term) | GWA range | Other requirement |
|---|---|---|
| President's Lister | 1.00 ≤ GWA ≤ 1.45 | No individual grade worse than 2.4 |
| Dean's Lister | 1.45 < GWA ≤ 1.75 | No individual grade worse than 2.4 |

| Latin Honor (cumulative, full Regular Student) | GWA range | Other requirement |
|---|---|---|
| Summa Cum Laude | GWA ≤ 1.25 | No grade worse than 3.0; full/regular load every semester; residency satisfied |
| Magna Cum Laude | 1.25 < GWA ≤ 1.45 | Same as above |
| Cum Laude | 1.45 < GWA ≤ 1.75 | Same as above |
| With Academic Distinction (fallback) | GWA ≤ 1.75 | No grade worse than 3.0; ≥75% of total units earned at BU; ≥6 semesters/terms in residence immediately preceding graduation |

GWA formula: `GWA = Σ(Grade × Units) ÷ Σ(Units)`, carried at full decimal precision and
displayed to 4 decimal places, per the handbook's 4th-decimal-place requirement for honors GWA.

Dean's/President's Lister is computed **per term**; Latin Honors GWA is computed **cumulatively**
across the whole program — these use two separate calculators/functions by design.

## Design System

Branded with Bicol University's official colors — Aqua Blue, Orange, and Grey — using a
consistent design token system (see `src/styles/variables.css`) that also powers a full dark
mode. Headings use Merriweather (serif) for an academic feel; body text uses Inter for
readability. Cards, buttons, and interactive elements use fade-in, shimmer-sweep, and lift/hover
animations for a modern, tactile feel.

## Tech Stack

- React 19 + Vite
- React Router (client-side routing)
- Bootstrap 5 (grid/utility classes) layered underneath a custom CSS design-token system —
  Bootstrap is imported first so the app's own component styles always take precedence
- 100% client-side — all computation happens in your browser via JavaScript

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

## Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder, ready to deploy to any static host (Vercel, Netlify, GitHub
Pages, etc.) — no backend or database needed.

## Notes & Assumptions

- This tool is unofficial; a disclaimer is shown with every computed result (see
  `src/components/common/Disclaimer.jsx`).
- Grades of Incomplete (INC) are not counted toward GWA until resolved — simply exclude INC
  subjects from the grade-entry table until the grade is finalized.
- Whether PE/NSTP subjects are numerically weighted in the GWA or graded Pass/Fail varies by
  program and isn't specified in the handbook — confirm with the BU Registrar/OSAS and include
  or exclude those rows accordingly.
- Full source reference: `BU_Grading_Honors_Reference.md` (extracted from the BU Student
  Handbook, Revised 2019).

## Privacy

No accounts, no cookies for tracking, no backend. All computations happen locally in your
browser using JavaScript, and nothing is stored once you close or refresh the page.