## Project Plan: NCS-HACK Front-End Development

---

**Phase 1: Backend Dashboard API Development (Mock Data First)**

*   **Goal:** Provide the necessary API endpoints for the `ExecutiveDashboard` component to display data.
*   **Tasks:**
    *   **1.1 Create `back-end/routes/dashboard.js`:** Define routes for `/revenue`, `/department-performance`, `/ai-insights`, and `/kpi-metrics`.
    *   **1.2 Create `back-end/controllers/dashboard.js`:** Implement placeholder functions for `getRevenueData`, `getDepartmentPerformance`, `getAiInsights`, and `getKpiMetrics`. For initial development, these functions will return **mock data** that matches the expected structure of the `ExecutiveDashboard.tsx` component.
    *   **1.3 Integrate `dashboard` routes into `back-end/app.js`:** Add `app.use('/api/dashboard', dashboardRoutes);` to `app.js`.
*   **Verification:** Run the backend server and use `curl` or a similar tool to test each new `/api/dashboard/*` endpoint, verifying they return the expected mock data.

---

**Phase 2: Frontend Dashboard Integration**

*   **Goal:** Connect the `ExecutiveDashboard` component to the new backend APIs and display real (mock) data.
*   **Tasks:**
    *   **2.1 Modify `front-end/components/executive-dashboard.tsx`:** Update the `useEffect` hooks for `revenueData`, `departmentPerformance`, `aiInsights`, and `kpiMetrics` to call the new backend APIs (`/api/dashboard/*`). Remove the hardcoded sample data from these `useEffect` hooks.
*   **Verification:** Run both the backend and frontend applications. Verify that the `ExecutiveDashboard` now displays the data fetched from the backend (which is currently mock data).

---

**Phase 3: Database Schema for Dashboard Data & Backend Refinement**

*   **Goal:** Define and implement the database schema for the dashboard metrics and update the backend to fetch real data.
*   **Tasks:**
    *   **3.1 Propose Database Schema:** Provide SQL `CREATE TABLE` statements for `revenue_data`, `department_performance`, `ai_insights`, and `kpi_metrics` tables. (You will need to apply these to your Supabase project manually).
    *   **3.2 Update `back-end/controllers/dashboard.js`:** Modify the controller functions to query the actual database tables instead of returning mock data.
*   **Verification:** After applying schema changes and populating with sample data in Supabase, run backend and frontend, and verify the dashboard displays real data from the database.

---

**Phase 4: Department UI & Basic Functionality**

*   **Goal:** Develop the UI for each department and implement basic configuration/launch functionality.
*   **Tasks:**
    *   **4.1 Review Department Components:** Examine `front-end/components/departments/*.tsx` files.
    *   **4.2 Implement Department UI:** For each department, design and implement the "page paramétrage module" UI, likely using `AgentForm.tsx`.
    *   **4.3 Implement "Lancement d’un run IA" API (`/api/agent/run`):** Create `back-end/routes/agent.js` and `back-end/controllers/agent.js`. Implement the `run` function to create a "run" record in the database. Integrate this API call into the frontend.
*   **Verification:** Navigate to each department page, verify UI, and test the "launch AI run" functionality.

---

**Phase 5: Reflect-AI Loop & Realtime Updates**

*   **Goal:** Implement the interactive Reflect-AI chat loop and real-time updates.
*   **Tasks:**
    *   **5.1 Implement `ChatBox.tsx`:** Integrate `ChatBox.tsx` into department pages. Implement logic for sending user feedback and receiving AI responses.
    *   **5.2 Implement `/api/agent/feedback` API:** Add a `feedback` function to `back-end/controllers/agent.js` to handle AI interaction.
    *   **5.3 Implement Supabase Realtime (`useRuns` hook):** Develop `front-end/hooks/useRuns.ts` to subscribe to real-time updates on the `runs` table. Integrate this hook into the frontend.
*   **Verification:** Test chat functionality and verify real-time updates of AI run statuses.

---

**Phase 6: Authentication and Permissions Refinement**

*   **Goal:** Ensure robust authentication and implement department-level access control.
*   **Tasks:**
    *   **6.1 Review Supabase Auth Integration:** Verify existing Supabase authentication is complete and secure.
    *   **6.2 Implement Department Access Control (Frontend):** Use `user_access` data to conditionally render department links/components.
    *   **6.3 Implement Department Access Control (Backend - if needed):** Ensure department-specific APIs are protected based on `user_access` permissions.
*   **Verification:** Test with different user roles to ensure correct department visibility and access.

---

**Phase 7: Additional Features & Polish**

*   **Goal:** Implement remaining features and ensure overall quality.
*   **Tasks:**
    *   **7.1 Export PDF:** Implement `back-end/routes/export.js` and `back-end/controllers/export.js` for `/api/export/pdf`. Integrate into frontend.
    *   **7.2 Error Handling & Logging:** Implement global error handling (backend) and consistent logging (frontend/backend).
    *   **7.3 Testing:** Write unit and integration tests.
    *   **7.4 Responsive Design & Performance:** Optimize responsive design and performance.
    *   **7.5 Code Quality:** Ensure adherence to "AI Coding Rules & Best Practices."
