<div align="center">
  <img src="./public/logos/spendradar-logo.svg" alt="SpendRadar Logo" width="100" />

  # SpendRadar Frontend

  **Smarter Spending, Better Planning.**

  Frontend application for **SpendRadar**, a personal finance platform centered on an intuitive expense ledger and a conversational AI assistant.

  <br />

  ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
  ![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

  [Organization](https://github.com/spendRadar) · [Frontend Repository](https://github.com/spendRadar/spendRadar-FE) · [Backend Repository](https://github.com/spendRadar/spendRadar-BE)
</div>

---

## Overview

This repository contains the **web frontend** for SpendRadar. The planned experience focuses on managing everyday transactions in a ledger-style interface while interacting with an AI assistant in a panel on the right. The AI service may use spending history and time-series forecasts to support its responses; a separate AI report page is **not** part of the planned frontend.

> **Development status:** The project is in active development. The shared application layout and initial UI foundation are present, but the main product screens and AI integrations are not yet implemented in the current `main` branch.

## Planned Experience

The current frontend plan focuses on **two main UI areas**:

| Area | Intended experience |
| --- | --- |
| **Expense Ledger (가계부)** | Browse and manage transactions through a daily/monthly expense-tracking interface. |
| **AI Chat Assistant** | Use a right-side conversational panel to ask questions about spending and receive context-aware guidance. |

SpendRadar's time-series forecasting functionality is being explored as part of the broader AI service, **not as a separate reporting screen**. The exact integration between forecasts and AI conversations is still under development.

### Current Implementation Status

- Shared application layout and header
- Initial styles, theme tokens, and reusable UI component setup
- SPA routing foundation with a placeholder home screen
- Some navigation labels remain from the initial UI mockup and **do not indicate committed feature pages**

> **Note:** The expense ledger and AI chat panel describe the planned experience. Their full functionality and service integration are not yet present in the current `main` branch.

## Tech Stack

| Area | Technologies |
| --- | --- |
| **Core** | React 19, TypeScript, React Router 7 |
| **Build** | Vite 8 |
| **Styling** | Tailwind CSS 4, shadcn, Base UI |
| **State Management** | Jotai |
| **Data Visualization** | Recharts |
| **Icons & Utilities** | Lucide React, date-fns, Zod |
| **Code Quality** | ESLint, Prettier |

> Some libraries are installed to support upcoming features and are not necessarily used by the current home screen.

## Getting Started

### Prerequisites

- Node.js and npm (Node.js **24** is used by the repository's Dockerfile)
- Git

### Installation

```bash
git clone https://github.com/spendRadar/spendRadar-FE.git
cd spendRadar-FE
npm ci
```

### Run Locally

```bash
npm run dev
```

Open **http://localhost:5173** in your browser (or the URL displayed by the dev server).

## Project Structure

```text
spendRadar-FE/
├── app/
│   ├── components/
│   │   ├── layout/
│   │   │   └── header.tsx        # Shared navigation header
│   │   └── ui/                   # Reusable UI components
│   ├── routes/
│   │   └── home.tsx              # Current index page (placeholder)
│   ├── app.css                   # Global styles and theme tokens
│   ├── root.tsx                  # Application layout and error boundary
│   └── routes.ts                 # Route configuration
├── public/
│   └── logos/                    # Brand assets
├── components.json              # shadcn UI configuration
├── react-router.config.ts       # React Router configuration
├── vite.config.ts               # Vite plugins and configuration
├── eslint.config.ts             # Lint configuration
├── .prettierrc                  # Formatting conventions
├── Dockerfile                   # Container build configuration
└── package.json                 # Scripts and dependencies
```

The application currently uses **client-side rendering** (`ssr: false`). The `~/*` TypeScript alias points to `app/*`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Generate a production build. |
| `npm run start` | Serve the production build. |
| `npm run typecheck` | Generate route types and run the TypeScript checker. |
| `npm run lint` | Run ESLint. |
| `npm run lint:fix` | Apply ESLint autofixes. |
| `npm run format` | Format files using Prettier. |
| `npm run format:check` | Check formatting without modifying files. |

## Production Build

```bash
npm run build
npm run start
```

The repository also includes a multi-stage Dockerfile:

```bash
docker build -t spendradar-fe .
docker run --rm -p 3000:3000 spendradar-fe
```

The application server normally uses port `3000` in the container; adapt the mapping if its runtime configuration changes.

## Related Repositories

- [**spendRadar-FE**](https://github.com/spendRadar/spendRadar-FE) — Frontend application (this repository)
- [**spendRadar-BE**](https://github.com/spendRadar/spendRadar-BE) — Backend service

---

<div align="center">
  <sub>Made with ❤️ by the SpendRadar Team</sub>
</div>
