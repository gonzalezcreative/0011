import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { LeadForm } from './components/LeadForm';
import { LeadsPage } from './pages/LeadsPage';
import { Navigation } from './components/Navigation';
import { AnimatedBackground } from './components/AnimatedBackground';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen relative">
          <AnimatedBackground />
          <Navigation />
          <main className="relative flex-1 pb-20 md:pb-0">
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <div className="container mx-auto px-4 mt-8">
                    <div className="max-w-3xl mx-auto">
                      <LeadForm />
                      <div className="mt-16">
                        <HowItWorks />
                      </div>
                    </div>
                  </div>
                </>
              } />
              <Route path="/leads" element={<LeadsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;