import google.generativeai as genai
from django.conf import settings
from typing import Dict, List, Any
import re
import json

class ATSReviewer:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
        
    def analyze_resume(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """
        Comprehensive ATS analysis of resume against job description
        """
        prompt = f"""
        As an ATS (Applicant Tracking System) expert, analyze this resume against the job description.
        Provide a detailed analysis focusing on ATS optimization and keyword matching.

        Job Description:
        {job_description}

        Resume:
        {resume_text}

        Provide analysis in the following JSON format:
        {{
            "ats_score": float,  # 0-100 score of ATS compatibility
            "keyword_analysis": {{
                "matched_keywords": List[str],  # Keywords from job description found in resume
                "missing_keywords": List[str],  # Important keywords from job description missing
                "keyword_density": Dict[str, float]  # Frequency of each matched keyword
            }},
            "format_analysis": {{
                "is_ats_friendly": bool,
                "format_issues": List[str],
                "recommendations": List[str]
            }},
            "content_analysis": {{
                "section_completeness": Dict[str, float],  # 0-100 score for each section
                "content_quality": Dict[str, str],  # Quality assessment of each section
                "improvement_suggestions": List[str]
            }},
            "optimization_tips": List[str]  # Specific tips to improve ATS compatibility
        }}
        """
        
        response = self.model.generate_content(prompt)
        return json.loads(response.text)

    def extract_keywords(self, text: str) -> List[str]:
        """
        Extract important keywords from text
        """
        # Common technical keywords
        technical_keywords = [
            'python', 'java', 'javascript', 'react', 'angular', 'vue', 'node.js',
            'sql', 'nosql', 'aws', 'azure', 'docker', 'kubernetes', 'git',
            'agile', 'scrum', 'ci/cd', 'rest', 'api', 'microservices'
        ]
        
        # Extract words that match technical keywords
        found_keywords = []
        for keyword in technical_keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text.lower()):
                found_keywords.append(keyword)
        
        return found_keywords

    def check_format_compatibility(self, resume_text: str) -> Dict[str, Any]:
        """
        Check resume format for ATS compatibility
        """
        format_issues = []
        
        # Check for common ATS-unfriendly elements
        if re.search(r'[^\x00-\x7F]', resume_text):
            format_issues.append("Contains non-ASCII characters")
        
        if re.search(r'<img|<table|<div', resume_text, re.IGNORECASE):
            format_issues.append("Contains HTML tags")
        
        if re.search(r'[^\w\s.,;:()\-]', resume_text):
            format_issues.append("Contains special characters that might confuse ATS")
        
        # Check section headers
        required_sections = ['experience', 'education', 'skills']
        missing_sections = []
        for section in required_sections:
            if not re.search(r'\b' + section + r'\b', resume_text.lower()):
                missing_sections.append(section)
        
        if missing_sections:
            format_issues.append(f"Missing standard sections: {', '.join(missing_sections)}")
        
        return {
            "is_ats_friendly": len(format_issues) == 0,
            "format_issues": format_issues,
            "recommendations": self._generate_format_recommendations(format_issues)
        }

    def _generate_format_recommendations(self, issues: List[str]) -> List[str]:
        """
        Generate specific recommendations based on format issues
        """
        recommendations = []
        
        for issue in issues:
            if "non-ASCII" in issue:
                recommendations.append("Replace any special characters with standard ASCII equivalents")
            elif "HTML tags" in issue:
                recommendations.append("Remove all HTML formatting and use plain text")
            elif "special characters" in issue:
                recommendations.append("Use only standard punctuation marks")
            elif "Missing standard sections" in issue:
                recommendations.append("Add clear section headers for Experience, Education, and Skills")
        
        return recommendations

    def analyze_section_completeness(self, resume_text: str) -> Dict[str, float]:
        """
        Analyze completeness of different resume sections
        """
        sections = {
            "contact_info": self._check_contact_info(resume_text),
            "summary": self._check_summary(resume_text),
            "experience": self._check_experience(resume_text),
            "education": self._check_education(resume_text),
            "skills": self._check_skills(resume_text)
        }
        
        return sections

    def _check_contact_info(self, text: str) -> float:
        """
        Check completeness of contact information
        """
        score = 0
        required_fields = ['email', 'phone', 'location']
        
        for field in required_fields:
            if re.search(r'\b' + field + r'\b', text.lower()):
                score += 33.33
        
        return round(score, 2)

    def _check_summary(self, text: str) -> float:
        """
        Check quality of professional summary
        """
        if not re.search(r'\b(summary|objective|profile)\b', text.lower()):
            return 0
        
        summary_section = re.split(r'\b(experience|education|skills)\b', text.lower())[0]
        if len(summary_section.split()) >= 50:
            return 100
        elif len(summary_section.split()) >= 25:
            return 50
        return 25

    def _check_experience(self, text: str) -> float:
        """
        Check completeness of experience section
        """
        if not re.search(r'\b(experience|work history|employment)\b', text.lower()):
            return 0
        
        experience_section = re.split(r'\b(education|skills)\b', text.lower())[0]
        entries = re.findall(r'\d{4}[-–]\d{4}|\d{4}[-–]present', experience_section)
        
        if len(entries) >= 3:
            return 100
        elif len(entries) >= 2:
            return 75
        elif len(entries) >= 1:
            return 50
        return 25

    def _check_education(self, text: str) -> float:
        """
        Check completeness of education section
        """
        if not re.search(r'\b(education|academic|degree)\b', text.lower()):
            return 0
        
        education_section = re.split(r'\b(skills|experience)\b', text.lower())[0]
        entries = re.findall(r'\b(bachelor|master|phd|degree|diploma)\b', education_section.lower())
        
        if len(entries) >= 2:
            return 100
        elif len(entries) >= 1:
            return 75
        return 50

    def _check_skills(self, text: str) -> float:
        """
        Check completeness of skills section
        """
        if not re.search(r'\b(skills|technical skills|competencies)\b', text.lower()):
            return 0
        
        skills_section = re.split(r'\b(experience|education)\b', text.lower())[-1]
        skills = re.findall(r'\b(python|java|javascript|sql|aws|react|angular|vue|node\.js|git|docker|kubernetes|agile|scrum)\b', skills_section.lower())
        
        if len(skills) >= 5:
            return 100
        elif len(skills) >= 3:
            return 75
        elif len(skills) >= 1:
            return 50
        return 25 