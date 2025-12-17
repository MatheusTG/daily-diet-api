# Tasks API Rocketseat

Daily Diet API is a challenge from Rocketseat’s Node.js course, where a RESTful API is developed to help users track their daily diet. The API allows users to register meals, update and delete them, and retrieve detailed diet metrics such as total meals, meals inside and outside the diet, and the best sequence of meals within the diet. A key aspect of the project is ensuring proper user identification and access control, allowing users to manage only their own meals.

## 🚀 Technologies Used

| Technology                                                                                                        | Description                                                                                    |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)          | JavaScript runtime environment designed for building scalable server-side applications.        |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | Strongly typed superset of JavaScript that improves code quality, safety, and maintainability. |
| ![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)          | High-performance, low-overhead web framework for building RESTful APIs with Node.js.           |
| ![Knex.js](https://img.shields.io/badge/Knex.js-D26B38?style=for-the-badge&logo=knexdotjs&logoColor=white)        | SQL query builder that provides a flexible and database-agnostic interface for Node.js.        |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)                      | Type-safe schema validation library used to ensure data integrity and reliable input parsing.  |
| ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)             | Modern and fast testing framework designed for unit and integration testing.                   |

## 📌 Requirements

- Node 18+

## 🛠️ Installation & Usage

```bash
# Clone the repository to your computer
git clone https://github.com/MatheusTG/daily-diet-api.git .

# Copy the .env.example to .env

# Install dependencies
npm install

# Execute the project migrations
npm run knex -- migrate:latest

# Run the project
npm run dev
```

## ▪️Project Structure

```bash
daily-diet-api/
├── db/
│   ├── migrations/              → Database migration files
│   └── app.db                   → SQLite database file
│
├── src/
│   ├── @types/                  → Custom TypeScript type definitions
│   │   ├── knex.d.ts            → Knex type extensions
│   │   ├── MealsType.d.ts       → Meal entity type definitions
│   │   └── UsersType.d.ts       → User entity type definitions
│   │
│   ├── env/                     → Environment variables validation and setup
│   │   └── index.ts
│   │
│   ├── middlewares/             → Application middlewares
│   │
│   ├── routes/                  → API route definitions
│   │   ├── meals.ts             → Meals-related routes
│   │   └── users.ts             → Users-related routes
│   │
│   ├── utils/                   → Utility and helper functions
│   │   └── handleError.ts       → Centralized error handling
│   │
│   ├── app.ts                   → Fastify application configuration
│   ├── database.ts              → Database connection and Knex configuration
│   └── server.ts                → Application entry point
│
├── test/
│   ├── utils/                   → Test helper utilities
│   │
│   ├── meals.test.ts            → Meals integration tests
│   └── users.test.ts            → Users integration tests
│
├── knexfile.ts                  → Knex configuration file
└── package.json                 → Project dependencies and scripts
```

## 📜 Functional Requirements

Functional requirements describe what the system must do.

- [x] **FR001 - Users:** The system must allow users to be created.
- [x] **FR002 - Users:** The system must be able to identify the authenticated user across requests (e.g., sessions, tokens, or cookies).
- [x] **FR003 - Meals:** The system must allow registering a meal with the following information:
  - [x] Name
  - [x] Description
  - [x] Date and time
  - [x] Whether it is inside or outside the diet
- [x] **FR004 - Meals:** The system must allow updating a meal, changing any of its data.
- [x] **FR005 - Meals:** The system must allow deleting a meal.
- [x] **FR006 - Meals:** The system must allow listing all meals of a user.
- [x] **FR007 - Meals:** The system must allow viewing a single specific meal.
- [x] **FR008 - Metrics:** The system must allow retrieving user metrics, including:
  - [x] Total number of registered meals
  - [x] Total number of meals inside the diet
  - [x] Total number of meals outside the diet
  - [x] Best sequence of meals inside the diet

## 📐 Business Rules

Business rules define mandatory constraints and behaviors.

- [x] **BR001 - Ownership:** Each meal must belong to exactly one user.
- [x] **BR002 - Access Control:** A user can only view, edit, or delete meals that they have created.
- [x] **BR003 - Data Privacy:** Users must not be able to access or manipulate meals created by other users.
- [x] **BR004 - Personalized Metrics:** Metrics must be calculated only based on the user’s own meals.
- [x] **BR005 - Streak Calculation:** The best diet sequence must consider only consecutive meals marked as “inside the diet”.

## ⚙️ Non-Functional Requirements

Non-functional requirements describe how the system should operate.

- [x] **NFR001 - Architecture:** The API must follow RESTful principles.
- [x] **NFR002 - Security:** The system must ensure secure user identification across requests.
- [x] **NFR003 - Data Management:** Data must be persisted in a database.
- [x] **NFR004 - Maintainability:** The application must have a clean and maintainable codebase.
- [x] **NFR005 - Data Integrity:** Input data must be validated to ensure consistency.
- [x] **NFR006 - Compatibility:** The API must be suitable for consumption by web and mobile applications.
- [x] **NFR007 - Documentation:** The project must include clear documentation (README) explaining how to run the application.
