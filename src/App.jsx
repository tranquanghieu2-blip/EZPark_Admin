import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { isAuthenticated } from './services/authService';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import ParkingList from './pages/ParkingLot/ParkingList/ParkingList';
import ParkingForm from './pages/ParkingLot/ParkingForm/ParkingForm';
import RestrictedList from './pages/RestrictedZone/RestrictedList/RestrictedList';
import RestrictedForm from './pages/RestrictedZone/RestrictedForm/RestrictedForm';
import FeedbackList from './pages/Feedback/FeedbackList';
import UserList from './pages/User/UserList';
import { ROUTES } from './constants';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to={ROUTES.LOGIN} />;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to={ROUTES.DASHBOARD} />;
};

function App() {

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route 
            path={ROUTES.LOGIN} 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />

          {/* Protected Routes */}
          <Route 
            path={ROUTES.DASHBOARD} 
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={ROUTES.PROFILE} 
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={ROUTES.PARKING_LIST} 
            element={
              <ProtectedRoute>
                <Layout>
                  <ParkingList />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={ROUTES.PARKING_CREATE} 
            element={
              <ProtectedRoute>
                <Layout>
                  <ParkingForm />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={ROUTES.PARKING_EDIT} 
            element={
              <ProtectedRoute>
                <Layout>
                  <ParkingForm />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={ROUTES.RESTRICTED_LIST} 
            element={
              <ProtectedRoute>
                <Layout>
                  <RestrictedList />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={ROUTES.RESTRICTED_CREATE} 
            element={
              <ProtectedRoute>
                <Layout>
                  <RestrictedForm />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={ROUTES.RESTRICTED_EDIT} 
            element={
              <ProtectedRoute>
                <Layout>
                  <RestrictedForm />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={ROUTES.FEEDBACK_LIST} 
            element={
              <ProtectedRoute>
                <Layout>
                  <FeedbackList />
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path={ROUTES.USER_LIST} 
            element={
              <ProtectedRoute>
                <Layout>
                  <UserList />
                </Layout>
              </ProtectedRoute>
            } 
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  );
}

export default App;
