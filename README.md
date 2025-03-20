# Internship & Placement Portal

A comprehensive platform connecting students with internship and job opportunities, featuring AI-powered tools for career development.

## Project Structure

```
internship-portal/
├── web/                 # Next.js web application
│   ├── frontend/       # Student & Company portals
│   └── backend/        # Django backend
├── mobile/             # React Native mobile app
└── docs/              # Project documentation
```

## Features

### Student Portal
- Profile Creation
- Social Media & Portfolio Integration
- Skills Assessment
- AI-Powered Roadmap Generator
- Resume Checker
- AI Interview Preparation Chatbot
- Job/Internship Listings
- Application Tracker

### Company Portal
- Job/Internship Posting
- Student Database Access
- Application Management
- AI Candidate Matching

### Admin Dashboard
- Job Posting Management
- Application Monitoring
- Analytics & Reporting

## Tech Stack

### Web Application
- Frontend: Next.js
- Backend: Django
- Database: Supabase

### Mobile Application
- React Native
- Supabase

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- React Native development environment
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies for each component:
   ```bash
   # Web Frontend
   cd web/frontend
   npm install

   # Web Backend
   cd web/backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt

   # Mobile App
   cd mobile
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in each component directory
   - Add necessary API keys and configuration

4. Start the development servers:
   ```bash
   # Web Frontend
   cd web/frontend
   npm run dev

   # Web Backend
   cd web/backend
   python manage.py runserver

   # Mobile App
   cd mobile
   npm start
   ```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 