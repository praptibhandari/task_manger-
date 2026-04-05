# Full Stack Task Manager Application

A modern, production-ready full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS.

## Features

- **Authentication System:** Secure JWT-based registration and login with bcrypt password hashing.
- **Task Management:** Full CRUD operations (Create, Read, Update, Delete) for your personal tasks.
- **Drag and Drop:** Easily drag and drop tasks between 'Pending' and 'Completed' columns to update their status instantly.
- **Advanced Filtering & Sorting:** Filter tasks by status (all/pending/completed), search by title, and sort by due date, created date, or priority.
- **Modern UI:** Responsive, clean interface designed with Tailwind CSS, supporting dark mode out of the box.

## Screenshots

*(Placeholder for Screenshots)*
- Login/Signup screen
- Dashboard light mode
- Dashboard dark mode

## Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, React Router DOM, @hello-pangea/dnd (for drag & drop), Axios, Lucide React (Icons).
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs.

## Setup Instructions

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js (v16+)
- MongoDB (running locally or a MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd task_manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (a default has been provided):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=supersecretjwtkey123
FRONTEND_URL=http://localhost:5173
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will be running at `http://localhost:5173` and the backend API at `http://localhost:5000`.

## API Documentation

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Task Routes (Requires Bearer Token)
- `GET /api/tasks` - Fetch all tasks (accepts query params: `status`, `search`, `sortby`)
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a specific task
- `DELETE /api/tasks/:id` - Delete a task

## Deployment Readiness
- **Frontend (Vercel):** The Vite project is configured and ready to be deployed to Vercel instantly. Make sure to configure the `VITE_API_URL` if you refactor the endpoints to use an environment variable.
- **Backend (Render/Railway):** The `start` script is added. Just configure the environment variables on Render, and it is ready to go live.



LIVE URL:-
task-manger-eta-six.vercel.app
