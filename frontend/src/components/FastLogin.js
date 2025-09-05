import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Crown, User, Loader2, Zap, Mail, Lock } from 'lucide-react';

const FastLogin = ({ className = '' }) => {
  const { login, isLoading } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Set default credentials based on role
    if (role === 'Admin') {
      setCredentials({ username: 'admin', password: 'admin123' });
    } else {
      setCredentials({ username: 'user', password: 'user123' });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(credentials.username, credentials.password);
    if (result.success) {
      setSelectedRole(null);
      setCredentials({ username: '', password: '' });
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setCredentials({ username: '', password: '' });
  };

  if (selectedRole) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            {selectedRole === 'Admin' ? (
              <Crown className="w-5 h-5 text-red-500" />
            ) : (
              <User className="w-5 h-5 text-green-500" />
            )}
            <h3 className="text-lg font-semibold text-gray-800">เข้าสู่ระบบ {selectedRole}</h3>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อผู้ใช้
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                placeholder="ชื่อผู้ใช้"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รหัสผ่าน
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                placeholder="รหัสผ่าน"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={isLoading}
              className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ย้อนกลับ
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium transition-all ${
                selectedRole === 'Admin' 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  {selectedRole === 'Admin' ? (
                    <Crown className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  เข้าสู่ระบบ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-800">เข้าสู่ระบบด่วน</h3>
        </div>
        <p className="text-sm text-gray-600">เลือกประเภทผู้ใช้</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Admin Login */}
        <button
          onClick={() => handleRoleSelect('Admin')}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
        >
          <Crown className="h-5 w-5" />
          <span className="text-sm">Admin</span>
        </button>

        {/* User Login */}
        <button
          onClick={() => handleRoleSelect('User')}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
        >
          <User className="h-5 w-5" />
          <span className="text-sm">User</span>
        </button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500 leading-relaxed">
          เลือกประเภทผู้ใช้เพื่อเข้าสู่ระบบ<br />
          ระบบจะแสดงฟอร์มกรอกข้อมูลการเข้าสู่ระบบ
        </p>
      </div>
    </div>
  );
};

export default FastLogin;