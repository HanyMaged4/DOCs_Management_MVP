# DOCs Management MVP

A full-stack documentation management system (MVP) built with NestJS, Prisma & PostgreSQL on the backend, and React (Vite + TypeScript) on the frontend. Users can sign up, sign in, manage Books and Entities (with tags & file attachments).

## Table of Contents
1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
5. [Environment Variables](#environment-variables)
6. [Available Scripts](#available-scripts)
7. [API Endpoints](#api-endpoints)
8. [Project Structure](#project-structure)
9. [Contributing](#contributing)
10. [License](#license)

## Features
- User authentication (sign up / sign in) with JWT
- CRUD operations for Books
- CRUD operations for Entities under each Book, with tags and file attachments (via Multer)
- Modern React UI with Vite, React Router, and Context API for auth
- Validation on both client (Zod) and server (class-validator)
- CORS and proxy configuration for development

## Technology Stack
**Backend:** NestJS, Prisma ORM, PostgreSQL, class-validator, class-transformer, Multer  
**Frontend:** React, Vite, TypeScript, Zod, React Router, Context API, CSS modules

## Prerequisites
- Node.js v16+ and npm/yarn
- PostgreSQL database
- Git

## Installation
Clone the repo:
```bash
git clone https://github.com/HanyMaged4/DOCs_Management_MVP.git
cd DOCs_Management_MVP
```

### Backend Setup
```bash
cd backend
npm install
# create a .env file (see Environment Variables below)
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

### Frontend Setup
```bash
cd front-end
npm install
# (optional) configure proxy in vite.config.ts to point /auth and /api to backend
npm run dev
```

## Environment Variables
Create a `.env` file in the `backend/` directory with:
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
JWT_SECRET=your_jwt_secret
PORT=3000
```

## Available Scripts
### Backend (NestJS)
| Command             | Description                       |
|---------------------|-----------------------------------|
| `npm run start`     | Run in production mode            |
| `npm run start:dev` | Run in development watch mode     |
| `npm run build`     | Build for production              |

### Frontend (React/Vite)
| Command            | Description                  |
|--------------------|------------------------------|
| `npm run dev`      | Start Vite dev server        |
| `npm run build`    | Build production assets      |
| `npm run preview`  | Preview production build     |

## API Endpoints
### Authentication
- `POST /auth/signup` – Register a new user
- `POST /auth/signin` – Authenticate and receive JWT

### Books
- `GET /books` – List all books for the current user
- `GET /books/:id` – Get a single book
- `POST /books` – Create a new book
- `PUT /books/:id` – Update a book
- `DELETE /books/:id` – Delete a book (requires sec_password)

### Entities
- `GET /entities/book/:bookId` – List entities under a book
- `GET /entities/:id` – Get a single entity
- `POST /entities` – Create entity (multipart/form-data)
- `PATCH /entities/:id` – Update entity (multipart/form-data)
- `DELETE /entities/:id` – Delete entity
- `DELETE /entities/:id/attachments/:attachmentId` – Remove a single attachment

## Project Structure
```
├── backend/               # NestJS application
│   ├── src/
│   │   ├── auth/          # Auth module
│   │   ├── book/          # Book module
│   │   ├── entity/        # Entity module
│   │   ├── prisma/        # Prisma service & schema
│   │   └── main.ts        # Entry point
│   └── prisma/
├── front-end/            # React application (Vite)
│   ├── src/
│   │   ├── API/           # API calls & DTOs
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth context
│   │   ├── Pages/         # Page layouts
│   │   └── App.tsx
│   └── vite.config.ts
└── README.md             # This file
```