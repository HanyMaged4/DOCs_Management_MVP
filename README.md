# DOCs Management System

A document management REST API built with **NestJS**, **Prisma**, and **PostgreSQL**. This system allows users to organize their documents into Books and Entities with support for tags, file attachments, and secure access control.

## 📋 Table of Contents

- Features
- Technology Stack
- Architecture Overview
- Prerequisites
- Installation
- Environment Variables
- Running the Application
- API Documentation
- Project Structure
- Key Features Explained
- Security Features
- Troubleshooting
- Future Enhancements

---

## 🚀 Features

### Authentication & User Management
- **User Registration**: Sign up with email, username, and password
- **Email Verification**: Verify email addresses with verification codes
- **User Login**: JWT-based authentication
- **Password Reset**: Forgot password functionality with email verification
- **Secondary Password**: Optional additional security layer for sensitive operations
- **Profile Management**: Update user information (username, email, passwords)
- **Account Deletion**: Delete user account with all associated data

### Books Management
- **Create Books**: Organize documents into books with titles and descriptions
- **List Books**: View all your books with search functionality
- **Update Books**: Modify book details
- **Delete Books**: Remove books with secondary password protection
- **Search**: Search books by title or description
- **Ownership**: Each book is private to its owner

### Entities Management
- **Create Entities**: Add document entries within books
- **Rich Content**: Store titles and content (up to 5000 characters)
- **File Attachments**: Upload images and videos (up to 50MB per file, 10 files max)
  - Supported image formats: JPEG, PNG, GIF, WebP
  - Supported video formats: MP4, WebM, QuickTime
- **Tagging System**: Organize entities with custom tags
- **Update Entities**: Modify entity details and add/remove attachments
- **Delete Entities**: Remove entities and associated files
- **View Entities**: Browse entities by book with full details

### File Management (AWS S3)
- **Cloud Storage**: Files stored securely in AWS S3
- **Presigned URLs**: Secure, time-limited access to private files
- **Automatic Cleanup**: Files deleted from S3 when entities are removed
- **Organized Structure**: Files organized by user and type (images/videos)

### Caching (Redis)
- **Performance Optimization**: Frequently accessed data cached in Redis
- **Automatic Cache Invalidation**: Cache updated on data changes
- **TTL Management**: 5-minute cache expiration for fresh data

---

## 🛠 Technology Stack

