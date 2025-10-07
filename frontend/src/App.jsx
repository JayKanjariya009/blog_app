import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';

// Lazy load pages for better performance
const EnhancedBlogsPage = lazy(() => import('./pages/EnhancedBlogsPage'));
const EnhancedBlogDetailPage = lazy(() => import('./pages/EnhancedBlogDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const VerifyOTPPage = lazy(() => import('./pages/VerifyOTPPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'));
const EnhancedAdminDashboard = lazy(() => import('./pages/EnhancedAdminDashboard'));
const EnhancedCreateBlogPage = lazy(() => import('./pages/EnhancedCreateBlogPage'));
const EnhancedEditBlogPage = lazy(() => import('./pages/EnhancedEditBlogPage'));
const EnhancedHomePage = lazy(() => import('./pages/EnhancedHomePage'));

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <LoadingSpinner size="lg" text="Loading page..." />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              <Suspense fallback={<PageLoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<EnhancedHomePage />} />
                    <Route path="blogs" element={<EnhancedBlogsPage />} />
                    <Route path="blog/:id" element={<EnhancedBlogDetailPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="verify-otp" element={<VerifyOTPPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="reset-password" element={<ResetPasswordPage />} />
                    <Route path="change-password" element={
                      <ProtectedRoute>
                        <ChangePasswordPage />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="admin/dashboard" element={
                      <ProtectedRoute adminOnly={true}>
                        <EnhancedAdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="admin" element={
                      <ProtectedRoute adminOnly={true}>
                        <EnhancedAdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="admin/create-blog" element={
                      <ProtectedRoute adminOnly={true}>
                        <EnhancedCreateBlogPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="enhanced" element={<EnhancedHomePage />} />
                    
                    <Route path="admin/edit-blog/:id" element={
                      <ProtectedRoute adminOnly={true}>
                        <EnhancedEditBlogPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </Suspense>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;