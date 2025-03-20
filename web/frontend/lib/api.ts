import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface User {
  id: number;
  email: string;
  user_type: 'student' | 'company';
  first_name: string;
  last_name: string;
  phone_number: string;
  profile_picture: string | null;
  // Student fields
  graduation_year: number | null;
  branch: string;
  skills: string[];
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  // Company fields
  company_name?: string;
  company_description?: string;
  company_website?: string;
  company_logo?: string;
  // Timestamps
  created_at: string;
  updated_at: string;
}

interface TokenResponse {
  access: string;
  refresh: string;
  user: User;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Try to refresh the token
        const response = await axios.post<{ access: string }>(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('accessToken', access);

        // Retry the original request with the new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Export the API instance
export default api;

// Auth API
export const login = async (username: string, password: string): Promise<TokenResponse> => {
  // Get the JWT token
  console.log('Attempting login with:', { username, password: '***' });
  try {
    // Use the full URL to avoid any path issues
    const response = await axios.post<TokenResponse>(`${API_URL}/token/`, { 
      // The /api/token/ endpoint expects a username parameter for both email and username logins
      username,
      password
    });
    console.log('Login response:', response.data);
    
    // Set default headers for future requests
    if (response.data && response.data.access) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    }
    
    // Provide more descriptive error messages
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Invalid username or password. Please try again.');
      } else if (error.response.data?.detail) {
        throw new Error(error.response.data.detail);
      }
    }
    
    throw error;
  }
};

export const companyLogin = async (username: string, password: string): Promise<TokenResponse> => {
  console.log('Attempting company login with:', { username, password: '***' });
  try {
    // The CompanyLoginView expects 'email' field, not 'username'
    const response = await axios.post<TokenResponse>(`${API_URL}/users/company/login/`, { 
      email: username, // Convert username to email parameter
      password
    });
    console.log('Company login response:', response.data);
    
    // Set default headers for future requests
    if (response.data && response.data.access) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Company login error:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    }
    
    // Provide more descriptive error messages
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Invalid username or password. Please try again.');
      } else if (error.response.data?.detail) {
        throw new Error(error.response.data.detail);
      } else if (error.response.data?.email) {
        throw new Error(`Email error: ${error.response.data.email}`);
      } else if (error.response.data?.password) {
        throw new Error(`Password error: ${error.response.data.password}`);
      } else if (typeof error.response.data === 'string') {
        throw new Error(error.response.data);
      }
    }
    
    throw error;
  }
};

export const register = async (userData: {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  user_type: 'student' | 'company';
}): Promise<User> => {
  const response = await api.post<User>('/users/', userData);
  return response.data;
};

export const companyRegister = async (userData: {
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  user_type: 'student' | 'company';
}): Promise<User> => {
  // Ensure user_type is company regardless of what was passed
  const companyData = {...userData, user_type: 'company' as const};
  const response = await api.post<User>('/users/company/register/', companyData);
  return response.data;
};

// Jobs API
interface BasePosition {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  created_at: string;
  status: string;
}

interface Job extends BasePosition {
  type: string;
  salary_range: string;
  posted_date: string;
}

interface Internship extends BasePosition {
  duration: string;
  deadline?: string;
}

interface JobsResponse {
  jobs: Job[];
}

interface InternshipsResponse {
  internships: Internship[];
}

export const getJobs = async (): Promise<JobsResponse> => {
  const response = await api.get<JobsResponse>('/jobs/');
  
  if (response.status !== 200) {
    throw new Error('Failed to fetch jobs');
  }

  return response.data;
};

export const getJobById = async (id: string) => {
  const response = await api.get(`/jobs/${id}/`);
  return response.data;
};

export const createJob = async (jobData: {
  title: string;
  description: string;
  requirements: string;
  category: string;
  location: string;
  salary_range: string;
  application_deadline: string;
}) => {
  const response = await api.post('/jobs/', jobData);
  return response.data;
};

// Applications API
interface CreateApplicationResponse {
  message: string;
  application: {
    id: number;
    status: string;
    created_at: string;
    job: {
      id: number;
      title: string;
      company: string;
      location: string;
      type: string;
      description: string;
      requirements: string[];
      salary_range: string;
      posted_date: string;
    };
  };
}

