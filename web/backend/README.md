# Internship & Placement Portal - Backend

This is the Django backend for the Internship & Placement Portal, providing APIs for user management, job listings, applications, and AI-powered services.

## Features

- User authentication and authorization
- Student and company profiles
- Job and internship listings
- Application management
- AI-powered services:
  - Resume analysis
  - Interview preparation
  - Career roadmap generation

## Prerequisites

- Python 3.8 or higher
- PostgreSQL
- Google AI (Gemini) API key
- Gmail account for sending emails

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd web/backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a PostgreSQL database:
```sql
CREATE DATABASE internship_portal;
```

5. Copy the environment variables file and update the values:
```bash
cp .env.example .env
```

6. Apply database migrations:
```bash
python manage.py migrate
```

7. Create a superuser:
```bash
python manage.py createsuperuser
```

8. Run the development server:
```bash
python manage.py runserver
```

## API Documentation

The API documentation is available at `/api/docs/` when running the server.

### Main Endpoints

#### Authentication
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout
- `POST /api/password/reset/` - Request password reset
- `POST /api/password/reset/confirm/` - Confirm password reset

#### Users
- `GET /api/users/` - List users
- `POST /api/users/` - Create user
- `GET /api/users/{id}/` - Get user details
- `PUT /api/users/{id}/` - Update user
- `DELETE /api/users/{id}/` - Delete user

#### Student Profiles
- `GET /api/student-profiles/` - List student profiles
- `PUT /api/student-profiles/{id}/` - Update student profile

#### Company Profiles
- `GET /api/company-profiles/` - List company profiles
- `PUT /api/company-profiles/{id}/` - Update company profile

#### Jobs
- `GET /api/jobs/` - List jobs
- `POST /api/jobs/` - Create job
- `GET /api/jobs/{id}/` - Get job details
- `PUT /api/jobs/{id}/` - Update job
- `DELETE /api/jobs/{id}/` - Delete job

#### Internships
- `GET /api/internships/` - List internships
- `POST /api/internships/` - Create internship
- `GET /api/internships/{id}/` - Get internship details
- `PUT /api/internships/{id}/` - Update internship
- `DELETE /api/internships/{id}/` - Delete internship

#### Applications
- `GET /api/applications/` - List applications
- `POST /api/applications/` - Create application
- `GET /api/applications/{id}/` - Get application details
- `PUT /api/applications/{id}/` - Update application

#### AI Services
- `POST /api/ai/resume-analysis/` - Analyze resume
- `POST /api/ai/interview-prep/` - Generate interview preparation
- `POST /api/ai/career-roadmap/` - Generate career roadmap

## Development

### Running Tests
```bash
python manage.py test
```

### Code Style
The project follows PEP 8 guidelines. You can check the code style using:
```bash
flake8
```

### Database Migrations
When making changes to models:
```bash
python manage.py makemigrations
python manage.py migrate
```

## Deployment

1. Set `DEBUG=False` in `.env`
2. Update `ALLOWED_HOSTS` with your domain
3. Configure your web server (e.g., Nginx)
4. Set up a production database
5. Configure email settings
6. Set up static file serving
7. Run migrations
8. Start the application server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 