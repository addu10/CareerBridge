# Internship Portal API Documentation

This document provides comprehensive documentation for the Internship Portal API endpoints.

## Base URL
All API endpoints are prefixed with `/api/`

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Authentication & User Management (`/api/users/`)

#### Authentication
- `POST /api/users/login/` - Login
- `POST /api/users/logout/` - Logout
- `POST /api/users/password/change/` - Change password
- `POST /api/users/password/reset/` - Request password reset
- `POST /api/users/password/reset/confirm/` - Confirm password reset

#### User Management
- `GET /api/users/users/` - List all users
- `POST /api/users/users/` - Create new user
- `GET /api/users/users/{id}/` - Get user details
- `PUT /api/users/users/{id}/` - Update user
- `DELETE /api/users/users/{id}/` - Delete user

#### Student Profiles
- `GET /api/users/student-profiles/` - List student profiles
- `POST /api/users/student-profiles/` - Create student profile
- `GET /api/users/student-profiles/{id}/` - Get student profile
- `PUT /api/users/student-profiles/{id}/` - Update student profile

#### Company Profiles
- `GET /api/users/company-profiles/` - List company profiles
- `POST /api/users/company-profiles/` - Create company profile
- `GET /api/users/company-profiles/{id}/` - Get company profile
- `PUT /api/users/company-profiles/{id}/` - Update company profile

### 2. Jobs & Internships (`/api/jobs/`)

#### Job Categories
- `GET /api/jobs/categories/` - List all job categories
- `POST /api/jobs/categories/` - Create new job category
- `GET /api/jobs/categories/{id}/` - Get category details
- `PUT /api/jobs/categories/{id}/` - Update category
- `DELETE /api/jobs/categories/{id}/` - Delete category

Example Job Category:
```json
{
    "id": 1,
    "name": "Software Development",
    "slug": "software-development",
    "description": "Roles related to software development and programming",
    "icon": "code",
    "created_at": "2024-03-19T12:00:00Z",
    "updated_at": "2024-03-19T12:00:00Z"
}
```

Example Request:
```bash
# Create a new job category
POST /api/jobs/categories/
{
    "name": "Data Science",
    "slug": "data-science",
    "description": "Roles related to data analysis and machine learning",
    "icon": "analytics"
}

# List job categories
GET /api/jobs/categories/

# Get jobs in a specific category (using slug)
GET /api/jobs/jobs/?category=data-science
```

Note: The slug is automatically generated from the name if not provided. It should be:
- Lowercase
- Hyphenated (spaces replaced with hyphens)
- URL-friendly (no special characters)
- Unique across all categories

#### Jobs
- `GET /api/jobs/jobs/` - List all jobs
- `POST /api/jobs/jobs/` - Create new job
- `GET /api/jobs/jobs/{id}/` - Get job details
- `PUT /api/jobs/jobs/{id}/` - Update job
- `DELETE /api/jobs/jobs/{id}/` - Delete job

#### Company-specific Jobs
- `GET /api/jobs/company/jobs/` - List company's jobs
- `GET /api/jobs/company/jobs/{id}/` - Get company's job details

#### Internships
- `GET /api/jobs/internships/` - List all internships
- `POST /api/jobs/internships/` - Create new internship
- `GET /api/jobs/internships/{id}/` - Get internship details
- `PUT /api/jobs/internships/{id}/` - Update internship
- `DELETE /api/jobs/internships/{id}/` - Delete internship

#### Company-specific Internships
- `GET /api/jobs/company/internships/` - List company's internships
- `GET /api/jobs/company/internships/{id}/` - Get company's internship details

### 3. Applications (`/api/applications/`)

#### Applications
- `GET /api/applications/applications/` - List all applications
- `POST /api/applications/applications/` - Create new application
- `GET /api/applications/applications/{id}/` - Get application details
- `PUT /api/applications/applications/{id}/` - Update application
- `DELETE /api/applications/applications/{id}/` - Delete application

#### Company-specific Applications
- `GET /api/applications/company/applications/` - List company's applications
- `GET /api/applications/company/applications/{id}/` - Get company's application details

### 4. AI Services (`/api/ai/`)

#### Resume Analysis
- `GET /api/ai/resume-analysis/` - List resume analyses
- `POST /api/ai/resume-analysis/` - Create new resume analysis
- `GET /api/ai/resume-analysis/{id}/` - Get resume analysis details
- `PUT /api/ai/resume-analysis/{id}/` - Update resume analysis

