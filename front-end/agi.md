# Agi: The AI Agent Mode - Technical Proposal & Roadmap (v2)

## 1. Vision & Feasibility Analysis

**Vision:** To create a conversational, AI-powered agent, codenamed "Agi," that serves as a central command interface for the entire application. Users will be able to perform any action—from data entry to complex workflow automation—through natural language commands.

**Feasibility:** **This is highly feasible.** The architecture is sound and aligns with modern AI agent design patterns. The primary challenges are in the implementation details of intent recognition, state management, and security, which this plan explicitly addresses.

## 2. Proposed Architecture

We will adopt a microservice-oriented approach, separating the agent's reasoning from the core application logic.

1.  **Frontend (Next.js):** The existing UI, enhanced with a new dedicated chat component for Agi.
2.  **Backend API (Node.js/Express):** The existing backend, serving as the execution layer (the "muscle").
3.  **Agi Agent Service (Python/FastAPI):** A new microservice that acts as the reasoning layer (the "brain").

**Data Flow:**
```
[User] <--> [Frontend Chat UI] <--> [Agi Agent Service (Python)] <--> [Backend API (Node.js)] <--> [Supabase DB]
```

## 3. The Agi Workflow: Think-Act-Observe Loop

The agent will operate on a continuous loop:

1.  **Listen:** The user provides a prompt.
2.  **Think:** The Agi Service receives the prompt and uses an LLM to decide which "tool" to use based on a structured list of available tools.
3.  **Act:** The Agi Service executes the chosen tool, which calls the appropriate endpoint on our Node.js Backend API.
4.  **Observe:** The Agi Service gets the result from the Backend API.
5.  **Respond:** The agent formulates and sends a natural language response to the user.

### 3.1. Tool Definition & Registration

To ensure the LLM can reliably select the correct action, all available tools will be defined in a structured registry. This metadata will be passed to the LLM in its prompt.

**Example Tool Schema:**
```json
[
  {
    "name": "add_client",
    "description": "Adds a new client to the database. Use this when a user wants to create a new client record.",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "The full name of the client or company."
        },
        "email": {
          "type": "string",
          "description": "The primary email address for the client."
        }
      },
      "required": ["name"]
    }
  },
  {
    "name": "list_clients",
    "description": "Returns a list of all clients in the database.",
    "parameters": {}
  }
]
```

## 4. Security & Guardrails

Security is paramount. We will implement multiple layers of protection:

*   **Tool Allowlist:** The agent can only execute tools that are explicitly defined in the tool registry.
*   **Parameter Validation:** All parameters provided by the LLM will be strictly validated against the tool's schema before execution.
*   **Confirmation Loop:** For destructive actions (e.g., `delete_client`), the agent will be required to ask for user confirmation before proceeding. This will be enforced by a policy layer (`tool.requires_confirmation = true`).
*   **Backend Re-validation:** The Node.js backend will perform its own validation and permission checks, never blindly trusting a request from the Agi service.

## 5. Development Roadmap

### Phase 1: Foundation & Proof of Concept (PoC)
*   **Goal:** Establish the core architecture and prove the end-to-end flow.
*   **Tasks:**
    1.  Scaffold the Python FastAPI service.
    2.  Implement the structured tool registry.
    3.  Define the first tool: `list_clients()`.
    4.  Build the basic agent loop (Think-Act-Observe).
    5.  Create the new chat UI in the frontend.
*   **Outcome:** A user can ask "list my clients" and get a correct response.

### Phase 2: Expanding Core Capabilities (CRUD)
*   **Goal:** Enable the agent to perform all basic Create, Read, Update, and Delete operations.
*   **Tasks:**
    1.  Develop a comprehensive library of tools for all existing API endpoints.
    2.  **Implement the confirmation loop for destructive actions.**
    3.  Refine the meta-prompt for better tool selection.
*   **Outcome:** Full resource management through conversation.

### Phase 3: Advanced Reasoning & Memory
*   **Goal:** Handle multi-step tasks and maintain conversational context.
*   **Tasks:**
    1.  **Integrate a Memory Layer:** Implement a system for storing conversation history (e.g., using Redis or a dedicated Supabase table). This will allow the agent to remember previous turns in the conversation.
    2.  Enhance the agent's planning capabilities to break down complex requests (e.g., "Create a campaign for Acme, then generate three ideas for it").
*   **Outcome:** Agi can handle complex, multi-step workflows.

### Phase 4: Pro-activity & Deployment
*   **Goal:** Deploy a polished, secure, and intelligent agent.
*   **Tasks:**
    1.  Give the agent the ability to suggest next steps.
    2.  Containerize the Python service with Docker.
    3.  Conduct thorough security testing, focusing on prompt injection.
*   **Outcome:** A production-ready AGI agent.

## 6. Key Technologies

*   **Frontend:** Next.js, React, TailwindCSS
*   **Backend API:** Node.js, Express
*   **Agi Agent Service:**
    *   **Language:** Python 3.10+
    *   **Framework:** FastAPI
    *   **Agent SDK Options:**
        *   **LangChain/LlamaIndex:** Fast to prototype, with built-in tool management and memory modules. Recommended to accelerate development.
        *   **Custom Python Client:** Offers full control but requires more boilerplate code for the agent loop and tool management.

This updated plan provides a comprehensive and robust roadmap for developing the Agi feature. It incorporates best practices for security, scalability, and user experience.