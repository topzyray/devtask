# DevTask

DevTask is a task dashboard for organising daily engineering work. Create, edit, and delete tasks, then review them in a list or a three-column board. Counts, overdue work, and completion stay in sync, and tasks are restored from the browser after a refresh.

## Features

- Create, edit, and delete tasks with a title, description, priority, due date, and status.
- Priorities are low, medium, and high. Statuses are pending, in progress, and completed.
- Dashboard totals for all tasks, pending, in progress, completed, overdue, and completion percentage.
- List and kanban views. The board supports drag-and-drop and a status control on each card.
- Search by title, filter by status and priority, and sort by due date or creation date.
- Tasks persist in `localStorage`. Invalid or unreadable saved data is discarded and the app starts from an empty list.
- Light and dark themes, a responsive sidebar, accessible form controls, and a confirmation step before deletion.

## Stack

React, TypeScript, Vite, Tailwind CSS, Zustand, Zod, and Vitest.

No environment variables are required.

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints, usually `http://localhost:5173`.

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
    tasks/          types, Zod schemas, task logic, persistence, Zustand store, UI
    layout/         shell, sidebar, dialogs, view state
    theme/          light and dark theme state
  lib/              shared date and class helpers
```

Task types live in `src/features/tasks/types.ts`. Zod schemas live in `src/features/tasks/schema.ts`. The Zustand store in `src/features/tasks/store.ts` calls `src/features/tasks/persistence.ts` for `localStorage`, so the UI does not read or write storage itself.

Saved tasks use the key `devtask.tasks`. The theme uses `devtask.theme`.

A task is overdue when it has a due date before today and its status is not completed. Completion percentage is completed tasks divided by the total, rounded to the nearest whole number. An empty list is 0%.

## Tests

Unit tests cover task creation, updates, deletion, filtering and sorting, saving and restoring tasks, and invalid stored data.
