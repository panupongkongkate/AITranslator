import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Languages,
  Users,
  UserCircle,
  LogOut,
  Menu,
  X,
  Crown,
  Settings,
  ChevronDown
} from 'lucide-react';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navigation = [
    { name: 'แปลภาษา', href: '/', icon: Languages },
    ...(user?.role?.name === 'Admin' ? [
      { name: 'จัดการผู้ใช้', href: '/admin', icon: Users }
    ] : []),
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16">
          {/* Left Side */}
          <div className="float-left flex items-center h-16">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Languages className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Translator
                </h1>
              </div>
            </Link>
          </div>

          {/* Right Side */}
          <div className="float-right flex items-center h-16 space-x-8">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-2 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    {user?.role?.name === 'Admin' ? (
                      <Crown className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <UserCircle className="w-5 h-5 text-gray-600" />
                    )}
                    <span className="text-gray-700 font-medium">{user?.username}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none slide-in-right">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-500">เข้าสู่ระบบในฐานะ</p>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {user?.role?.name === 'Admin' ? (
                            <Crown className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <UserCircle className="w-4 h-4 text-gray-600" />
                          )}
                          {user?.username} ({user?.role?.name || user?.role})
                        </p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="mr-3 h-4 w-4" />
                        โปรไฟล์
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        ออกจากระบบ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
          
          <div className="clearfix"></div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pb-3 pt-4 fade-in">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
            
            <div className="pt-4 pb-3 border-t border-gray-200 mt-3">
              <div className="flex items-center px-3 mb-3">
                {user?.role?.name === 'Admin' ? (
                  <Crown className="w-6 h-6 text-yellow-600 mr-3" />
                ) : (
                  <UserCircle className="w-6 h-6 text-gray-600 mr-3" />
                )}
                <div>
                  <div className="text-base font-medium text-gray-800">{user?.username}</div>
                  <div className="text-sm text-gray-500">{user?.role?.name || user?.role}</div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="mr-3 h-5 w-5" />
                  โปรไฟล์
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {(isMobileMenuOpen || isUserMenuOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navigation;