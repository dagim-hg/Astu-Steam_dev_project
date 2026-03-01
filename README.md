# ASTU Smart Complaint & Issue Tracking System

A full-stack, enterprise-grade solution for managing university complaints and issues. Built for **Adama Science and Technology University (ASTU)**, this system enables students to submit complaints, track their status, and interact with an AI-powered chatbot for quick assistance.

## 🚀 Features

- **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for Students, Staff, and Administrators.
- **Complaint Management:** Seamless submission, tracking, and resolution of student complaints.
- **AI Chatbot:** Integrated intelligent assistant for instant answers to common queries.
- **Secure File Uploads:** Support for evidence/attachment uploads using Multer.
- **Real-time Notifications:** Bell-style notifications for status updates (e.g., complaint resolution, new staff assignments).
- **Responsive UI:** Modern, mobile-friendly interface built with React and Tailwind CSS.
- **Dark Mode Support:** Smooth transitions between light and dark themes.

## 🛠️ Technology Stack

### Backend
- **Core:** Node.js, Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) & BcryptJS
- **Middleware:** Multer, Morgan, CORS, Dotenv

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide-react
- **Routing:** React Router DOM
- **HTTP Client:** Axios

## 📁 Project Structure

```text
astu-steam-project/
├── backend/                # Express server and API
│   ├── config/             # Database & environment config
│   ├── controllers/        # Route controllers (logic)
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth & error handlers
│   ├── data/               # Static data (e.g., chatbot rules)
│   └── uploads/            # Local file storage (git-ignored)
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Full-page views
│   │   ├── context/        # Global state (Auth/Theme)
│   │   ├── api/            # Axios configurations
│   │   └── assets/         # Images & styles
│   └── tailwind.config.js  # Styling configuration
└── README.md               # Project documentation
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local instance
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dagim-hg/Astu-Steam_dev_project.git
   cd Astu-Steam_dev_project
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example (if available)
   # Required variables: MONGO_URI, JWT_SECRET, PORT
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 📜 License

This project is licensed under the ISC License.

---
*Developed for ASTU students and staff.*
