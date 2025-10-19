# Task Manager
<img width="1919" height="933" alt="Screenshot 2025-10-19 171841" src="https://github.com/user-attachments/assets/8a673477-adc1-4848-aca9-f0ad4d332f1f" />

A full-stack web application for efficient task management, built with the MERN stack (MongoDB, Express.js, React, Node.js). This platform enables users to register, authenticate, and manage tasks securely, with role-based access for admins and regular users. It supports task creation, updates, deletions, status tracking, and collaboration features like comments and asset uploads.

The frontend is deployed on [Netlify](https://app.netlify.com/) and the backend on [Render](https://render.com/), ensuring scalable, cloud-based accessibility.

## Features

### Admin Features
1. **User Management**
   - Create admin accounts.
   - Add and manage team members.

2. **Task Assignment**
   - Assign tasks to individual or multiple users.
   - Update task details and status.

3. **Task Properties**
   - Label tasks as todo, in progress, or completed.
   - Assign priority levels (high, medium, normal, low).
   - Add and manage sub-tasks.

4. **Asset Management**
   - Upload task assets, such as images.

5. **User Account Control**
   - Disable or activate user accounts.
   - Permanently delete or trash tasks.

### User Features
1. **Task Interaction**
   - Change task status (in progress or completed).
   - View detailed task information.

2. **Communication**
   - Add comments or chat to task activities.

### General Features
1. **Authentication and Authorization**
   - User login with secure authentication.
   - Role-based access control.

2. **Profile Management**
   - Update user profiles.

3. **Password Management**
   - Change passwords securely.

4. **Dashboard**
   - Provide a summary of user activities.
   - Filter tasks into todo, in progress, or completed.

## Authentication Workflow
- **User Registration**: Register with username and password.
- **Login**: Authenticate and receive a JWT token on success.
- **Token Storage**: Frontend stores the token securely (e.g., in localStorage).
- **Logout**: Clear token and session.
- **Protected Routes**: API endpoints require valid JWT for access.

## Task Management
Authenticated users can:
- View their list of tasks.
- Create new tasks.
- Update existing tasks.
- Delete tasks.

Each task includes:
- **Title** (required string).
- **Description** (optional).
- **Status** (e.g., pending, completed, in progress, todo).

Users can only access and manage their own tasks.

## Validation
- **Frontend**: All forms validated using Zod + React Hook Form.
- **Backend**: Request bodies validated with error handling for graceful failures.

## API Endpoints

### Authentication
- `POST /api/auth/register`: Register a new user `{ username: string, password: string }`.
- `POST /api/auth/login`: Authenticate and return JWT `{ username: string, password: string }`.

### Tasks (Require valid JWT)
- `GET /api/tasks`: Fetch tasks for the logged-in user.
- `POST /api/tasks`: Create a new task `{ title: string, description?: string, status: string }`.
- `PUT /api/tasks/:id`: Update task by ID.
- `DELETE /api/tasks/:id`: Delete task by ID.

## Database
- **MongoDB**: Scalable NoSQL database for Users and Tasks collections.
- **Relationships**: Tasks linked to users via user ID.
- Models: User (with roles), Task (with title, description, status, priority, sub-tasks, assets), Notification (optional).

## Technologies Used

### Frontend
- **React** (with Vite for fast builds).
- **Redux Toolkit** for state management (slices for API, auth, tasks, users).
- **Headless UI** for accessible components.
- **Tailwind CSS** for styling.
- **Zod + React Hook Form** for validation.
- **Firebase** (for optional features like auth utils).

### Backend
- **Node.js** with **Express.js** for API routing and controllers.
- **JWT** for authentication middleware.
- **Mongoose** for MongoDB interactions.

### Other
- **MongoDB** for data storage.
- **Environment Management**: dotenv for secure configs.

## Project Structure

### Client (Frontend)
```
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Index.jsx
│   │   ├── Login.jsx
│   │   ├── Status.jsx
│   │   ├── TaskDetail.jsx
│   │   ├── Tasks.jsx
│   │   ├── Trash.jsx
│   │   └── Users.jsx
│   ├── redux/
│   │   ├── slices/
│   │   │   ├── api/
│   │   │   │   ├── authApiSlice.js
│   │   │   │   ├── taskApiSlice.js
│   │   │   │   ├── userApiSlice.js
│   │   │   │   └── apiSlice.js
│   │   │   ├── authSlice.js
│   │   │   └── store.js
│   └── utils/
│       ├── constants.js
│       ├── dummydata.js
│       ├── firebase.js
│       └── index.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

### Server (Backend)
```
server/
├── controllers/
│   ├── taskController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── noti.js
│   ├── taskModel.js
│   └── userModel.js
├── node_modules/
├── routes/
│   ├── index.js
│   ├── taskRoute.js
│   └── userRoute.js
├── utils/
│   ├── connectDB.js
│   └── index.js
├── .env
├── index.js
├── package-lock.json
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended).
- MongoDB Atlas account for cloud database.
- Git for cloning the repo.

Clone the repository:
```bash
git clone https://github.com/SakshamRajpal/MEATEC_CASE_STUDY_FULL_STACK.git
cd MEATEC_CASE_STUDY_FULL_STACK
```

### Server Setup
1. **Environment Variables**  
   Create `.env` in the `server/` folder:
   ```
   MONGODB_URI=your_mongodb_connection_url
   JWT_SECRET=your_secure_jwt_secret
   PORT=8800
   NODE_ENV=development
   ```

2. **Set Up MongoDB**  
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).  
   - Create an account and a new cluster (free tier available).  
   - Configure cluster settings, create a database user, and set IP whitelist (0.0.0.0/0 for testing).  
   - Get the connection URL and add to `.env`.  
   - Test connection via MongoDB Compass or shell.

3. **Run the Server**  
   ```bash
   cd server
   npm install
   npm start
   ```  
   Server runs on `http://localhost:8800`. Look for "Database Connected" in console.

### Client Setup
1. **Environment Variables**  
   Create `.env` in the `client/` folder:
   ```
   VITE_APP_BASE_URL=http://localhost:8800
   VITE_APP_FIREBASE_API_KEY=your_firebase_api_key
   ```

2. **Run the Client**  
   ```bash
   cd client
   npm install
   npm run dev  # Or npm start for production-like
   ```  
   App opens at `http://localhost:3000` (Vite dev server).

## Deployment
- **Frontend**: Deployed on Netlify. Build with `npm run build` and drag `dist/` folder to Netlify dashboard.
- **Backend**: Deployed on Render. Connect GitHub repo, set env vars, and deploy as Node service.
- Update `VITE_APP_BASE_URL` in client `.env` to point to the deployed backend URL.

## Usage
1. Register/login via the login page.
2. Access dashboard to view/filter tasks.
3. Create/update/delete tasks from the Tasks page.
4. Admins: Manage users and assignments via Users page.
5. View details, trash, or status updates as needed.

## Contributing
1. Fork the repo and create a feature branch (`git checkout -b feature/amazing-feature`).
2. Commit changes (`git commit -m 'Add some amazing feature'`).
3. Push to branch (`git push origin feature/amazing-feature`).
4. Open a Pull Request.