- **Framework**: [NestJS](https://nestjs.com/) - Progressive Node.js framework
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Relational database
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM
- **Authentication**: JWT (JSON Web Tokens) with Passport
- **Validation**: class-validator & class-transformer
- **File Upload**: Multer for multipart/form-data
- **Cloud Storage**: AWS S3 SDK v3
- **Email Service**: Resend for transactional emails
- **Cache**: Redis for performance optimization
- **API Documentation**: Swagger/OpenAPI

---

## 🏗 Architecture Overview

```
                    ┌─────────────────┐
                    │                 │
                    │  NestJS Backend │
                    │   (Port 3000)   │
                    │                 │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
    ┌───────▼────────┐ ┌────▼─────┐  ┌──────▼──────┐
    │                │ │          │  │             │
    │   PostgreSQL   │ │  Redis   │  │   AWS S3    │
    │   (Database)   │ │ (Cache)  │  │  (Storage)  │
    │                │ │          │  │             │
    └────────────────┘ └──────────┘  └─────────────┘
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn**: Package manager (comes with Node.js)
- **PostgreSQL**: v12 or higher ([Download](https://www.postgresql.org/download/))
- **Redis**: v6 or higher ([Download](https://redis.io/download))
- **AWS Account**: For S3 storage ([Sign up](https://aws.amazon.com/))
- **Git**: For cloning the repository ([Download](https://git-scm.com/))

---

## 📥 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/HanyMaged4/DOCs_Management_MVP.git
cd DOCs_Management_MVP
```

### 2. Backend Setup

```bash
cd backend
npm install
```

---

## 🔐 Environment Variables

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/docs_management?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=3000

# AWS S3 Configuration
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# Email Service (Resend)
RESENT_API="your-resend-api-key"

# Redis Configuration
REDIS_URL="redis://localhost:6379"
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `JWT_SECRET` | Secret key for JWT token signing | `your-random-secret-string` |
| `PORT` | Backend server port | `3000` |
| `AWS_ACCESS_KEY_ID` | AWS IAM access key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region for S3 bucket | `us-east-1` |
| `AWS_S3_BUCKET` | S3 bucket name | `my-docs-bucket` |
| `RESENT_API` | Resend API key for emails | `re_123456789` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |

### Setting up AWS S3

1. Create an AWS account and navigate to S3
2. Create a new bucket with a unique name
3. Create an IAM user with S3 permissions
4. Generate access keys for the IAM user
5. Add the credentials to your `.env` file

### Setting up Resend

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use the development domain
3. Generate an API key
4. Add the key to your `.env` file

---

## ▶️ Running the Application

### 1. Start PostgreSQL

Make sure PostgreSQL is running on your system.

**Windows**:
```bash
# PostgreSQL should start automatically
# Or use services.msc to start it manually
```

**Linux/Mac**:
```bash
sudo service postgresql start
# or
brew services start postgresql
```

### 2. Start Redis

**Windows**:
```bash
redis-server
```

**Linux/Mac**:
```bash
redis-server
# or
brew services start redis
```

### 3. Initialize Database

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 4. Start Backend Server

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The backend will start at `http://localhost:3000`

### 5. Access the Application

Open your browser and navigate to:
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api

---

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "sec_password": "optional-security-password"
}
```

#### Sign In
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

#### Verify Email
```http
POST /auth/verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "123456"
}
```

#### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

### Books Endpoints

All book endpoints require JWT authentication:
```http
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create Book
```http
POST /books
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "title": "My Project Documentation",
  "description": "Technical documentation for my project",
  "sec_password": "optional-extra-security"
}
```

#### Get All Books
```http
GET /books
Authorization: Bearer YOUR_JWT_TOKEN

# With search
GET /books?search=project
```

#### Get Single Book
```http
GET /books/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Book
```http
PUT /books/:id
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

#### Delete Book
```http
DELETE /books/:id
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "sec_password": "your-security-password"
}
```

### Entities Endpoints

#### Create Entity
```http
POST /entities
Content-Type: multipart/form-data
Authorization: Bearer YOUR_JWT_TOKEN

Fields:
- book_id: number
- title: string (1-50 chars)
- content: string (0-5000 chars, optional)
- tags: string[] (comma-separated tag IDs, optional)
- attachments: File[] (up to 10 files, 50MB each, optional)
```

#### Get All Entities by Book
```http
GET /entities/book/:bookId
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Single Entity
```http
GET /entities/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Entity
```http
PATCH /entities/:id
Content-Type: multipart/form-data
Authorization: Bearer YOUR_JWT_TOKEN

Fields:
- title: string (optional)
- content: string (optional)
- tags: string[] (optional)
- attachments: File[] (optional, adds new files)
```

#### Delete Entity
```http
DELETE /entities/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Delete Attachment
```http
DELETE /entities/:id/attachments/:attachmentId
Authorization: Bearer YOUR_JWT_TOKEN
```

### User Endpoints

#### Get Current User
```http
GET /users/me
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Update Current User
```http
PUT /users/me
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN

{
  "username": "newusername",
  "email": "newemail@example.com",
  "password": "newpassword",
  "sec_password": "newsecpassword"
}
```

