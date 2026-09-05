# Course Registration System

A full-stack web-based Course Registration System that allows students to register for courses and administrators to manage courses, students, and registrations.

The application provides secure authentication using JWT, email verification using OTP, role-based authorization, course capacity management, registration management, and an administrative dashboard.

---

## 📌 Project Overview

The Course Registration System is designed to simplify the process of managing student course registrations.

The system has two main roles:

- **Student**
- **Admin**

Students can create accounts, verify their email, log in, view available courses, register for courses, view their registered courses, update their profile, and drop courses.

Administrators can manage courses, view registered students, view course registrations, and monitor registration statistics through an administrative dashboard.

---

# ✨ Features

## 👨‍🎓 Student Features

- Student registration
- Email verification using OTP
- OTP expiry
- Resend OTP
- Secure login
- JWT-based authentication
- Role-based authorization
- View profile
- Update profile
- View available courses
- Register for courses
- View registered courses
- Drop registered courses
- Duplicate registration prevention
- Course capacity validation
- Student ownership validation
- Registration confirmation email
- Course drop confirmation email

---

## 👨‍💼 Admin Features

- Admin login
- JWT-based authentication
- Role-based authorization
- Add courses
- Update courses
- Delete courses
- View all courses
- View all students
- View individual student details
- View course registrations
- Dashboard statistics
- Total students
- Total courses
- Total active registrations
- Verified and unverified student statistics
- Course-wise registration statistics
- Available seats
- Full/available course status
- Most popular course
- Recent student registrations
- Recent registrations

---

# 🔐 Security Features

The application uses Spring Security and JWT for authentication and authorization.

Security features include:

- JWT authentication
- Role-based access control
- Password hashing using BCrypt
- Stateless authentication
- Protected API endpoints
- Student/Admin authorization
- Student ownership validation
- Email verification
- OTP expiry
- Environment-based secrets
- Production-safe exception handling

Passwords are never stored as plain text.

---

# 📧 Email Features

The application uses Gmail SMTP for sending emails.

Emails are sent for:

- Email verification OTP
- Course registration confirmation
- Course drop confirmation
- Admin registration notification

Email credentials are stored using environment variables rather than being written directly in the source code.

Email operations use asynchronous processing so that API requests do not need to wait for the SMTP operation to complete.

---

# 🏗️ System Architecture

The application follows a full-stack client-server architecture.

```text
                    ┌─────────────────────┐
                    │       Browser       │
                    │   React Frontend    │
                    └──────────┬──────────┘
                               │
                               │ HTTP / REST API
                               │ JWT
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot       │
                    │      Backend        │
                    ├─────────────────────┤
                    │ Controllers         │
                    │ Services            │
                    │ Repositories        │
                    │ Security            │
                    │ JWT Authentication  │
                    │ Exception Handling  │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
                ▼              ▼              ▼
        ┌────────────┐  ┌────────────┐  ┌────────────┐
        │   MySQL    │  │   Gmail    │  │    JWT     │
        │  Database  │  │   SMTP     │  │Authentication│
        └────────────┘  └────────────┘  └────────────┘