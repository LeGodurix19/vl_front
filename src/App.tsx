import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import AuthForms from './components/AuthForms';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Scan from './pages/Scan';
import Social from './pages/Social';
import Settings from './pages/Settings';
import BookDetail from './pages/BookDetail';

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthForms />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/library" element={<Library />} />
        <Route path="/book/:isbn" element={<BookDetail />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/social" element={<Social />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;