#### Delete Account
```http
DELETE /users/me
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📁 Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── app.module.ts           # Root application module
│   ├── main.ts                 # Application entry point
│   │
│   ├── Auth/                   # Authentication module
│   │   ├── auth.controller.ts  # Auth endpoints
│   │   ├── auth.service.ts     # Auth business logic
│   │   ├── email-service.service.ts  # Email notifications
│   │   ├── DTOs/               # Data transfer objects
│   │   ├── decorators/         # Custom decorators
│   │   ├── guards/             # JWT guard
│   │   ├── strategy/           # Passport JWT strategy
│   │   └── utilities/          # Helper functions
│   │
│   ├── user/                   # User management module
│   │   ├── user.controller.ts  # User endpoints
│   │   ├── user.service.ts     # User business logic
│   │   └── DTos/               # Update user DTOs
│   │
│   ├── book/                   # Books module
│   │   ├── book.controller.ts  # Book endpoints
│   │   ├── book.service.ts     # Book business logic
│   │   └── DTOs/               # Book DTOs
│   │
│   ├── entity/                 # Entities module
│   │   ├── entity.controller.ts # Entity endpoints
│   │   ├── entity.service.ts   # Entity business logic
│   │   └── dto/                # Entity DTOs
│   │
│   ├── aws-s3/                 # AWS S3 integration
│   │   ├── aws-s3.service.ts   # S3 operations
│   │   └── aws-s3.module.ts
│   │
│   ├── cache/                  # Redis caching
│   │   ├── cache.service.ts    # Cache operations
│   │   └── cache.module.ts
│   │
│   ├── mail/                   # Email service
│   │   ├── mail.service.ts     # Email sending
│   │   └── mail.module.ts
│   │
│   └── prisma/                 # Prisma ORM
│       ├── prisma.service.ts   # Prisma client
│       └── prisma.module.ts
│
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
│
├── generated/                  # Generated Prisma client
├── test/                       # E2E tests
├── .env                        # Environment variables
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

---

## 🎯 Key Features Explained

### 1. Authentication Flow

```typescript
// User signs up
POST /auth/signup
  ↓
// Email verification code sent
Email Service (Resend)
  ↓
// User verifies email
POST /auth/verify-email
  ↓
// User can now sign in
POST /auth/signin
  ↓
// JWT token returned
{ access_token: "...", expires_in: 3600 }
  ↓
// Token stored in localStorage
// Used for all subsequent requests
```

### 2. File Upload Process

```typescript
// Client sends files as multipart/form-data
FormData with attachments
  ↓
// Backend: Multer processes files
@UseInterceptors(FilesInterceptor('attachments', 10))
  ↓
// Validation: Size, type, count
fileFilter: (req, file, callback) => {...}
  ↓
// Upload to AWS S3
aws-s3.service.uploadFile(file, userId)
  ↓
// Generate unique key
`user-${userId}/img/${timestamp}-${random}.${ext}`
  ↓
// Store metadata in database
{ url, S3_Key, type, size, entity_id }
  ↓
// Return URL to client
{ url: "https://bucket.s3.region.amazonaws.com/..." }
```

### 3. Caching Strategy

```typescript
// Read operation
GET /entities/:id
  ↓
// Check cache first
const cached = await cache.get(`Entity:${userId}:${id}`)
  ↓
if (cached) return cached
  ↓
// Cache miss: query database
const entity = await prisma.entity.findUnique(...)
  ↓
// Store in cache with TTL
await cache.set(key, entity, 300) // 5 minutes
  ↓
return entity

// Write operation
POST /entities
  ↓
// Create entity in database
const entity = await prisma.entity.create(...)
  ↓
// Invalidate related caches
await cache.del(`Entity:${userId}`)
await cache.del(`Entity:${userId}:Book:${bookId}`)
  ↓
return entity
```

### 4. Security Password Feature

The secondary password (`sec_password`) adds an extra layer of security for sensitive operations:

- **Purpose**: Protect critical actions like book deletion
- **Storage**: Hashed with Argon2 (same as main password)
- **Usage**: Required when deleting books
- **Optional**: Users can choose not to set it

---

## 🔒 Security Features

### 1. Password Security
- **Hashing**: Argon2 (winner of Password Hashing Competition)
- **Salting**: Automatic unique salt per password
- **No Plain Text**: Passwords never stored or transmitted in plain text

### 2. JWT Authentication
- **Token Expiration**: 1 hour validity
- **Secure Secret**: Configurable JWT secret
- **Bearer Tokens**: Tokens sent in Authorization header

### 3. Input Validation
- **Backend**: class-validator for all DTOs
- **Sanitization**: Input sanitization to prevent XSS

### 4. CORS Configuration
- **Configurable Origins**: CORS can be configured for allowed origins
- **Credentials**: Cookies and authorization headers supported
- **Methods**: Only necessary HTTP methods allowed

### 5. File Upload Security
- **File Type Validation**: Only images and videos allowed
- **Size Limits**: 50MB per file maximum
- **Count Limits**: Maximum 10 files per upload
- **Organized Storage**: Files organized by user ID in S3

### 6. Database Security
- **Parameterized Queries**: Prisma prevents SQL injection
- **Access Control**: User can only access their own data
- **Foreign Keys**: Referential integrity enforced

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Problem**: `Can't reach database server`

