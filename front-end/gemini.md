**AI Manager Platform – Front-End Design Doc**

**1. Objective & Context**

*   Provide an intuitive Next.js 15 interface to manage AI modules (Marketing, Support, HR, Finance, Operations).
*   Ensure a fluid, responsive, secure experience suitable for an SME or startup.

**2. Architecture & Stack**

*   **Framework**: Next.js 15 (React, SSR/ISR, file-based routing)
*   **UI**: TailwindCSS + Shadcn/UI + Lucide-react
*   **State Management**: React Query (for data fetching) + Zustand (for local state)
*   **Data Fetching**:
    *   `useSWR` or React Query on `/api/*`
    *   Supabase JS client for Realtime subscriptions on the `runs` table
*   **Auth**: Supabase Auth (JWT) + Next.js middleware
*   **Animations**: Framer Motion (page transitions, loading)
*   **Forms & Validation**: React Hook Form + Zod

**3. Project Structure**

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # global layout (nav, footer)
│   ├── page.tsx              # landing / login redirect
│   ├── middleware.ts         # auth enforcement
│   ├── dashboard/            # /dashboard, list of departments
│   └── departments/
│       └── [name]/
│           ├── page.tsx      # module configuration page
│           └── validation/   # Reflect-AI loop
├── components/               # UI atoms & modules
│   ├── ui/                   # shadcn/ui overrides
│   ├── AgentForm.tsx         # AI param form
│   ├── ChatBox.tsx           # Reflect-AI loop
│   └── ModuleCard.tsx        # module card
├── lib/
│   ├── supabaseClient.ts     # Supabase JS initialization
│   └── api.ts                # fetch wrappers for Express
├── hooks/
│   └── useRuns.ts            # real-time runs abstraction
├── styles/
│   └── globals.css           # Tailwind import
└── utils/
    └── animations.ts         # Framer Motion animations
```

**4. Key Points & Best Practices**

*   Strict TypeScript in all modules.
*   Atomic CSS via Tailwind, reusable components.
*   SSR/ISR for the dashboard (performance & SEO not critical).
*   Supabase Realtime for official updates.

**5. Detailed Branches**

*   **Admin**
    *   Dashboard → Department selection
    *   Module configuration (budget, audience, assignment)
    *   Launch AI run → create Supabase record
    *   Supervision via real-time subscription
    *   Export & Reporting (PDF or automated)
*   **Operator**
    *   Login & Desk access (assigned modules)
    *   Module details → briefing and configuration
    *   Reflect-AI loop: AI consultation, feedback, iteration
    *   Final validation (acceptance/rejection)
    *   Export result (PDF or link sharing)

**6. Features to Develop**

| Feature                               | Endpoint / Component   | Main Role |
| ------------------------------------- | ---------------------- | --------- |
| **Auth & Permissions**                | `/api/auth/*`          | Dev 1     |
| **List Departments & Modules**        | `/api/departments`     | Dev 1     |
| **Launch an AI run**                  | `/api/agent/run`       | Dev 2     |
| **Feedback & Iteration**              | `/api/agent/feedback`  | Dev 3     |
| **Realtime Updates (Supabase Subs)**  | `useRuns` hook         | Dev 3     |
| **Export PDF**                        | `/api/export/pdf`      | Dev 4     |
| **Dashboard & UI Modules**            | `dashboard/page.tsx`   | Dev 2     |
| **Module Configuration Form**         | `AgentForm.tsx`        | Dev 2     |
| **ChatBox Reflect-AI**                | `ChatBox.tsx`          | Dev 3     |
| **Error Handling & Logs**             | Middleware + UI Alerts | Dev 1 & 4 |

**7. AI Coding Rules & Best Practices**

To ensure concise, maintainable, and "senior-level" quality code, the AI must follow these rules during generation or refactoring:

1.  **Explicit and consistent naming**: Use camelCase for variables/functions, PascalCase for React components, and meaningful names (e.g., `fetchAgentRuns`, `AgentForm`).
2.  **Atomic functions and components**: Each function/component must have a single responsibility and not exceed 50 lines.
3.  **Strict typing (TypeScript)**: Systematically define input/output types, avoid `any`, and prefer reusable interfaces and types.
4.  **Modularity & Reusability**: Extract reusable logic into `hooks/`, `lib/`, or `utils/`, and avoid duplicated code.
5.  **Unit & integration tests**: Provide a minimum coverage of 80% for each AI module, using Jest + React Testing Library + supertest.
6.  **Validation & schemas**: Validate input data with Zod (frontend) and Zod middleware (backend).
7.  **Useful documentation & comments**: Always comment the signature of complex functions, and write JSDoc for the export of critical modules.
8.  **Linting & formatting**: Respect ESLint + Prettier (shared configuration), and fix warnings before merging.
9.  **Performance & lazy loading**: Use `dynamic()` for heavy components, and optimize imports and the bundle.
10. **Structured logs & traceability**: Use `console.debug/info/warn/error` consistently, and format logs in JSON if possible to facilitate debugging.

---
# Project Plan: NCS-HACK Front-End Development

## 1. Project Goal

To create a modern, responsive, and user-friendly front-end for the NCS-HACK application.

## 2. Core Modules

The application will be composed of several key modules:

*   **User Authentication:** Secure login and registration functionality.
*   **Main Page:** The central hub of the application, providing access to all features.
*   **About Page:** Information about the project and its team.
*   **Contact Page:** A form for users to send feedback and inquiries.

## 3. Technology Stack

The project will be built using the following technologies:

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn

## 4. Development Tasks

The development process will be broken down into the following tasks:

### Task 1: Foundational Setup

*   **1.1. Initialize Project:** Set up a new Next.js project with TypeScript and Tailwind CSS.
*   **1.2. Install Dependencies:** Add and configure `shadcn` for UI components.
*   **1.3. Project Structure:** Organize the directory structure for scalability and maintainability.
*   **1.4. Basic Layout:** Create a global layout with a header, footer, and main content area.

### Task 2: Authentication Module

*   **2.1. Login Page:** Design and implement the login form.
*   **2.2. Registration Page:** Design and implement the registration form.
*   **2.3. Authentication Logic:** Integrate with the backend API for user authentication.
*   **2.4. Session Management:** Implement session management to keep users logged in.

### Task 3: Main Page Module

*   **3.1. Main Page UI:** Design and implement the main page layout.
*   **3.2. Feature Integration:** Add components for accessing the application's features.
*   **3.3. Data Display:** Fetch and display data from the backend API.

### Task 4: Static Pages

*   **4.1. About Page:** Create the About Page with project and team information.
*   **4.2. Contact Page:** Create the Contact Page with a functional contact form.

### Task 5: Refinement and Deployment

*   **5.1. Responsive Design:** Ensure the application is fully responsive on all devices.
*   **5.2. Testing:** Write unit and integration tests to ensure code quality.
*   **5.3. Deployment:** Deploy the application to a production environment.

---
## To-Do List:

1.  Add functionality to the dashboard.
2.  Fix the departments that we will have.
3.  Start coding the UI of each department.
4.  Start implementing the functionality for each department.
5.  Add login authentication with Supabase integration.