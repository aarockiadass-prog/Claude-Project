# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-file "IT PMO" Kanban board (internal demo/training tool for a fictitious bank). The whole app is `index.html`: markup, a `<style>` block and a `<script>` block. There is no build, lint, package manager or test suite.

- Run: open `index.html` directly in a browser (works from `file://`; no server needed).
- Headless check: Playwright and Chromium are preinstalled (`/opt/node22/lib/node_modules/playwright`, browser at `/opt/pw-browsers/chromium`). Launch with `executablePath: '/opt/pw-browsers/chromium'`; do not run `playwright install`.

## Hard constraints (from the original brief)

- Vanilla HTML/CSS/JS only: no frameworks, bundler, npm, CDN scripts, web fonts or image files. System font stack and inline SVG/Unicode for icons.
- No persistence of any kind: no localStorage, sessionStorage, IndexedDB or cookies. A refresh resets to the seeded demo data, and the UI says so.
- No real bank logo or branding. The header is a neutral "IT PMO" text wordmark in a blue palette. The `UOB-ITPM-####` task ID format and the `[UOB IT PMO]` email subject are specified by the brief and intentionally kept.
- The only network call is the FormSubmit AJAX endpoint (`notifyNewTask`). Its email address lives only in the `FORMSUBMIT_ENDPOINT` constant.
- CSS uses custom properties and no `!important`.

## Architecture

- Single source of truth: `state = { tasks, filters, nextSeq, ui }`. `ui` holds transient interaction state (drag id, open move menu, delete-confirm id, focus key) that must survive re-renders.
- Rendering is always rebuilt from state: `render()` calls `renderBoard()` (columns and cards via `innerHTML`) and `renderSummary()`. Do not mutate card DOM directly. Every dynamic string must go through `escapeHtml()`.
- All mutations go through `addTask` / `moveTask` / `deleteTask`, each of which updates `state` and then re-renders. Filter changes call only `renderBoard()`, because the summary strip counts all tasks, not the filtered ones.
- Event handling is delegated on `#board` (click, keydown, and the drag events), so handlers survive the `innerHTML` rebuilds. Drag-and-drop only acts when `state.ui.dragId` is set. The keyboard fallback is the "Move ▸" menu, with Escape to cancel.
- Focus is restored after re-renders via `data-focus` keys plus `state.ui.focusKey` (`restoreFocus()`). New card controls that need to keep focus must follow this pattern.
- Submit flow (`handleSubmit`): validate (`validateTask`), then optimistically add the card, reset the form and show a toast, then await `notifyNewTask`. A FormSubmit failure only shows a warning toast and never affects the board. While `FORMSUBMIT_ENDPOINT` still contains the `YOUR_EMAIL@example.com` placeholder, `notifyNewTask` throws without making a request.
- Seed task dates are computed relative to today (`addDays`), so the demo always has some overdue items. Overdue means `status !== "Done"` and `dueDate < todayISO()`, using local-date ISO string comparison.
- Layout: the Add Task panel is a toggled sidebar at ≥1100px and stacks above the board below that. The board is 4 columns, stacking to 1 column below 768px.