export const getApplications = async (params?: {
  page?: number;
  status?: string;
  job?: string;
}) => {
  const response = await api.get('/applications/', { params });
  return response.data;
};

export const createApplication = async (formData: FormData): Promise<CreateApplicationResponse> => {
  const response = await api.post<CreateApplicationResponse>('/applications/create/', formData);
  
  if (response.status !== 201) {
    throw new Error('Failed to create application');
  }

  return response.data;
};

export const updateApplicationStatus = async (id: string, status: string) => {
  const response = await api.patch(`/applications/${id}/`, { status });
  return response.data;
};

// AI Services API
interface ResumeAnalysisResponse {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
}

interface ATSAnalysisResponse {
  score: number;
  keyword_analysis: {
    matched_keywords: string[];
    missing_keywords: string[];
    keyword_density: { [key: string]: number };
  };
  format_analysis: {
    is_ats_friendly: boolean;
    format_issues: string[];
    recommendations: string[];
  };
  content_analysis: {
    section_completeness: { [key: string]: number };
    content_quality: { [key: string]: string };
    improvement_suggestions: string[];
  };
  optimization_tips: string[];
}

export const analyzeResume = async (formData: FormData): Promise<ResumeAnalysisResponse> => {
  const response = await api.post<ResumeAnalysisResponse>('/ai/resume-analysis/analyze/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const reviewATS = async (formData: FormData, jobDescription: string): Promise<ATSAnalysisResponse> => {
  // Add job description to form data
  formData.append('job_description', jobDescription);
  
  const response = await api.post<ATSAnalysisResponse>('/ai/ats-review/review/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const generateCareerRoadmap = async (data: {
  current_skills: string[];
  target_role: string;
  experience_level: string;
}) => {
  const response = await api.post('/ai/career-roadmap/generate_roadmap/', data);
  return response.data;
};

export const mockInterview = async (data: {
  job_title: string;
  experience_level: string;
  focus_areas?: string[];
}) => {
  const response = await api.post('/ai/mock-interview/', data);
  return response.data;
};

export async function downloadRoadmapPresentation(roadmapData: any): Promise<Blob> {
  const response = await fetch(
    `${API_URL}/api/ai/career-roadmap/download_roadmap/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ roadmap_data: roadmapData }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to download roadmap');
  }

  return response.blob();
}

// Profile Management
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/users/me/');
  return response.data;
};

export const updateStudentProfile = async (data: Partial<User>) => {
  const response = await api.patch('/users/me/', data);
  return response.data;
};

export const getStudentProfile = async () => {
  const response = await api.get('/users/me/');
  return response.data;
};

export const getCompanyProfile = async () => {
  const response = await api.get('/users/company-profiles/');
  return response.data;
};

export const updateCompanyProfile = async (data: any) => {
  const response = await api.patch('/users/company-profiles/', data);
  return response.data;
};

// Internships API
export const getInternships = async (): Promise<InternshipsResponse> => {
  const response = await api.get<InternshipsResponse>('/jobs/internships/');
  
  if (response.status !== 200) {
    throw new Error('Failed to fetch internships');
  }

  return response.data;
};

export const getInternshipById = async (id: string) => {
  const response = await api.get(`/jobs/internships/${id}/`);
  return response.data;
};

export const createInternship = async (data: {
  title: string;
  description: string;
  requirements: string;
  duration: string;
  location: string;
  stipend?: string;
  deadline?: string;
}) => {
  const response = await api.post('/jobs/internships/', data);
  return response.data;
};

// Company Operations
export const getCompanyJobs = async () => {
  const response = await api.get('/jobs/company/jobs/');
  return response.data;
};

export const getCompanyInternships = async () => {
  const response = await api.get('/jobs/company/internships/');
  return response.data;
};

export const getCompanyApplications = async (params?: {
  page?: number;
  status?: string;
  job?: string;
}) => {
  const response = await api.get('/applications/company/applications/', { params });
  return response.data;
};