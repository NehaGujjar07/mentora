# Mentora - EdTech Platform

Mentora is a production-ready full-stack EdTech platform built with the MERN stack (MongoDB, Express, React, Node.js). It features role-based authentication, course management, Razorpay payment integration, and student progress tracking.

## Features

- **Authentication**: Secure user registration and login with JWT and bcrypt.
- **Role-Based Access**: Separate dashboards for Students and Admins.
- **Course Management**: Admins can create, edit, and delete courses with video lessons.
- **Payments**: Integrated Stripe for secure course purchases.
- **Progress Tracking**: Students can track their lesson completion and course progress.
- **Responsive Design**: Built with Tailwind CSS for a modern, mobile-friendly UI.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router, Lucide Icons, Stripe React SDK.
- **Backend**: Node.js, Express, MongoDB, Mongoose, Stripe SDK.
- **Security**: Helmet, Morgan, CORS, JWT.

## Local Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)

### Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/mentora
    JWT_SECRET=your_jwt_secret_key_here
    STRIPE_SECRET_KEY=your_stripe_secret_key
    ```
4.  Start the server:
    ```bash
    npm run dev
    ```

### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `frontend` directory:
    ```env
    VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```

## Usage

1.  **Register** a new account.
2.  **Admin Access**: Manually change your user role to 'admin' in the MongoDB database to access the Admin Dashboard.
    - Or register a user, then update the document: `db.users.updateOne({email: "your@email.com"}, {$set: {role: "admin"}})`
3.  **Create Courses**: As an admin, go to the dashboard and create new courses.
4.  **Enroll**: As a student, browse courses and purchase them using the Razorpay test credentials.

## License

MIT
