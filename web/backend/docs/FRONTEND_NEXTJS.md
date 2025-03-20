# Next.js Frontend Development Guide

## Project Setup

### 1. Environment Setup
```bash
# Create new Next.js project
npx create-next-app@latest frontend
cd frontend

# Install required dependencies
npm install @supabase/supabase-js axios react-query @tanstack/react-query
npm install @headlessui/react @heroicons/react tailwindcss
npm install react-hook-form @hookform/resolvers yup
npm install react-hot-toast
```

### 2. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Project Structure
```
frontend/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI components
│   │   ├── forms/            # Form components
│   │   └── layouts/          # Layout components
│   ├── lib/                  # Utility functions
│   │   ├── api.ts           # API client
│   │   ├── supabase.ts      # Supabase client
│   │   └── utils.ts         # Helper functions
│   ├── hooks/               # Custom hooks
│   └── types/               # TypeScript types
├── public/                  # Static files
└── styles/                 # Global styles
```

## API Integration

### 1. API Client Setup
```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 2. React Query Setup
```typescript
// src/app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 3. API Hooks Example
```typescript
// src/hooks/useJobs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.get('/jobs/').then(res => res.data),
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/jobs/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
}
```

## Authentication

### 1. Auth Context
```typescript
// src/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

const AuthContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const { data } = await api.get('/users/profile/');
        setUser(data);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login/', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### 2. Protected Routes
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
```

## File Upload

### 1. Resume Upload Component
```typescript
// src/components/forms/ResumeUpload.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';

export function ResumeUpload() {
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('resume', data.resume[0]);
      
      const response = await api.post('/ai/resume-analysis/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        {...register('resume')}
      />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload Resume'}
      </button>
    </form>
  );
}
```

## Real-time Updates

### 1. WebSocket Setup
```typescript
// src/lib/websocket.ts
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
  auth: {
    token: localStorage.getItem('token'),
  },
});

export default socket;
```

### 2. Real-time Job Updates
```typescript
// src/hooks/useJobUpdates.ts
import { useEffect } from 'react';
import socket from '@/lib/websocket';

export function useJobUpdates(jobId: string) {
  useEffect(() => {
    socket.emit('join_job', jobId);

    socket.on('job_update', (data) => {
      // Handle job update
    });

    return () => {
      socket.emit('leave_job', jobId);
      socket.off('job_update');
    };
  }, [jobId]);
}
```

## Performance Optimization

### 1. Image Optimization
```typescript
// src/components/ui/OptimizedImage.tsx
import Image from 'next/image';

export function OptimizedImage({ src, alt, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={500}
      height={300}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."
      {...props}
    />
  );
}
```

### 2. API Response Caching
```typescript
// src/hooks/useCachedQuery.ts
import { useQuery } from '@tanstack/react-query';

export function useCachedQuery(key: string, queryFn: () => Promise<any>) {
  return useQuery({
    queryKey: [key],
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
}
```

## Error Handling

### 1. Global Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>;
    }

    return this.props.children;
  }
}
```

### 2. API Error Handling
```typescript
// src/lib/api.ts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Testing

### 1. Component Testing
```typescript
// src/components/__tests__/JobCard.test.tsx
import { render, screen } from '@testing-library/react';
import { JobCard } from '../JobCard';

describe('JobCard', () => {
  it('renders job information correctly', () => {
    const job = {
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
    };

    render(<JobCard job={job} />);
    
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Remote')).toBeInTheDocument();
  });
});
```

### 2. API Testing
```typescript
// src/lib/__tests__/api.test.ts
import api from '../api';

describe('API', () => {
  it('handles authentication correctly', async () => {
    const response = await api.post('/auth/login/', {
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.data).toHaveProperty('token');
    expect(response.data).toHaveProperty('user');
  });
});
```

## Deployment

### 1. Build Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-domain.supabase.co'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
```

### 2. Environment Variables
```env
# .env.production
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Best Practices

1. **Code Organization**
   - Use feature-based folder structure
   - Keep components small and focused
   - Use TypeScript for type safety

2. **State Management**
   - Use React Query for server state
   - Use Context for global UI state
   - Use local state for component-specific state

3. **Performance**
   - Implement proper code splitting
   - Use Next.js Image component
   - Implement proper caching strategies

4. **Security**
   - Never expose sensitive data
   - Implement proper CSRF protection
   - Use secure HTTP headers

5. **Accessibility**
   - Use semantic HTML
   - Implement proper ARIA attributes
   - Ensure keyboard navigation

## Additional Resources

1. [Next.js Documentation](https://nextjs.org/docs)
2. [React Query Documentation](https://tanstack.com/query/latest)
3. [Tailwind CSS Documentation](https://tailwindcss.com/docs)
4. [TypeScript Documentation](https://www.typescriptlang.org/docs/) 