#### Interview Preparation
- `GET /api/ai/interview-prep/` - List interview preparations
- `POST /api/ai/interview-prep/` - Create new interview preparation
- `GET /api/ai/interview-prep/{id}/` - Get interview preparation details
- `PUT /api/ai/interview-prep/{id}/` - Update interview preparation

#### Career Roadmap
- `GET /api/ai/career-roadmap/` - List career roadmaps
- `POST /api/ai/career-roadmap/` - Create new career roadmap
- `GET /api/ai/career-roadmap/{id}/` - Get career roadmap details
- `PUT /api/ai/career-roadmap/{id}/` - Update career roadmap

## Additional Features

### 1. Filtering & Search
All list endpoints support filtering and search. Examples:
- `GET /api/jobs/jobs/?type=full_time&location=remote`
- `GET /api/jobs/internships/?duration=3&paid=true`

### 2. File Uploads
- Profile pictures: `POST /api/users/users/{id}/profile_picture/`
- Company logos: `POST /api/users/company-profiles/{id}/logo/`
- Resumes: `POST /api/applications/applications/{id}/resume/`

### 3. Pagination
All list endpoints are paginated:
- Default page size: 10
- Example: `GET /api/jobs/jobs/?page=2`

## Error Responses
The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting
API requests are limited to 100 requests per minute per user.

## Versioning
The current API version is v1. All endpoints are prefixed with `/api/`.

## Authentication

### Register
- **URL**: `/api/auth/register/`
- **Method**: `POST`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "secure_password",
    "user_type": "student",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```
- **Response**: User object with token

### Login
- **URL**: `/api/auth/login/`
- **Method**: `POST`
- **Description**: Login user and get token
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "secure_password"
  }
  ```
- **Response**: Token and user object

## User Management

### Get User Profile
- **URL**: `/api/users/profile/`
- **Method**: `GET`
- **Description**: Get current user's profile
- **Headers**: `Authorization: Token <token>`
- **Response**: User profile object

