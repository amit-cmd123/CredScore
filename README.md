# 🏦 CredScore – Smart Loan Assessment & Credit Scoring Platform

CredScore is a modern full-stack fintech application that streamlines the loan application and credit assessment process for both applicants and financial institutions.

The platform enables users to apply for loans, track application status, receive notifications, and view credit-related insights, while administrators can review applications, approve or reject requests, and monitor lending analytics through interactive dashboards.

---

## ✨ Features

### 👤 Applicant Features

* Secure User Registration & Login
* Loan Application Submission
* Credit Score Overview
* Real-Time Application Status Tracking
* Notification Center
* Responsive Dashboard
* Dark Mode Interface

### 🛡️ Admin Features

* Admin Dashboard
* Applicant Management
* Loan Approval & Rejection Workflow
* Application Monitoring
* Analytics & Reporting
* Loan Statistics Dashboard
* Notification Management

### 📊 Analytics & Insights

* Total Applications
* Approved Loans
* Rejected Loans
* Pending Applications
* User Growth Metrics
* Credit Score Trends
* Loan Distribution Charts

---

## 🚀 Technology Stack

### Frontend

* React.js
* Vite
* React Router
* Recharts
* Lucide React Icons
* Responsive UI Components

### Backend

* Node.js
* Express.js
* REST APIs
* dotenv
* Nodemailer

### Database

* MongoDB
* Mongoose ODM

### Development Tools

* Nodemon
* Git & GitHub
* VS Code

---

## 🏗️ System Architecture

```text
User Interface (React + Vite)
            │
            ▼
      Express REST APIs
            │
            ▼
      MongoDB Database
```

---

## 🔐 Authentication

The platform currently supports:

* User Registration
* User Login
* Role-Based Access Control
* Admin and Applicant Roles

### Authentication APIs

```http
POST /api/auth/register
POST /api/auth/login
```

---

## 📋 Loan Application Workflow

### Applicant Journey

```text
Register
   ↓
Login
   ↓
Apply for Loan
   ↓
Application Submitted
   ↓
Admin Review
   ↓
Approved / Rejected
   ↓
Notification Received
```

### Admin Journey

```text
Login
   ↓
Review Applications
   ↓
Evaluate Applicant Details
   ↓
Approve / Reject
   ↓
Dashboard Updated
```

---

## 🔔 Notification System

Features:

* Application Status Updates
* Approval Notifications
* Rejection Notifications
* User Alerts
* Read/Unread Tracking

### Notification APIs

```http
GET  /api/notifications
POST /api/notifications
PUT  /api/notifications/:id/read
```

---

## 💾 Database Collections

### User

Stores:

* User Information
* Authentication Details
* Role Information
* Credit Score
* Active Loans

### Application

Stores:

* Applicant Information
* Loan Amount
* Application Status
* Remarks & Decisions

### Notification

Stores:

* User Notifications
* Alert Messages
* Read Status
* Timestamps

---

## 🛠️ Installation

### Clone Repository

```bash
git clone https://github.com/amit-cmd123/CredScore.git

cd CredScore
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Run Backend

```bash
cd backend
npx nodemon index.js
```

### Run Frontend

```bash
cd frontend
npm run dev
```

---

## 🚧 Current Status

### ✅ Completed

* User Authentication
* Role-Based Access Control
* Loan Application Workflow
* Applicant Dashboard
* Admin Dashboard
* Analytics Dashboard
* MongoDB Integration
* Notification System
* Responsive UI

### 🔄 In Development

* Email Notification Service
* OTP Verification
* Enhanced Credit Score Logic
* Security Improvements

### 🎯 Future Enhancements

* JWT Authentication
* AI-Based Credit Scoring
* Loan Recommendation Engine
* PDF Credit Reports
* Real-Time Notifications
* Fraud Detection Module
* Mobile Application

---

## 📸 Screenshots

Add application screenshots here:

```text
screenshots/
├── login-page.png
├── applicant-dashboard.png
├── admin-dashboard.png
├── analytics-dashboard.png
├── loan-application.png
```

---

## 🎓 Learning Outcomes

This project demonstrates practical experience with:

* Full Stack Development
* REST API Design
* MongoDB Database Design
* Authentication Systems
* Role-Based Access Control
* Dashboard Development
* Frontend–Backend Integration
* FinTech Application Design

---

## 👨‍💻 Built By

* Computer Science Student
* Full Stack Developer

GitHub: https://github.com/amit-cmd123

---

## ⭐ Support

If you found this project useful, consider giving it a star on GitHub.

---

## 📄 License

This project is intended for educational and learning purposes.

---

### 💡 Vision

CredScore aims to simplify loan processing and credit assessment through data-driven workflows, intuitive dashboards, and modern fintech solutions.
