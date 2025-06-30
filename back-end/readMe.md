# Backend API Requirements for Executive Dashboard

This document outlines the API endpoints required by the frontend's Executive Dashboard to fetch dynamic data. All endpoints should be accessible via GET requests and return JSON data.

## 1. KPI Metrics

**Endpoint:** `/api/dashboard/kpi-metrics`
**Method:** `GET`
**Query Parameters:**
*   `timeframe`: (string) - Expected values: `7d`, `30d`, `90d`, `1y`.

**Expected Response Body (JSON Array):**

```json
[
  {
    "title": "Total Revenue",
    "value": "$2.4M",
    "change": "+18.2%",
    "trend": "up",
    "icon": "DollarSign",
    "color": "from-emerald-500 to-emerald-600",
    "description": "vs last quarter"
  },
  {
    "title": "Conversion Rate",
    "value": "4.8%",
    "change": "-2.3%",
    "trend": "down",
    "icon": "Target",
    "color": "from-purple-500 to-purple-600",
    "description": "needs attention"
  },
  {
    "title": "Customer Satisfaction",
    "value": "94.2%",
    "change": "+5.7%",
    "trend": "up",
    "icon": "Star",
    "color": "from-amber-500 to-amber-600",
    "description": "excellent rating"
  }
]
```

## 2. Revenue & Profit Trends

**Endpoint:** `/api/dashboard/revenue`
**Method:** `GET`
**Query Parameters:**
*   `timeframe`: (string) - Expected values: `7d`, `30d`, `90d`, `1y`.

**Expected Response Body (JSON Array):**

```json
[
  { "month": "Jan", "revenue": 45000, "expenses": 32000, "profit": 13000 },
  { "month": "Feb", "revenue": 52000, "expenses": 35000, "profit": 17000 },
  { "month": "Mar", "revenue": 48000, "expenses": 33000, "profit": 15000 },
  { "month": "Apr", "revenue": 61000, "expenses": 38000, "profit": 23000 },
  { "month": "May", "revenue": 55000, "expenses": 36000, "profit": 19000 },
  { "month": "Jun", "revenue": 67000, "expenses": 41000, "profit": 26000 }
]
```

## 3. Department Performance

**Endpoint:** `/api/dashboard/department-performance`
**Method:** `GET`
**Query Parameters:**
*   `timeframe`: (string) - Expected values: `7d`, `30d`, `90d`, `1y`.

**Expected Response Body (JSON Array):**

```json
[
  { "name": "Marketing", "value": 85, "color": "#8B5CF6" },
  { "name": "Sales", "value": 92, "color": "#06D6A0" },
  { "name": "Support", "value": 78, "color": "#F59E0B" },
  { "name": "Operations", "value": 88, "color": "#EF4444" },
  { "name": "HR", "value": 82, "color": "#3B82F6" }
]
```

## 4. AI Strategic Insights

**Endpoint:** `/api/dashboard/ai-insights`
**Method:** `GET`
**Query Parameters:**
*   `timeframe`: (string) - Expected values: `7d`, `30d`, `90d`, `1y`.

**Expected Response Body (JSON Array):**

```json
[
  {
    "department": "Marketing",
    "icon": "BarChart3",
    "insight": "Campaign ROI increased by 34% this month. AI suggests reallocating 15% more budget to social media channels for optimal performance.",
    "priority": "high",
    "impact": "+$12K potential revenue",
    "confidence": 94,
    "action": "Optimize Budget Allocation",
    "trend": "up"
  },
  {
    "department": "Support",
    "icon": "MessageSquare",
    "insight": "Customer satisfaction dropped 8% due to response time delays. AI recommends implementing automated triage system.",
    "priority": "urgent",
    "impact": "Prevent 23% churn risk",
    "confidence": 89,
    "action": "Deploy Auto-Triage",
    "trend": "down"
  },
  {
    "department": "Sales",
    "icon": "Target",
    "insight": "Q2 pipeline shows 127% growth potential. AI identifies 34 high-value prospects requiring immediate attention.",
    "priority": "medium",
    "impact": "+$89K projected revenue",
    "confidence": 91,
    "action": "Focus on Hot Leads",
    "trend": "up"
  },
  {
    "department": "Operations",
    "icon": "Settings",
    "insight": "Process efficiency improved 19% with new automation. AI suggests expanding to 3 additional workflows.",
    "priority": "medium",
    "impact": "Save 12 hours/week",
    "confidence": 87,
    "action": "Scale Automation",
    "trend": "up"
  },
  {
    "department": "HR",
    "icon": "Users",
    "insight": "Employee engagement scores indicate 15% improvement needed in remote work satisfaction.",
    "priority": "low",
    "impact": "Reduce turnover by 8%",
    "confidence": 83,
    "action": "Enhance Remote Culture",
    "trend": "neutral"
  }
]
```

## 5. Database Integration (Supabase)

The backend utilizes **Supabase** as its primary database solution. Supabase provides a PostgreSQL database, real-time capabilities, and authentication.

**Key aspects of Supabase integration:**

*   **Database Type**: PostgreSQL
*   **Access Method**: The backend interacts with Supabase using its client libraries or direct API calls.
*   **Environment Variables**:
    *   `SUPABASE_URL`: The URL of your Supabase project.
    *   `SUPABASE_ANON_KEY`: Your Supabase public anon key.
    *   `SUPABASE_SERVICE_ROLE_KEY`: (For backend-only operations) Your Supabase service role key, which has elevated privileges.
    *   `SUPABASE_JWKS_URI`: (For JWT verification) The JWKS URI for Supabase, used to verify JWTs issued by Supabase Auth.

**Relevant Tables for Frontend Functionality:**

*   **`users`**: (Managed by Supabase Auth) Stores user authentication data.
*   **`clients`**: (New table for "Add Client" feature) This table will store information about clients, including:
    *   `id` (UUID, Primary Key)
    *   `name` (Text, required)
    *   `niche` (Text, required)
    *   `contact_person` (Text)
    *   `contact_email` (Text)
    *   `notes` (Text)
    *   `created_at` (Timestamp with timezone, default now())

**Backend API for Clients (Proposed):**

*   **Endpoint:** `/api/clients`
*   **Method:** `POST`
*   **Description:** Adds a new client to the `clients` table.
*   **Request Body (JSON):**
    ```json
    {
      "name": "Client Name",
      "niche": "Marketing",
      "contact_person": "John Doe",
      "contact_email": "john.doe@example.com",
      "notes": "Important notes about the client."
    }
    ```
*   **Expected Response Body (JSON):**
    ```json
    {
      "message": "Client added successfully",
      "client_id": "uuid-of-new-client"
    }
    ```
    (Or the full client object if preferred)