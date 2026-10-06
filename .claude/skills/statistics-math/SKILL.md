---
name: statistics-math
description: Descriptive statistics and portfolio metrics for the IT PMO Kanban board dashboard (completion, overdue, blocked rates, days-to-due mean/median/std dev, distributions) in vanilla JavaScript. Use when adding or changing numbers in the "Portfolio statistics" section.
---

# Statistics for the IT PMO board

Adapted from the upstream `statistics-math` skill (Python/NumPy/SciPy) for this project. The original Python material is kept in `reference-upstream.md` for background only; do not add Python or libraries to the app.

## Project overrides (IT PMO Kanban board)

This skill is installed for the single-file `index.html` IT PMO board. `CLAUDE.md` wins over anything below in this skill:
- Vanilla HTML/CSS/JS only. No frameworks, bundlers, npm, CDN scripts, web fonts or image files. System font stack; inline SVG/Unicode for icons.
- No persistence (no localStorage, sessionStorage, IndexedDB, cookies). CSS uses custom properties and no `!important`.
- Palette is the corporate-blue `--blue-*` tokens plus the semantic red/amber/green/grey tokens in `:root`. No real bank logo or branding.
- Render from `state` only; escape every dynamic string with `escapeHtml()`. Dashboard/statistics cover ALL tasks, not the filtered view.
- Where this skill names a banned or required font, icon set, library (GSAP, Tailwind, Phosphor, Geist) or build tool, use the closest system-font / inline-SVG / plain-CSS equivalent instead.
- Verify visual changes with the Playwright MCP tools (1440x900 and 390px wide) and re-take `docs/screenshot.png` when the UI changes.

## Where the code lives

`index.html`, script block: `mean`, `median`, `stdDev`, `pct`, `daysFromToday`, `countBy`, `computeStats(tasks)`, `renderStats()`. `render()` calls `renderStats()` after `renderBoard()` and `renderSummary()`. Stats always use `state.tasks` (never the filtered list).

## Metric definitions (keep consistent in UI text)

| Metric | Formula | Notes |
|---|---|---|
| Completion rate | done / total | 0 when no tasks |
| Overdue rate | overdue / open | `isOverdue()`: status != Done and dueDate < today. Denominator is open tasks |
| Blocked share | blocked / total | |
| Critical / High open | count of open tasks with those priorities | |
| Days to due | `daysFromToday(dueDate)` for open tasks | negative = overdue. Report mean, median, sample std dev |
| Workload | open tasks per assignee | top 5, sorted desc then by name |

## Rules

- Guard empty sets: return `null` and show "n/a" (`fmt1`), never `NaN`/`Infinity`.
- Sample std dev uses n - 1 and needs at least 2 values.
- Prefer median over mean when showing a single "typical" value; show both when they differ (outliers such as long-overdue tasks).
- Round for display only (`Math.round`), never in calculations. Percentages are whole numbers.
- Seed dates are relative to today, so numbers move daily; test with assertions on structure/relationships (e.g. done + open = total), not hard-coded values.
- Small samples (about 8 tasks): do not present hypothesis tests, regressions or p-values. Describe, do not infer.
- New metric checklist: define it in the table above, add it to `computeStats`, render it with `escapeHtml`, check the empty and one-task cases, and screenshot at 1440px and 390px.
