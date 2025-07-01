# Technical Documentation

## 1. System Architecture

The application follows a classic client-server architecture:

*   **Frontend**: A Next.js application responsible for the user interface and user experience.
*   **Backend**: An Express.js server that handles business logic, data processing, and communication with the database.
*   **Database**: Supabase (PostgreSQL) for data storage, real-time updates, and authentication.

## 2. Project Structures

### 2.1. Frontend (`/front-end`)

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Global layout (nav, footer)
│   ├── page.tsx              # Landing page / login redirect
│   ├── add-client/           # Page for adding a new client
│   │   └── page.tsx
│   ├── api/                  # API routes for server-side functions
│   │   └── [...]
│   └── content-studio/       # Content studio page
│       └── page.tsx
├── components/               # UI components
│   ├── ui/                   # Shadcn/UI components
│   ├── departments/          # Department-specific components
│   └── [...]
├── hooks/                    # Custom React hooks
├── lib/                      # Library files (Supabase client, utils)
├── public/                   # Static assets
└── styles/                   # Global styles
```

### 2.2. Backend (`/back-end`)

```
back-end/
├── controllers/              # Request handlers
│   ├── agent.js
│   ├── campaigns.js
│   ├── clients.js
│   └── [...]
├── middleware/               # Express middleware (e.g., auth)
│   └── auth.js
├── model/                    # Database models and queries
│   └── db.js
├── routes/                   # API routes
│   ├── agent.js
│   ├── auth.js
│   └── [...]
├── .env                      # Environment variables
└── app.js                    # Express application entry point
```

## 3. Supabase Schema

### `users`

*   `id` (uuid, primary key): User ID
*   `email` (varchar, unique): User's email
*   `password` (varchar): Hashed password
*   `role` (varchar): User role (e.g., `admin`, `operator`)
*   `created_at` (timestampz)

### `clients`

*   `id` (uuid, primary key): Client ID
*   `name` (varchar): Client's name
*   `user_id` (uuid, foreign key to `users.id`): The user who added the client
*   `created_at` (timestampz)

### `campaigns`

*   `id` (uuid, primary key): Campaign ID
*   `name` (varchar): Campaign name
*   `client_id` (uuid, foreign key to `clients.id`)
*   `budget` (numeric)
*   `created_at` (timestampz)

### `content_ideas`

*   `id` (uuid, primary key): Content Idea ID
*   `title` (varchar): Title of the content idea
*   `description` (text): Description of the content idea
*   `campaign_id` (uuid, foreign key to `campaigns.id`)
*   `created_at` (timestampz)

### `runs`

*   `id` (uuid, primary key): Run ID
*   `agent_name` (varchar): Name of the AI agent
*   `status` (varchar): `pending`, `running`, `completed`, `failed`
*   `result` (jsonb): The output of the AI agent
*   `created_at` (timestampz)

## 4. Authentication

Authentication is handled by Supabase Auth. The flow is as follows:

1.  The user signs up or logs in via the front-end.
2.  Supabase returns a JWT (JSON Web Token).
3.  The JWT is stored securely in the browser.
4.  For every request to the back-end, the JWT is sent in the `Authorization` header.
5.  The back-end `auth.js` middleware verifies the JWT with Supabase.
6.  If the JWT is valid, the request is processed; otherwise, a 401 Unauthorized error is returned.

## 5. API Endpoints

A summary of the main API endpoints:

*   **`POST /api/auth/signup`**: Create a new user.
*   **`POST /api/auth/login`**: Log in a user.
*   **`GET /api/clients`**: Get all clients for the logged-in user.
*   **`POST /api/clients`**: Create a new client.
*   **`GET /api/campaigns`**: Get all campaigns for a client.
*   **`POST /api/campaigns`**: Create a new campaign.
*   **`POST /api/agent/run`**: Start a new AI agent run.
