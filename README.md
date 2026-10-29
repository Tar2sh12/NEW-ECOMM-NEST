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
# ============================================
# 🗄️ Database & Server
# ============================================
MONGO_URI="mongodb://localhost:27017/ecommerce_nestjs"   # or a MongoDB Atlas connection string
PORT=YOUR_PORT
SALT_ROUNDS=10                                           # bcrypt salt rounds

# ============================================
# 🔐 Authentication (JWT)
# ============================================
LOGIN_ACCESS_TOKEN_SECRET="your_access_token_secret_here"
LOGIN_REFRESH_TOKEN_SECRET="your_refresh_token_secret_here"
ACCESS_TOKEN_EXPIRATION_TIME="1D"                        # e.g. 1D = 1 day
REFRESH_TOKEN_EXPIRATION_TIME="7D"                       # e.g. 7D = 7 days

# ============================================
# 🔑 Security & Encryption
# ============================================
PREFIX_SECRET="Bearer_"                                  # token prefix used in the Authorization header
SECRET_ENCRYPTION_KEY="your_32_character_encryption_key"
CONFIRM_TOKEN="your_email_confirmation_token_secret"
CONFIRM_EMAIL_EXPIRATION_TIME="1D"                       # e.g. 1D = 1 day

# ============================================
# 📧 Email (Nodemailer)
# ============================================
NODEMAILER_EMAIL="your_email@gmail.com"
NODEMAILER_APP_PASSWORD="abcd efgh ijkl mnop"            # Gmail App Password (not your real password)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=465                                           # 465 for SSL, 587 for TLS

# ============================================
# ☁️ Cloudinary (Image Uploads)
# ============================================
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
CLOUDINARY_UPLOADS_FOLDER="Ecommerce_nestjs"

# ============================================
# 🌍 City API (fetch city data by postal code)
# ============================================
CITY_API_KEY="your_city_api_key"

# ============================================
# 💳 Stripe
# ============================================
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
SUCCESS_URL="http://localhost:port/success"
CANCEL_URL="http://localhost:port/cancel"

# ============================================
# 💰 Paymob
# ============================================
PAYMOB_API_KEY="your_paymob_api_key"
PAYMOB_SECRET_KEY="egy_sk_test_your_paymob_secret_key"
PAYMOB_PUBLIC_KEY="egy_pk_test_your_paymob_public_key"
PAYMOB_INTEGRATION_ID="1234567"
PAYMOB_IFRAME_ID="123456"
PAYMOB_HMAC_KEY="your_paymob_hmac_key"
PAYMOB_EGY_URL="https://accept.paymob.com/api"
NOTIFICATION_URL="https://your-domain.com/api/payment/paymob/webhook"   # Paymob sends payment status here
REDIRECTION_URL="http://localhost:port/payment/redirect" # or https://your-domain.com/payment/redirect

# ============================================
# ⚡ Redis
# ============================================
REDIS_URL="redis://default:password@host:port"
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
