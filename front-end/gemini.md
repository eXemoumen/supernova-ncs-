@@rules must follow => 
-you have the right only to modify the font end folder dont node touche the backend fodler 
-ALWAYS  read the code base of the back end folder to get context before modify anything in the front end 
- make sure the front end will alwsay be matchable with the back end @@
 





**AI Manager Platform – Front-End Design Doc**
@rule=> you are allwod only the modify in front end folder DO NOT TOUCHE OR CODE ANYTHING IN BACK END FOLDER 

@rule => always take look on the back end fodler code base and take to context before you start modifying anthing in the code base of the front 
**1. Objectif & Contexte**

* Fournir une interface Next.js 15 intuitive pour piloter les modules IA (Marketing, Support, RH, Finance, Opérations).
* Garantir une expérience fluide, réactive, sécurisée et adaptée à une PME ou startup.

**2. Architecture & Stack**

* **Framework** : Next.js 15 (React, SSR/ISR, routing file-based)
* **UI** : TailwindCSS + Shadcn/UI + Lucide-react
* **State Management** : React Query (fetching data) + Zustand pour le state local
* **Data Fetching** :

  * `useSWR` ou React Query sur `/api/*`
  * Supabase JS client pour Realtime subscriptions sur la table `runs`
* **Auth** : Supabase Auth (JWT) + middleware Next.js
* **Animations** : Framer Motion (transitions pages, chargement)
* **Forms & Validation** : React Hook Form + Zod

**3. Project Structure**

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # global layout (nav, footer)
│   ├── page.tsx              # landing / login redirect
│   ├── middleware.ts         # auth enforcement
│   ├── dashboard/            # /dashboard, liste des départements
│   └── departments/
│       └── [name]/
│           ├── page.tsx      # page paramétrage module
│           └── validation/   # boucle Reflect-AI
├── components/               # UI atoms & modules
│   ├── ui/                   # shadcn/ui overrides
│   ├── AgentForm.tsx         # formulaire param IA
│   ├── ChatBox.tsx           # boucle Reflect-AI
│   └── ModuleCard.tsx        # carte de module
├── lib/
│   ├── supabaseClient.ts     # initialisation Supabase JS
│   └── api.ts                # wrappers fetch vers Express
├── hooks/
│   └── useRuns.ts            # abstraction real-time runs
├── styles/
│   └── globals.css           # Tailwind import
└── utils/
    └── animations.ts         # animations Framer Motion
```


**5. Points Clés & Best Practices**

* TypeScript strict in all modules.
* Atomic CSS via Tailwind, composants réutilisables.
* SSR/ISR pour dashboard (performance & SEO non critique).
* Supabase Realtime pour updates officielles.
 


**Branches détaillées :**

* **Admin**
  • Dashboard → Sélection du département
  • Configuration du module (budget, audience, assignation)
  • Lancement du run IA → création du record Supabase
  • Supervision via real-time subscription
  • Export & Reporting (PDF ou automatisé)

* **Opérateur**
  • Login & accès Desk (modules assignés)
  • Détails module → briefing et paramétrage
  • Boucle Reflect-AI : consultation IA, feedback, itération
  • Validation finale (acceptation/rejet)
  • Export du résultat (PDF ou partage de lien)

**7. Fonctionnalités à développer**

| Fonctionnalité                                | Endpoint / Compo       | Rôle principal |
| --------------------------------------------- | ---------------------- | -------------- |
| **Auth & Permissions**                        | `/api/auth/*`          | Dev 1          |
| **Liste Départements & Modules**              | `/api/departments`     | Dev 1          |
| **Lancement d’un run IA**                     | `/api/agent/run`       | Dev 2          |
| **Feedback & Iteration**                      | `/api/agent/feedback`  | Dev 3          |
| **Realtime Updates (Supabase Subscriptions)** | `useRuns` hook         | Dev 3          |
| **Export PDF**                                | `/api/export/pdf`      | Dev 4          |
| **Dashboard & UI Modules**                    | `dashboard/page.tsx`   | Dev 2          |
| **Formulaire de paramétrage module**          | `AgentForm.tsx`        | Dev 2          |
| **ChatBox Reflect-AI**                        | `ChatBox.tsx`          | Dev 3          |
| **Gestion des erreurs & logs**                | Middleware + UI Alerts | Dev 1 & Dev 4  |

**8. AI Coding Rules & Best Practices**

Pour garantir un code concis, maintenable et de qualité « niveau senior », l’IA doit suivre ces règles lors de la génération ou de la refactorisation :

1. **Nommage explicite et cohérent** : utiliser le camelCase pour les variables/fonctions, PascalCase pour les composants React, et des noms significatifs (ex : `fetchAgentRuns`, `AgentForm`).
2. **Fonctions et composants atomiques** : chaque fonction/composant doit avoir une responsabilité unique et ne pas dépasser 50 lignes.
3. **Typage strict (TypeScript)** : définir systématiquement les types d’entrée/sortie, éviter `any`, privilégier les interfaces et types réutilisables.
4. **Modularité & Réutilisation** : extraire la logique réutilisable dans `hooks/`, `lib/` ou `utils/`, éviter le code dupliqué.
5. **Tests unitaires & d’intégration** : fournir une couverture minimale de 80 % pour chaque module IA, utiliser Jest + React Testing Library + supertest.
6. **Validation & schémas** : valider les données d’entrée avec Zod (frontend) et middleware Zod (backend).
7. **Documentation & commentaires utiles** : commenter toujours la signature des fonctions complexes, rédiger des JSDoc pour l’export de modules critiques.
8. **Linting & formatting** : respecter ESLint + Prettier (configuration partagée), fixer les warnings avant merge.
9. **Performance & chargement différé** : utiliser `dynamic()` pour les composants lourds, optimiser les imports et le bundle.
10. **Logs structurés & traçabilité** : utiliser `console.debug/info/warn/error` de façon cohérente, formater les logs en JSON si possible pour faciliter le debugging.

///////

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
/// important rule 

to do list -
1- adding functinality to the dashbord  
2 fixing the depatemnt that we will have 
3 - statr conding the ui of each depatemnt 
4- start downing the functiionality for eachdepatemnt 
5-add loging auth with intergration of supa base