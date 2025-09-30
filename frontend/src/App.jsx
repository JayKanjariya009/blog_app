import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const CreateBlogPage = lazy(() => import('./pages/CreateBlogPage'));
const EditBlogPage = lazy(() => import('./pages/EditBlogPage'));

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
                    <Route index element={<HomePage />} />
                    <Route path="blogs" element={<BlogsPage />} />
                    <Route path="blog/:id" element={<BlogDetailPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="login" element={<LoginPage />} />
                    
                    {/* Admin Routes */}
                    <Route path="admin/dashboard" element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="admin/create-blog" element={
                      <ProtectedRoute adminOnly={true}>
                        <CreateBlogPage />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="admin/edit-blog/:id" element={
                      <ProtectedRoute adminOnly={true}>
                        <EditBlogPage />
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