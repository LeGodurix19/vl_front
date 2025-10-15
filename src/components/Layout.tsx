import React from 'react';
import { BarChart3, BookOpen, Camera, Users, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: BarChart3, path: '/dashboard', label: 'Dashboard' },
    { icon: BookOpen, path: '/library', label: 'Library' },
    { icon: Camera, path: '/scan', label: 'Scan', isCenter: true },
    { icon: Users, path: '/social', label: 'Social' },
    { icon: Settings, path: '/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="flex justify-center">
          <div className="flex space-x-8 max-w-md w-full justify-between items-center">
            {navItems.map(({ icon: Icon, path, label, isCenter }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
                  isCenter
                    ? 'bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105'
                    : location.pathname === path
                    ? 'text-blue-500'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon size={isCenter ? 28 : 24} />
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;