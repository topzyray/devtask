# DevTask

DevTask is a small task dashboard for daily engineering work. You can create, edit, and delete tasks, then review them on a dashboard, in a list, or on a three-column board. Counts, overdue work, and completion stay in sync, and tasks come back from the browser after a refresh.

This is the project for **Challenge 1: Build a Mini App with Cursor** and **Use GitHub Copilot to Build a Simple Application**.

## Features

- Create, edit, and delete tasks with a title, description, priority, due date, and status.
- Priorities are low, medium, and high. Statuses are pending, in progress, and completed.
- Dashboard totals for all tasks, pending, in progress, completed, overdue, and completion percentage.
- List view and a kanban board. On a wide screen, cards can be dragged between columns. Every card also has a status control.
- Search by title, filter by status and priority, and sort by due date or creation date.
- Tasks persist in `localStorage` under `devtask.tasks`. The theme persists under `devtask.theme`.
- Unreadable saved data is discarded. If a saved list mixes valid and invalid tasks, the valid tasks are kept and the invalid ones are removed.
- Light and dark themes, a responsive sidebar, labeled form controls, and a confirmation step before deletion.

## How a task is counted

A task is overdue when it has a real due date before today and its status is not completed. A task due today is not overdue. A completed task with a past due date is not overdue.

Completion percentage is completed tasks divided by the total, rounded to the nearest whole number. An empty list is 0%.

Search matches the title only. Status, priority, and search filters apply together. Tasks with no due date sort after dated tasks.

## Stack

- React 19 and TypeScript
- Vite
- Tailwind CSS
- Zustand for task, view, and theme state
- Zod for form and stored-data validation
- Vitest and jsdom for unit tests
- Cursor, Github Copilot

No environment variables are required.

## Getting started

```bash
npm install
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`.

Production build:

```bash
npm run build
npm run preview
```

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Typecheck and build for production |
| `npm run test` | Run unit tests once |
| `npm run lint` | Run ESLint |
| `npm run preview` | Serve the production build |

## Architecture

```text
src/
  features/
    tasks/     types, Zod schemas, task logic, persistence, Zustand store, UI
    layout/    shell, sidebar, dialogs, view state
    theme/     light and dark theme state
  lib/         shared date and class helpers
```

Task types live in `src/features/tasks/types.ts`. Zod schemas live in `src/features/tasks/schema.ts`. The Zustand store in `src/features/tasks/store.ts` calls `src/features/tasks/persistence.ts` for `localStorage`, so the UI does not read or write storage itself.

## Tests

`npm run test` covers task creation, updates, deletion, filtering and sorting, dashboard math, calendar dates, saving and restoring tasks, and invalid stored data.

## Challenge submission

Copy these into the submission form.

**Project name**

DevTask

**Project URL**

https://github.com/topzyray/devtask

**Description**

Cursor scaffolded DevTask, a browser task dashboard with create, edit, and delete, a stats overview, list and kanban views, and localStorage persistence. It also helped debug date validation, corrupt saved data, filters, and the responsive layout until the production build and the unit tests passed.

**Technologies used**

React, TypeScript, Vite, Tailwind CSS, Zustand, Zod, Vitest

Upload a screenshot of the running app with the form. The app stores tasks only in the browser, so a fresh visit starts with an empty list.
