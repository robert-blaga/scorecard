import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Home from '../components/dashboard/Home';
import Library from '../components/dashboard/Library';
import Users from '../components/dashboard/Users';
import Settings from '../components/dashboard/Settings';

export default function Dashboard() {
  const navigate = useNavigate();
  const { adminSignOut } = useAuth();
  const [activeSection, setActiveSection] = useState('home');

  const handleSignOut = async () => {
    try {
      await adminSignOut();
      navigate('/admin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'library', label: 'Library' },
    { id: 'users', label: 'Users' },
    { id: 'settings', label: 'Settings' }
  ];

  // Render the appropriate component based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <Home />;
      case 'library':
        return <Library />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation - Dark Mode - Fixed Position */}
      <aside className="w-64 bg-gray-900 shadow-md flex flex-col fixed h-screen">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-medium text-white font-serif">Dashboard</h1>
        </div>
        
        {/* Navigation Links - with overflow scrolling if needed */}
        <nav className="flex-1 mt-5 px-2 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md w-full transition-all ${
                  activeSection === item.id
                    ? 'bg-blue-700 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
        
        {/* Logout Button at Bottom - Always Visible */}
        <div className="p-4 border-t border-gray-700 mt-auto">
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg transition-all hover:bg-gray-800"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Dashboard Content - With Left Margin to Account for Fixed Sidebar */}
      <main className="flex-1 overflow-auto p-6 ml-64">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
} 