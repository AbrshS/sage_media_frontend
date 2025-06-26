import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { NotificationProvider } from './contexts/NotificationContext';

// Pages
import HomePage from './pages/home/Home';
import RegisterPage from './pages/RegisterPage';
import Leaderboard from './pages/leaderboard/leaderboard';
import ModelProfilePage from './pages/ModelProfilePage';
import LoginPage from './pages/LoginPage';
import ResetPassword from './components/auth/ResetPassword';
import ForgotPassword from './components/auth/ForgotPassword';
import Profile from './pages/Profile';
import EditProfilePage from './pages/EditProfilePage';
import ModelsPage from './pages/ModelsPage';
import Layout from './components/layout';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = Boolean(
    localStorage.getItem('modelToken') || 
    localStorage.getItem('userToken') ||
    sessionStorage.getItem('authToken')
  );
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const API_URL = 'http://localhost:3000/api';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Layout>
              <Toaster position="top-center" />
              <Routes>
                {/* Auth routes */}
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route 
                  path="/reset-password/:token" 
                  element={<ResetPassword API_URL={API_URL} />} 
                />
                <Route path="/forgot-password" element={<ForgotPassword onClose={() => {}} apiUrl={API_URL} />} />
                
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                   
                {/* Profile routes */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ModelProfilePage />
                    </ProtectedRoute>
                  } 
                />  
                <Route 
                  path="/edit-profile" 
                  element={
                    <ProtectedRoute>
                      <EditProfilePage />
                    </ProtectedRoute>
                  } 
                />  
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/models" element={<ModelsPage />} />
                <Route path="/model/:id" element={<ModelProfilePage />} />
              </Routes>   
            </Layout>   
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </GoogleOAuthProvider> 
  );
}

export default App;