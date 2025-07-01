# Businessly: Your AI-Powered Business Command Center

![Businessly Logo](front-end/public/logo-text.png)

## Table of Contents

*   [Introduction](#introduction)
*   [Features](#features)
*   [Technology Stack](#technology-stack)
*   [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Environment Variables](#environment-variables)
    *   [Running the Application](#running-the-application)
*   [Project Structure](#project-structure)
*   [Contributing](#contributing)
*   [License](#license)

## Introduction

**Businessly** is a cutting-edge, AI-powered business management platform designed to empower Small and Medium-sized Enterprises (SMEs) and startups. It provides a unified, intuitive interface for integrating and managing Artificial Intelligence across core departmental functions, including Marketing, Support, HR, Finance, and Operations. By centralizing AI capabilities, Businessly enables businesses to streamline operations, make data-driven decisions, and unlock new levels of efficiency and growth.

## Features

Businessly offers a robust suite of features to enhance business operations:

*   **Centralized AI Module Management:** Dedicated AI modules for Marketing, Support, HR, Finance, and Operations, each with specialized AI functionalities.
*   **AGI Assistant:** A core AI command center for general AI consultations and task execution.
*   **Intuitive Executive Dashboard:** Provides a high-level overview of key performance indicators (KPIs), revenue trends, departmental performance, and AI-driven strategic insights.
*   **Module Configuration:** User-friendly forms for configuring AI parameters, budgets, audiences, and task assignments.
*   **Reflect-AI Loop:** An interactive chat interface for iterative AI consultation, feedback, and refinement of AI-generated outputs.
*   **Real-time Updates:** Leveraging Supabase Realtime subscriptions for instant updates on AI runs and system activities.
*   **Comprehensive Data & Analytics:** Dynamic data fetching and AI-generated actionable insights to guide business decisions.
*   **Robust User Authentication & Permissions:** Secure login and session management with Supabase Auth, supporting distinct Admin and Operator roles.
*   **Client Management:** Functionality to add and manage client information.
*   **Reporting & Export Capabilities:** Generate and export reports for AI run results and departmental performance.
*   **Responsive Design:** Optimized for seamless experience across all devices.

## Technology Stack

Businessly is built on a modern and scalable technology stack:

*   **Frontend:**
    *   **Framework:** Next.js 15 (React)
    *   **UI:** TailwindCSS, Shadcn/UI, Lucide-react
    *   **State Management:** React Query (data fetching), Zustand (local state)
    *   **Animations:** Framer Motion
    *   **Forms & Validation:** React Hook Form, Zod
*   **Backend:**
    *   **Framework:** Node.js with Express.js
    *   **Database:** Supabase (PostgreSQL)
    *   **Authentication:** Supabase Auth (JWT)
*   **AGI Service:**
    *   **Language:** Python
    *   **Framework:** FastAPI (implied by typical Python web services)

## Getting Started

Follow these instructions to set up and run Businessly locally.

### Prerequisites

*   Node.js (v18 or higher)
*   npm or pnpm
*   Python (v3.9 or higher)
*   Docker (for `agi-service` and `docker-compose`)
*   Supabase Account: You will need a Supabase project URL and API keys.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/ncs-hack.git
    cd ncs-hack
    ```

2.  **Frontend Setup:**
    ```bash
    cd front-end
    pnpm install # or npm install
    ```

3.  **Backend Setup:**
    ```bash
    cd ../back-end
    npm install
    ```

4.  **AGI Service Setup:**
    ```bash
    cd ../agi-service
    pip install -r requirements.txt
    # Or build and run with Docker (recommended for production)
    ```

### Environment Variables

Create `.env.local` files in `front-end/` and `.env` in `back-end/` with the following:

**`front-end/.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

**`back-end/.env`:**

```env
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
# Add any other backend-specific environment variables here
```

### Running the Application

It is recommended to use `docker-compose` for a streamlined setup.

1.  **Start all services with Docker Compose:**
    ```bash
    docker-compose up --build
    ```

    This will build and run the frontend, backend, and AGI services.

2.  **Alternatively, run services individually:**

    *   **Frontend:**
        ```bash
        cd front-end
        pnpm dev # or npm run dev
        ```
        The frontend will be accessible at `http://localhost:3000`.

    *   **Backend:**
        ```bash
        cd back-end
        npm start
        ```
        The backend API will typically run on `http://localhost:5000` (check `back-end/app.js` for exact port).

    *   **AGI Service:**
        ```bash
        cd agi-service
        python main.py # Or use uvicorn if using FastAPI
        ```
        The AGI service will run on its configured port (check `agi-service/main.py`).

## Project Structure

```
ncs-hack/
├── front-end/          # Next.js application (React, UI)
├── back-end/           # Node.js/Express API (Data, Business Logic)
├── agi-service/        # Python AI Agent Service (AI Models, Tools)
├── docker-compose.yml  # Orchestration for all services
├── README.md           # Project overview
└── submition.md        # Project pitch document
```

## Contributing

We welcome contributions! Please see our `CONTRIBUTING.md` (if available) for guidelines on how to contribute to this project.