### Update User Profile
- **URL**: `/api/users/profile/`
- **Method**: `PATCH`
- **Description**: Update user profile
- **Headers**: `Authorization: Token <token>`
- **Request Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890",
    "graduation_year": 2025,
    "branch": "Computer Science",
    "skills": ["Python", "JavaScript", "React"],
    "github_url": "https://github.com/username",
    "linkedin_url": "https://linkedin.com/in/username"
  }
  ```

## Job Management

### List Jobs
- **URL**: `/api/jobs/`
- **Method**: `GET`
- **Description**: Get list of jobs with filtering
- **Query Parameters**:
  - `category`: Filter by job category
  - `type`: Filter by job type (full_time, part_time, internship)
  - `location`: Filter by location
  - `search`: Search in title and description
- **Response**: List of jobs with pagination

### Get Job Details
- **URL**: `/api/jobs/{id}/`
- **Method**: `GET`
- **Description**: Get detailed information about a job
- **Response**: Job object with company details

### Create Job (Company Only)
- **URL**: `/api/jobs/`
- **Method**: `POST`
- **Description**: Create a new job posting
- **Headers**: `Authorization: Token <token>`
- **Request Body**:
  ```json
  {
    "title": "Software Engineer",
    "description": "Job description...",
    "requirements": "Required skills...",
    "location": "New York",
    "type": "full_time",
    "salary_min": 80000,
    "salary_max": 120000,
    "deadline": "2024-12-31"
  }
  ```

## Applications

### Apply for Job
- **URL**: `/api/applications/`
- **Method**: `POST`
- **Description**: Apply for a job
- **Headers**: `Authorization: Token <token>`
- **Request Body**:
  ```json
  {
    "job_id": "job-uuid",
    "cover_letter": "Cover letter text...",
    "resume": "resume-file"
  }
  ```
- **Response**: Application object

### List Applications
- **URL**: `/api/applications/`
- **Method**: `GET`
- **Description**: Get user's applications
- **Headers**: `Authorization: Token <token>`
- **Response**: List of applications with status

### Update Application Status (Company Only)
- **URL**: `/api/applications/{id}/`
- **Method**: `PATCH`
- **Description**: Update application status
- **Headers**: `Authorization: Token <token>`
- **Request Body**:
  ```json
  {
    "status": "shortlisted",
    "notes": "Interview scheduled for next week"
  }
  ```

## AI Services

### Resume Analysis
- **URL**: `/api/ai/resume-analysis/`
- **Method**: `POST`
- **Description**: Analyze resume using AI
- **Headers**: `Authorization: Token <token>`
- **Request Body**:
  ```json
  {
    "resume": "resume-file",
    "job_description": "Optional job description for matching"
  }
  ```
- **Response**:
  ```json
  {
    "analysis": "Detailed analysis text",
    "skills": ["Python", "JavaScript", "React"],
    "experience_level": "Intermediate",
    "recommendations": ["Improve documentation skills", "Add more projects"]
  }
  ```

### Interview Preparation
- **URL**: `/api/ai/interview-prep/`
- **Method**: `POST`
- **Description**: Generate interview preparation content
- **Headers**: `Authorization: Token <token>`
- **Request Body**:
  ```json
  {
    "job_title": "Software Engineer",
    "company": "Tech Company",
    "resume": "resume-file"
  }
  ```
- **Response**:
  ```json
  {
    "preparation_content": "Detailed preparation guide",
    "common_questions": [
      "Tell me about yourself",
      "Why do you want to work here?"
    ],
    "technical_questions": [
      "Explain REST APIs",
      "What is OOP?"
    ],
    "behavioral_questions": [
      "Describe a challenging project",
      "How do you handle deadlines?"
    ],
    "tips": [
      "Research the company thoroughly",
      "Prepare questions for the interviewer"
    ]
  }
  ```

### Career Roadmap
- **URL**: `/api/ai/career-roadmap/`
- **Method**: `POST`
- **Description**: Generate personalized career roadmap
- **Headers**: `Authorization: Token <token>`
- **Request Body**:
  ```json
  {
    "current_role": "Junior Developer",
    "target_role": "Senior Software Engineer",
    "experience": 2,
    "skills": ["Python", "JavaScript", "React"]
  }
  ```
- **Response**:
  ```json
  {
    "roadmap": "Detailed roadmap text",
    "required_skills": ["System Design", "Leadership"],
    "timeline": {
      "short_term": "Next 6 months",
      "medium_term": "1-2 years",
      "long_term": "3-5 years"
    },
    "resources": [
      "System Design Course",
      "Leadership Workshop"
    ]
  }
  ```

### ATS Review
- **URL**: `/api/ai/ats-review/`
- **Method**: `POST`
- **Description**: Get ATS-friendly resume review
- **Headers**: `Authorization: Token <token>`
- **Request Body**:
  ```json
  {
    "resume": "resume-file",
    "job_id": "job-uuid"
  }
  ```
- **Response**:
  ```json
  {
    "ats_score": 85.5,
    "matched_keywords": ["Python", "React", "Git"],
    "missing_keywords": ["Docker", "AWS"],
    "format_analysis": {
      "compatibility": "High",
      "issues": []
    },
    "section_completeness": {
      "summary": "Complete",
      "experience": "Complete",
      "education": "Complete",
      "skills": "Complete"
    },
    "optimization_tips": [
      "Add Docker experience",
      "Include AWS certifications"
    ]
  }
  ```

## Job Categories

### List Categories
- **URL**: `/api/jobs/categories/`
- **Method**: `GET`
- **Description**: Get list of job categories
- **Response**: List of categories with slugs

### Create Category (Admin Only)
- **URL**: `/api/jobs/categories/`
- **Method**: `POST`
- **Description**: Create new job category
- **Headers**: `Authorization: Token <token>`
- **Request Body**:
  ```json
  {
    "name": "Full Stack Development",
    "description": "Full stack development roles"
  }
  ```
- **Response**: Category object with auto-generated slug

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid input data",
  "details": {
    "field": ["Error message"]
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication credentials were not provided"
}
```

### 403 Forbidden
```json
{
  "error": "You do not have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "An unexpected error occurred"
}
```

## Rate Limiting

- All endpoints are rate-limited to 100 requests per minute per user
- Rate limit headers are included in responses:
  - `X-RateLimit-Limit`: Maximum requests per minute
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time until limit resets

## File Uploads

- Maximum file size: 10MB
- Supported formats:
  - Resumes: PDF, DOC, DOCX
  - Images: JPG, PNG
  - Documents: PDF, DOC, DOCX
- Files are stored securely and processed asynchronously

## Pagination

List endpoints support pagination with the following query parameters:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 10, max: 100)

Response includes pagination metadata:
```json
{
  "count": 100,
  "next": "http://api.example.org/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
``` 