**Solution**:
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Check connection string in .env
# Make sure username, password, and database name are correct
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"

# Test connection
npx prisma db pull
```

#### 2. Redis Connection Error

**Problem**: `Error: Redis connection refused`

**Solution**:
```bash
# Check if Redis is running
redis-cli ping
# Should return "PONG"

# Start Redis if not running
redis-server

# Check Redis URL in .env
REDIS_URL="redis://localhost:6379"
```

#### 3. AWS S3 Upload Fails

**Problem**: `Failed to upload file: Access Denied`

**Solution**:
```bash
# Check AWS credentials in .env
# Make sure IAM user has S3 permissions

# Test AWS credentials
aws s3 ls s3://your-bucket-name --profile your-profile

# Required IAM permissions:
# - s3:PutObject
# - s3:GetObject
# - s3:DeleteObject
```

#### 4. CORS Errors

**Problem**: `Access to fetch blocked by CORS policy`

**Solution**:
```typescript
// In backend/src/main.ts
app.enableCors({
  origin: ['http://your-client-url.com'], // Add your client URL
  credentials: true,
});
```

#### 5. JWT Token Expired

**Problem**: `Unauthorized: Token expired`

**Solution**:
- Log out and log in again to get a new token
- Tokens expire after 1 hour by default
- Can be configured in `backend/src/Auth/auth.service.ts`

#### 6. Prisma Client Not Generated

**Problem**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
cd backend
npx prisma generate
```

#### 7. Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using the port
lsof -i :3000
# or on Windows
netstat -ano | findstr :3000

# Kill the process
kill -9 PID
# or on Windows
taskkill /PID PID /F

# Or change the port in .env
PORT=3001
```

---

## 🚀 Future Enhancements

### Planned Features

1. **AI-Powered Search**
   - Natural language search queries
   - RAG (Retrieval-Augmented Generation) integration
   - Semantic search across documents

2. **Collaboration Features**
   - Share books with other users
   - Real-time collaborative editing
   - Comments and annotations

3. **Advanced Tagging**
   - Hierarchical tags
   - Tag suggestions
   - Tag-based analytics

4. **Mobile Application**
   - React Native mobile app
   - Offline access
   - Push notifications

5. **Version Control**
   - Document version history
   - Diff viewing
   - Rollback capability

6. **Export/Import**
   - Export to PDF, Word, Markdown
   - Import from other platforms
   - Bulk operations

7. **Analytics Dashboard**
   - Usage statistics
   - Storage metrics
   - Activity timeline

8. **Advanced Security**
   - Two-factor authentication (2FA)
   - Session management
   - Audit logs

---

## 📄 Available Scripts

### Backend Scripts

```bash
# Development
npm run start:dev          # Start with hot-reload
npm run start:debug        # Start with debugger

# Production
npm run build              # Build for production
npm run start:prod         # Run production build

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Generate coverage report
npm run test:e2e           # Run end-to-end tests

# Database
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Create and apply migration
npx prisma migrate deploy  # Apply migrations in production
npx prisma studio          # Open Prisma Studio GUI
npx prisma db push         # Push schema changes without migration
npx prisma db pull         # Pull schema from database

# Linting
npm run lint               # Run ESLint
npm run format             # Format with Prettier
```

---

## 📞 Support

For issues, questions, or contributions:

- **GitHub Issues**: [Create an issue](https://github.com/HanyMaged4/DOCs_Management_MVP/issues)
- **Email**: hany.maged@example.com

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Hany Maged**
- GitHub: [@HanyMaged4](https://github.com/HanyMaged4)

---

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Prisma team for the excellent ORM
- All open-source contributors

---

**Happy Documenting! 📚✨**
