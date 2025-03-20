import google.generativeai as genai
from django.conf import settings
from typing import Dict, List, Any
import re
import json

class ATSReviewer:
    def __init__(self):
        try:
            genai.configure(
                api_key="AIzaSyC9thMMTST1V85nN8e7EjISEVegtttlBrI"
            )
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            # Test the model
            test_response = self.model.generate_content("Test")
            if not test_response.text:
                raise ValueError("Model initialization test failed")
            print("Successfully initialized ATS Review model")
        except Exception as e:
            print(f"Error initializing AI model: {str(e)}")
            self.model = None
        
    def analyze_resume(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """
        Comprehensive ATS analysis of resume against job description
        """
        if self.model is None:
            return {
                "ats_score": 0,
                "keyword_analysis": {
                    "matched_keywords": [],
                    "missing_keywords": [],
                    "keyword_density": {}
                },
                "format_analysis": {
                    "is_ats_friendly": False,
                    "format_issues": ["AI model is not available. Please check your API configuration."],
                    "recommendations": ["Please try again later when the AI service is available."]
                },
                "content_analysis": {
                    "section_completeness": {
                        "contact": 0,
                        "summary": 0,
                        "education": 0,
                        "experience": 0,
                        "skills": 0
                    },
                    "content_quality": {
                        "achievements": "Could not analyze",
                        "experience_details": "Could not analyze",
                        "skills_presentation": "Could not analyze"
                    },
                    "improvement_suggestions": ["Error analyzing content"]
                },
                "optimization_tips": ["AI model is not available"]
            }
            
        # Extract keywords from job description
        job_keywords = self.extract_keywords(job_description)
        
        # Check resume format compatibility
        format_analysis = self.check_format_compatibility(resume_text)
        
        # Analyze section completeness
        section_analysis = self.analyze_section_completeness(resume_text)
        
        # Prepare the prompt for the AI model
        prompt = f"""
        Analyze this resume against the job description for ATS compatibility.
        
        Resume:
        {resume_text}
        
        Job Description:
        {job_description}
        
        Return your analysis in this exact JSON format without any additional text or explanation:
        {{
            "ats_score": <number between 0-100>,
            "keyword_analysis": {{
                "matched_keywords": [<list of keywords found in both resume and job description>],
                "missing_keywords": [<important keywords from job description missing in resume>],
                "keyword_density": {{<keyword>: <count in resume>}}
            }},
            "format_analysis": {{
                "is_ats_friendly": <boolean>,
                "format_issues": [<list of ATS format issues>],
                "recommendations": [<list of format improvement recommendations>]
            }},
            "content_analysis": {{
                "section_completeness": {{
                    "contact": <0-100 score>,
                    "summary": <0-100 score>,
                    "education": <0-100 score>,
                    "experience": <0-100 score>,
                    "skills": <0-100 score>
                }},
                "content_quality": {{
                    "achievements": "<evaluation of achievement descriptions>",
                    "experience_details": "<evaluation of experience descriptions>",
                    "skills_presentation": "<evaluation of skills presentation>"
                }},
                "improvement_suggestions": [<specific content improvement suggestions>]
            }},
            "optimization_tips": [<list of actionable tips to improve ATS compatibility>]
        }}
        """
        
        try:
            response = self.model.generate_content(prompt)
            if not response.text:
                return self._get_fallback_response("Empty response from Gemini API")
                
            # Extract JSON from the response text
            # First, try direct parsing
            try:
                result = json.loads(response.text)
            except json.JSONDecodeError:
                # If direct parsing fails, try to extract JSON from the text
                text = response.text
                # Find JSON-like content between curly braces
                match = re.search(r'\{.*\}', text, re.DOTALL)
                if match:
                    try:
                        result = json.loads(match.group(0))
                    except:
                        print("Could not parse JSON from response")
                        return self._get_fallback_response("Invalid response format from Gemini API")
                else:
                    print("No JSON content found in response")
                    return self._get_fallback_response("Invalid response format from Gemini API")
            
            # Validate required fields
            required_fields = ['ats_score', 'keyword_analysis', 'format_analysis', 'content_analysis', 'optimization_tips']
            if not all(field in result for field in required_fields):
                print("Missing required fields in AI response")
                return self._get_fallback_response("Incomplete analysis from AI model")
                
            return result
            
        except Exception as e:
            print(f"Error in ATS analysis: {str(e)}")
            return self._get_fallback_response(str(e))

    def _get_fallback_response(self, error_message: str) -> Dict[str, Any]:
        """Return a structured fallback response when analysis fails"""
        return {
            "ats_score": 0,
            "keyword_analysis": {
                "matched_keywords": [],
                "missing_keywords": ["Could not analyze keywords"],
                "keyword_density": {}
            },
            "format_analysis": {
                "is_ats_friendly": False,
                "format_issues": ["Could not analyze format"],
                "recommendations": ["Please try again"]
            },
            "content_analysis": {
                "section_completeness": {
                    "contact": 0,
                    "summary": 0,
                    "education": 0,
                    "experience": 0,
                    "skills": 0
                },
                "content_quality": {
                    "achievements": "Could not analyze",
                    "experience_details": "Could not analyze",
                    "skills_presentation": "Could not analyze"
                },
                "improvement_suggestions": ["Error analyzing content"]
            },
            "optimization_tips": ["Analysis failed: " + error_message]
        }

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
            "contact": self._check_contact_info(resume_text),
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