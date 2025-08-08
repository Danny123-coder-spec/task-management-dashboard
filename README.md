# Task Management Dashboard

A modern task management application built with React, TypeScript, and TanStack Router, featuring a dark mode-first design and real-time task synchronization.

## Features

### Core Functionality
- **Task Management**
  - Create, read, update, and delete tasks
  - Mark tasks as "To Do", "In Progress", or "Done"
  - Task filtering and search capabilities
  - Detailed task view with metadata

### User Experience
- **Dark Mode First Design**
  - Built-in dark mode with light mode option
  - Persistent theme preferences
  - Smooth theme transitions

### Authentication & Data
- **User Authentication**
  - Secure login system
  - Persistent sessions
  - Protected routes for authenticated users

### Technical Features
- **Modern Stack**
  - React 19 with TypeScript
  - TanStack Router for type-safe routing
  - Redux Toolkit for state management
  - RTK Query for API data fetching
  - React Hook Form for form management
  - Tanstack router for routing between pages
  - Zod for runtime type validation

### UI Components
- **Rich Component Library**
  - Custom UI components using shadcn ui
  - Responsive design with Tailwind CSS
  - Toast notifications with Sonner
  - Custom form controls
  - Interactive dialogs and modals

## Project Structure
**`src/components/`**
- `ui/`: Base UI components built with Radix UI primitives and Tailwind CSS
- `Layout.tsx`: Main application layout wrapper with theme provider
- Reusable components following atomic design principles

**`src/hooks/`**
- Custom React hooks for shared functionality
- `useTheme.ts`: Dark mode management with local storage persistence
- Separation of concerns for reusable stateful logic

**`src/routes/`**
- TanStack Router based routing system
- `__root.tsx`: Root route configuration with authentication context
- `_authenticated/`: Protected routes requiring user authentication
- Type-safe routing with loader and action functions

**`src/store/`**
- Redux store implementation with Redux Toolkit
- `api/`: RTK Query API slices for data fetching
  - `tasksApi.ts`: Task management endpoints
  - Automatic caching and synchronization
- `slices/`: Redux state management
  - `authSlice.ts`: Authentication state
  - `filterSlice.ts`: Task filtering and search state

**`src/utils/`**
- Shared utility functions and helpers
- `taskStorage.ts`: Local storage management for tasks
- Type definitions and common constants

## Technical Decisions

### State Management
- **Redux Toolkit**: Chosen for predictable state management and built-in dev tools
- **RTK Query**: Implements efficient data fetching with automatic caching

### Routing
- **TanStack Router**: Selected for its type-safe routing and built-in loader support
- **Protected Routes**: Implemented through authenticated route guards

### Styling
- **Tailwind CSS**: Utilized for rapid development and consistent design
- **CSS Variables**: Custom theme tokens for flexible styling
- **Dark Mode**: Implemented using CSS classes and local storage persistence

### Data Validation
- **Zod**: Ensures runtime type safety for form inputs and API responses

## Getting Started

1. **Installation**
```bash
npm install
```

2. **Development**
```bash
npm run dev
```

3. **Build**
```bash
npm run build
```

## Environment Requirements
- Node.js >= 18
- npm >= 9