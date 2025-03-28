import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Pages
import HomePage from './pages/home/Home';
import RegisterPage from './pages/RegisterPage';
import Leaderboard from './pages/leaderboard/leaderboard';
import ModelProfilePage from './pages/ModelProfilePage';
import LoginPage from './pages/LoginPage'; // Add import for LoginPage
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
    // Redirect to home instead of login
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Your Google Client ID - you'll need to get this from the Google Cloud Console
// Define API_URL constant
const API_URL = 'http://localhost:3000/api';
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>    
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
            {/* Update this line to match the navigation path */}
            <Route path="/forgot-password" element={<ForgotPassword onClose={function (): void {
                throw new Error('Function not implemented.');
              } } apiUrl={''} />} />
            
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
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider> 
  );
}
export default App;