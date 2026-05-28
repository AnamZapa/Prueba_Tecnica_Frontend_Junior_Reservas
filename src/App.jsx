import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; 
import Panel from './pages/Panel';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/panel" 
          element={
            <ProtectedRoute>
              <Layout>
                <Panel />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback to redirect root and all other paths to /panel */}
        <Route path="*" element={<Navigate to="/panel" replace />} />
      </Routes>
    </Router>
  );
}

export default App;