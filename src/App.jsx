import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import LoginScreen from './pages/LoginScreen'
import IdentificationScreen from './pages/IdentificationScreen'
import InstructionsScreen from './pages/InstructionsScreen'
import SurveyScreen from './pages/QuestionScreen'
import ScorecardPage from './pages/ResultsScreen'
import ThankYouScreen from './pages/ThankYouScreen'
import AdminLogin from './pages/AdminLoginScreen'
import Dashboard from './pages/DashboardScreen'
import LibraryScreen from './pages/LibraryScreen'
import ExtendedReportScreen from './pages/ExtendedReportScreen'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

function AdminRoute({ children }) {
  const { adminUser, loading } = useAuth()
  const location = useLocation()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!adminUser) {
    return <Navigate to="/admin" state={{ from: location }} replace />
  }

  return children
}

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/library" element={<LibraryScreen />} />
          <Route path="/instructions" element={<Navigate to="/library" replace />} />
          <Route path="/instructions/:id" element={<InstructionsScreen />} />
          <Route path="/identify" element={
              <IdentificationScreen />
          } />
          <Route path="/survey" element={<Navigate to="/library" replace />} />
          <Route path="/survey/:id" element={<SurveyScreen />} />
          <Route path="/scorecard" element={<Navigate to="/library" replace />} />
          <Route path="/scorecard/:scorecardId" element={<ScorecardPage />} />
          <Route path="/extended-report/:scorecardId" element={<ExtendedReportScreen />} />
          <Route path="/thank-you" element={<ThankYouScreen />} />
          <Route path="/thank-you/:id" element={<ThankYouScreen />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/dashboard" element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

