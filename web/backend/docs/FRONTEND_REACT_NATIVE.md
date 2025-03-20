# React Native Mobile App Development Guide

## Project Setup

### 1. Environment Setup
```bash
# Create new React Native project
npx react-native@latest init InternshipPortal
cd InternshipPortal

# Install required dependencies
npm install @react-navigation/native @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install @tanstack/react-query axios
npm install @react-native-async-storage/async-storage
npm install react-native-paper
npm install react-native-vector-icons
npm install react-native-document-picker
npm install react-native-fs
npm install react-native-image-picker
npm install @react-native-community/netinfo
```

### 2. Environment Variables
Create `.env`:
```env
API_URL=http://localhost:8000/api
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Project Structure
```
InternshipPortal/
├── src/
│   ├── screens/              # Screen components
│   │   ├── auth/            # Authentication screens
│   │   ├── jobs/            # Job-related screens
│   │   ├── profile/         # Profile screens
│   │   └── ai/              # AI feature screens
│   ├── components/          # Reusable components
│   │   ├── ui/             # UI components
│   │   ├── forms/          # Form components
│   │   └── cards/          # Card components
│   ├── navigation/         # Navigation configuration
│   ├── services/           # API and other services
│   ├── hooks/              # Custom hooks
│   ├── utils/              # Utility functions
│   ├── constants/          # Constants and theme
│   └── types/              # TypeScript types
├── assets/                 # Images, fonts, etc.
└── __tests__/             # Test files
```

## API Integration

### 1. API Client Setup
```typescript
// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 2. React Query Setup
```typescript
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {/* Navigation stack */}
      </NavigationContainer>
    </QueryClientProvider>
  );
}
```

### 3. API Hooks Example
```typescript
// src/hooks/useJobs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => api.get('/jobs/').then(res => res.data),
  });
}

export function useApplyForJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => api.post('/applications/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
```

## Navigation

### 1. Navigation Setup
```typescript
// src/navigation/AppNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Jobs"
        component={JobsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="briefcase" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-document" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
```

## Authentication

### 1. Auth Context
```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
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
    await AsyncStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
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

## File Handling

### 1. Resume Upload
```typescript
// src/screens/ResumeUploadScreen.tsx
import { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import api from '@/services/api';

export function ResumeUploadScreen() {
  const [uploading, setUploading] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.doc],
      });

      const formData = new FormData();
      formData.append('resume', {
        uri: result[0].uri,
        type: result[0].type,
        name: result[0].name,
      });

      setUploading(true);
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
    <View>
      <Button
        title="Upload Resume"
        onPress={pickDocument}
        disabled={uploading}
      />
    </View>
  );
}
```

## Offline Support

### 1. Network Status
```typescript
// src/hooks/useNetworkStatus.ts
import NetInfo from '@react-native-community/netinfo';
import { useState, useEffect } from 'react';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  return isConnected;
}
```

### 2. Offline Queue
```typescript
// src/services/offlineQueue.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export class OfflineQueue {
  static async addToQueue(action: string, data: any) {
    const queue = await this.getQueue();
    queue.push({ action, data, timestamp: Date.now() });
    await AsyncStorage.setItem('offline_queue', JSON.stringify(queue));
  }

  static async getQueue() {
    const queue = await AsyncStorage.getItem('offline_queue');
    return queue ? JSON.parse(queue) : [];
  }

  static async processQueue() {
    const queue = await this.getQueue();
    for (const item of queue) {
      try {
        await this.processItem(item);
        queue.shift();
        await AsyncStorage.setItem('offline_queue', JSON.stringify(queue));
      } catch (error) {
        console.error('Failed to process queue item:', error);
      }
    }
  }
}
```

## UI Components

### 1. Custom Button
```typescript
// src/components/ui/Button.tsx
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

export function Button({ style, ...props }) {
  return (
    <PaperButton
      mode="contained"
      style={[styles.button, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    paddingVertical: 5,
  },
});
```

### 2. Job Card
```typescript
// src/components/cards/JobCard.tsx
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

export function JobCard({ job, onPress }) {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <Text variant="titleLarge">{job.title}</Text>
        <Text variant="bodyMedium">{job.company}</Text>
        <Text variant="bodySmall">{job.location}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 4,
  },
});
```

## Performance Optimization

### 1. Image Caching
```typescript
// src/components/ui/CachedImage.tsx
import { Image } from 'react-native';
import RNFS from 'react-native-fs';

export function CachedImage({ uri, style }) {
  const [localUri, setLocalUri] = useState(uri);

  useEffect(() => {
    const filename = uri.split('/').pop();
    const path = `${RNFS.CachesDirectoryPath}/${filename}`;

    RNFS.exists(path)
      .then(exists => {
        if (exists) {
          setLocalUri(`file://${path}`);
          return;
        }
        return RNFS.downloadFile({
          fromUrl: uri,
          toFile: path,
        });
      })
      .then(() => {
        setLocalUri(`file://${path}`);
      });
  }, [uri]);

  return <Image source={{ uri: localUri }} style={style} />;
}
```

### 2. List Optimization
```typescript
// src/components/lists/JobList.tsx
import { FlatList } from 'react-native';
import { JobCard } from '../cards/JobCard';

export function JobList({ jobs, onJobPress }) {
  const renderItem = useCallback(({ item }) => (
    <JobCard job={item} onPress={() => onJobPress(item)} />
  ), [onJobPress]);

  return (
    <FlatList
      data={jobs}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
}
```

## Testing

### 1. Component Testing
```typescript
// src/components/__tests__/JobCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { JobCard } from '../cards/JobCard';

describe('JobCard', () => {
  it('renders job information correctly', () => {
    const job = {
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
    };

    const { getByText } = render(
      <JobCard job={job} onPress={() => {}} />
    );
    
    expect(getByText('Software Engineer')).toBeTruthy();
    expect(getByText('Tech Corp')).toBeTruthy();
    expect(getByText('Remote')).toBeTruthy();
  });
});
```

### 2. Navigation Testing
```typescript
// src/navigation/__tests__/AppNavigator.test.tsx
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from '../AppNavigator';

describe('AppNavigator', () => {
  it('renders without crashing', () => {
    render(
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    );
  });
});
```

## Deployment

### 1. Android Configuration
```gradle
// android/app/build.gradle
android {
    defaultConfig {
        applicationId "com.internshipportal"
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0"
    }
}
```

### 2. iOS Configuration
```xml
<!-- ios/InternshipPortal/Info.plist -->
<key>CFBundleIdentifier</key>
<string>com.internshipportal</string>
<key>CFBundleVersion</key>
<string>1.0</string>
<key>CFBundleShortVersionString</key>
<string>1.0</string>
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
   - Implement proper list virtualization
   - Use image caching
   - Implement offline support

4. **Security**
   - Secure storage for sensitive data
   - Implement proper token management
   - Use HTTPS for all API calls

5. **Accessibility**
   - Use proper accessibility labels
   - Support screen readers
   - Implement proper touch targets

## Additional Resources

1. [React Native Documentation](https://reactnative.dev/docs/getting-started)
2. [React Navigation Documentation](https://reactnavigation.org/docs/getting-started)
3. [React Native Paper Documentation](https://callstack.github.io/react-native-paper/)
4. [TypeScript Documentation](https://www.typescriptlang.org/docs/) 