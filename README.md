🛒 E-Commerce Backend (NestJS)

A scalable and production-ready **E-commerce Backend API** built using **NestJS**, designed to handle real-world business logic including authentication, orders, payments, and more.

This project is a re-engineered version of a previous Express.js system, focusing on better architecture, maintainability, and scalability.

---

## 🚀 Features

### 🔐 Authentication & Security
- JWT Authentication (Access & Refresh Tokens)
- Email Verification (OTP)
- Password Reset Flow
- Blacklisted Tokens (secure logout)
- Role-Based Authorization (Admin / User)

---

### 🛍️ E-Commerce Core
- Products, Categories, Subcategories, Brands
- Cart Management
- Order Management
- Reviews & Ratings
- Address Management
- Coupon & Discount System

---

### 💳 Payment Integration
- Integrated with Stripe
- Checkout Sessions
- Webhook Handling
- Secure Payment Verification

---

### ⚡ Performance & Architecture
- Modular NestJS Architecture
- Optimized MongoDB Queries with Indexing
- Soft Delete Strategy
- Clean Code Structure (Services, Controllers, DTOs)

---

### 🔔 Real-Time Updates
- Socket-based notifications for:
  - New Orders
  - Order Updates
  - Product Updates

---


## 🏗️ Project Structure

```bash
src/
│
├── Modules/
│   ├── Auth/
│   ├── User/
│   ├── Product/
│   ├── Category/
│   ├── Brand/
│   ├── Cart/
│   ├── Order/
│   ├── Payment/
│   ├── Review/
│   ├── Coupon/
│   ├── Address/
│
├── Common/
├── Config/
├── Database/
```

## ⚙️ Environment Variables

The project uses **two environment files**:

### 1️⃣ `.env`
Basic environment configuration

### 2️⃣ `Development.env`
Contains sensitive credentials:
- Stripe Keys
- Cloudinary Config
- Gmail Credentials
- App Port

---
### Example:

```env
# App
PORT=3000

# JWT
JWT_SECRET=your_secret

# Stripe
STRIPE_SECRET_KEY=your_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary
CLOUD_NAME=your_cloud
API_KEY=your_key
API_SECRET=your_secret

# Email (Gmail)
EMAIL_USER=your_email
EMAIL_PASS=your_password
```
 

## 📦 Installation

1. Clone the repository
git clone https://github.com/Tar2sh12/NEW-ECOMM-NEST.git
cd NEW-ECOMM-NEST

2. Install dependencies (using pnpm)
pnpm install

3. Setup environment variables
- Create `.env`
- Create `Development.env`
- Add your credentials

4. Run the project

Development mode:
pnpm run start:dev

Production mode:
pnpm run build
pnpm run start:prod

---

## 🔗 API Documentation

Postman Collection:
https://documenter.getpostman.com/view/34540021/2sBXirjTpj

---

## 💻 GitHub Repository

https://github.com/Tar2sh12/NEW-ECOMM-NEST

---

## 🧠 How It Works

### 🛒 Order Flow
1. User adds products to cart
2. Creates an order
3. Applies coupon (optional)
4. Proceeds to payment (Stripe Checkout)
5. Payment is verified via webhook
6. Order status updated automatically

### 🔐 Authentication Flow
1. User registers
2. Receives OTP for email verification
3. Logs in → receives Access & Refresh tokens
4. Uses protected APIs
5. Logout → token is blacklisted

### 💳 Payment Flow
1. Backend creates Stripe Checkout Session
2. User completes payment
3. Stripe sends webhook
4. Backend verifies payment
5. Order marked as paid

---

## 🧪 Tech Stack

- NestJS
- Node.js
- MongoDB / Mongoose
- Stripe
- Cloudinary
- Socket.io

---

## 📌 Future Improvements
- Dockerization
- CI/CD Pipeline
- Unit & Integration Testing
- Admin Dashboard

---

## 👨‍💻 Author

Mohamed Tarek Salah
