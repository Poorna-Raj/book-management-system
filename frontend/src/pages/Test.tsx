import React, { useState } from 'react';

export default function Test() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      console.log('Login attempted with:', { email, password });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Hero section with illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-green-50 to-emerald-100 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-300 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="relative z-10 max-w-lg">
          {/* Illustration */}
          <div className="mb-8">
            <svg viewBox="0 0 600 500" className="w-full h-auto drop-shadow-lg">
              {/* Desk/Table */}
              <ellipse cx="300" cy="420" rx="250" ry="30" fill="#10b981" opacity="0.1"/>
              
              {/* Stack of books - left */}
              <g>
                <rect x="120" y="320" width="100" height="100" fill="#10b981" opacity="0.9" rx="4">
                  <animate attributeName="y" values="320;315;320" dur="3s" repeatCount="indefinite"/>
                </rect>
                <rect x="125" y="325" width="90" height="15" fill="#059669" opacity="0.8" rx="2"/>
                <line x1="170" y1="320" x2="170" y2="420" stroke="#047857" strokeWidth="2" opacity="0.3"/>
              </g>
              
              <g>
                <rect x="130" y="240" width="80" height="80" fill="#10b981" opacity="0.7" rx="4">
                  <animate attributeName="y" values="240;235;240" dur="3s" begin="0.5s" repeatCount="indefinite"/>
                </rect>
                <rect x="135" y="245" width="70" height="12" fill="#059669" opacity="0.8" rx="2"/>
              </g>
              
              <g>
                <rect x="140" y="180" width="60" height="60" fill="#10b981" opacity="0.5" rx="4">
                  <animate attributeName="y" values="180;175;180" dur="3s" begin="1s" repeatCount="indefinite"/>
                </rect>
                <rect x="145" y="185" width="50" height="10" fill="#059669" opacity="0.8" rx="2"/>
              </g>
              
              {/* Open book - center */}
              <g transform="translate(300, 280)">
                {/* Book shadow */}
                <ellipse cx="0" cy="100" rx="120" ry="15" fill="#000000" opacity="0.1"/>
                
                {/* Left page */}
                <path d="M -100 0 Q -100 -30, -50 -40 L 0 -45 L 0 80 L -50 75 Q -100 70, -100 40 Z" 
                      fill="#ffffff" stroke="#d1fae5" strokeWidth="3"/>
                
                {/* Right page */}
                <path d="M 100 0 Q 100 -30, 50 -40 L 0 -45 L 0 80 L 50 75 Q 100 70, 100 40 Z" 
                      fill="#ffffff" stroke="#d1fae5" strokeWidth="3"/>
                
                {/* Book spine */}
                <rect x="-3" y="-45" width="6" height="125" fill="#10b981"/>
                
                {/* Page details - left */}
                <line x1="-80" y1="10" x2="-20" y2="10" stroke="#10b981" strokeWidth="2" opacity="0.3"/>
                <line x1="-80" y1="20" x2="-20" y2="20" stroke="#10b981" strokeWidth="2" opacity="0.3"/>
                <line x1="-80" y1="30" x2="-20" y2="30" stroke="#10b981" strokeWidth="2" opacity="0.3"/>
                <line x1="-80" y1="40" x2="-20" y2="40" stroke="#10b981" strokeWidth="2" opacity="0.3"/>
                <line x1="-80" y1="50" x2="-20" y2="50" stroke="#10b981" strokeWidth="2" opacity="0.3"/>
                
                {/* Page details - right */}
                <line x1="20" y1="10" x2="80" y2="10" stroke="#10b981" strokeWidth="2" opacity="0.3"/>
                <line x1="20" y1="20" x2="80" y2="20" stroke="#10b981" strokeWidth="2" opacity="0.3"/>
                <line x1="20" y1="30" x2="80" y2="30" stroke="#10b981" strokeWidth="2" opacity="0.3"/>
                <line x1="20" y1="40" x2="80" y2="40" stroke="#10b981" strokeWidth="2" opacity="0.3"/>
                <line x1="20" y1="50" x2="80" y2="50" stroke="#10b981" strokeWidth="2" opacity="0.3"/>
                
                {/* Bookmark */}
                <rect x="-2" y="-50" width="4" height="60" fill="#ef4444" opacity="0.8"/>
              </g>
              
              {/* Stack of books - right */}
              <g>
                <rect x="400" y="330" width="90" height="90" fill="#10b981" opacity="0.8" rx="4">
                  <animate attributeName="y" values="330;325;330" dur="3s" begin="1.5s" repeatCount="indefinite"/>
                </rect>
                <rect x="405" y="335" width="80" height="14" fill="#059669" opacity="0.8" rx="2"/>
              </g>
              
              <g>
                <rect x="410" y="260" width="70" height="70" fill="#10b981" opacity="0.6" rx="4">
                  <animate attributeName="y" values="260;255;260" dur="3s" begin="2s" repeatCount="indefinite"/>
                </rect>
                <rect x="415" y="265" width="60" height="11" fill="#059669" opacity="0.8" rx="2"/>
              </g>
              
              {/* Floating page elements */}
              <g opacity="0.4">
                <rect x="180" y="120" width="50" height="60" fill="#10b981" rx="3" transform="rotate(-15 205 150)">
                  <animateTransform attributeName="transform" type="rotate" 
                    values="-15 205 150; -20 205 150; -15 205 150" dur="4s" repeatCount="indefinite"/>
                </rect>
                <rect x="380" y="140" width="45" height="55" fill="#10b981" rx="3" transform="rotate(12 402 167)">
                  <animateTransform attributeName="transform" type="rotate" 
                    values="12 402 167; 18 402 167; 12 402 167" dur="5s" repeatCount="indefinite"/>
                </rect>
              </g>
            </svg>
          </div>
          
          {/* Text content */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Manage Your Library <br/>with Ease
            </h2>
            <p className="text-gray-600 text-lg">
              Track books, manage inventory, and streamline your library operations all in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo and heading */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-6 shadow-lg shadow-green-600/20">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-gray-600">Access your book management dashboard</p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Footer text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2025 Book Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
