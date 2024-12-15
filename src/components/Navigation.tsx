import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';

export const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-sm hidden md:block sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link 
                to="/" 
                className={`flex items-center px-4 transition-colors ${
                  isActive('/') 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Home className="h-5 w-5 mr-2" />
                Home
              </Link>
              <Link 
                to="/leads" 
                className={`flex items-center px-4 transition-colors ${
                  isActive('/leads')
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Browse Opportunities
              </Link>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/account" 
                    className={`text-gray-600 hover:text-purple-600 transition-colors ${
                      isActive('/account') ? 'text-purple-600' : ''
                    }`}
                  >
                    <User className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 md:hidden z-50">
        <div className="grid grid-cols-3 h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center transition-colors ${
              isActive('/') 
                ? 'text-purple-600 border-t-2 border-purple-600 -mt-[2px]' 
                : 'text-gray-600'
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            to="/leads"
            className={`flex flex-col items-center justify-center transition-colors ${
              isActive('/leads')
                ? 'text-purple-600 border-t-2 border-purple-600 -mt-[2px]'
                : 'text-gray-600'
            }`}
          >
            <Sparkles className="h-6 w-6" />
            <span className="text-xs mt-1">Opportunities</span>
          </Link>
          <button
            onClick={() => user ? signOut() : setIsAuthModalOpen(true)}
            className={`flex flex-col items-center justify-center transition-colors ${
              isActive('/account')
                ? 'text-purple-600 border-t-2 border-purple-600 -mt-[2px]'
                : 'text-gray-600'
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">{user ? 'Account' : 'Sign In'}</span>
          </button>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};