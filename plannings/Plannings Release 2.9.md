# Planning: Release 2.9 (Kanban Update)

## Core Feature: The Cyber-Kanban Board

The goal for Release 2.9 is to introduce an alternative view to the standard dashboard list: a **Kanban Board** that maps directly to the operative's task statuses.

In Release 2.8, the ability to define custom "Task Statuses" was introduced (e.g., "In Progress", "Under Review", "Blocked"). The Kanban Board will leverage this structure.

### 1. Board Structure & Columns
*   **Dynamic Columns:** The board dynamically generates columns based on the user's defined statuses.
    *   **Column 1 (Fixed):** `OPEN` (Tasks with `status = 0` and `workflow_status = 'open'`).
    *   **Column 2...N (Dynamic):** Custom statuses pulled from `user_task_statuses` (e.g., `IN PROGRESS`, `QA`).
    *   **Column N+1 (Fixed):** `COMPLETED` (Tasks with `status = 1` and `workflow_status = 'completed'`).
*   **Visual Design:** Deeply integrated into the current theme system (`THEME_GUIDELINES.md`). The board container supports horizontal scrolling (`overflow-x-auto`). Completed cards are visually distinct (grayscale, line-through text).
*   **Internationalization (i18n):** All Kanban-related UI strings (buttons, drop zones, tooltips) are translated across the 23 supported languages (including Klingon).

### 2. Interactions (Drag & Drop)
*   **@dnd-kit Integration:** We use `@dnd-kit/core` with pointer and keyboard sensors to handle drag-and-drop between columns.
*   **Moving Cards:** 
    *   Dragging a card into a new column makes an API call to assign that `workflow_status`.
    *   Dragging a card into the final `COMPLETED` column triggers the completion logic (`status = 1`, `workflow_status = 'completed'`).
    *   Dragging a card OUT of the `COMPLETED` column reverts its completion status (`status = 0`).
*   **Card Actions:** Cards feature a hover-state delete button that triggers a CyberConfirm modal for permanent deletion.

### 3. UI/UX Integration (Focus Mode Pattern)
*   **Kanban Toggle Button:** A `KANBAN` button is placed in the main dashboard header, styled to match the theme.
*   **Overlay Panel & Navigation:** When toggled on, the Kanban Board mounts as a full-screen overlay over the UI.
*   **Exiting the View:** The top navigation contains an `EXIT KANBAN` button with downward-pointing tooltips. Clicking this returns the user to the standard List View.
*   **State Management:** The active state (`isKanbanMode`) is managed locally in the React state.

### 4. Technical Re-use
*   **Backend:** Minimal changes needed. The logic relies on existing endpoints.
*   **Frontend:** The main work is creating `KanbanBoard.jsx`, `KanbanColumn.jsx`, and a compact `KanbanCard.jsx`, wrapping them in `@dnd-kit` contexts.
