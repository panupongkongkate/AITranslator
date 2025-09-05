import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn, Loader2, AlertCircle, Crown, User, Zap } from 'lucide-react';

const Login = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showFastLogin, setShowFastLogin] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [fastCredentials, setFastCredentials] = useState({ username: '', password: '' });
  
  const { login, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'กรุณากรอกอีเมล';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
    }
    
    if (!formData.password) {
      errors.password = 'กรุณากรอกรหัสผ่าน';
    } else if (formData.password.length < 6) {
      errors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (!result.success) {
      // Error is handled by AuthContext
      console.log('Login failed');
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowFastLogin(false); // กลับไปใช้ฟอร์มเดิม
    // เซ็ตข้อมูลในฟิลด์ email/password ของฟอร์มเดิม โดยใช้ email จริงจาก database
    if (role === 'Admin') {
      setFormData({ email: 'admin@example.com', password: 'admin123' });
    } else {
      setFormData({ email: 'user@example.com', password: 'user123' });
    }
  };

  const handleFastLogin = async (e) => {
    e.preventDefault();
    const result = await login(fastCredentials.username, fastCredentials.password);
    if (result.success) {
      setSelectedRole(null);
      setFastCredentials({ username: '', password: '' });
      setShowFastLogin(false);
    }
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
    setFastCredentials({ username: '', password: '' });
  };

  const handleBackToNormalLogin = () => {
    setShowFastLogin(false);
    setSelectedRole(null);
    setFastCredentials({ username: '', password: '' });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">เข้าสู่ระบบ</h2>
            <p className="text-gray-600">ยินดีต้อนรับกลับมา</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Login Content */}
          <div>
            {!showFastLogin ? (
              <>
                {/* Regular Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      อีเมล
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                          formErrors.email
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                        placeholder="example@email.com"
                        disabled={isLoading}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      รหัสผ่าน
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-colors ${
                          formErrors.password
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                        placeholder="รหัสผ่านของคุณ"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="mt-2 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        กำลังเข้าสู่ระบบ...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        เข้าสู่ระบบ
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="my-8 flex items-center">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <div className="px-4 text-sm text-gray-500 bg-white">หรือ</div>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Fast Login Buttons */}
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-sm font-semibold text-gray-800">เข้าสู่ระบบด่วน</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Admin Button */}
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('Admin')}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                    >
                      <Crown className="h-4 w-4" />
                      <span className="text-sm">Admin</span>
                    </button>

                    {/* User Button */}
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('User')}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm">User</span>
                    </button>
                  </div>
                </div>
              </>
            ) : !selectedRole ? (
              <div className="space-y-6">
                {/* Fast Login Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-gray-800">เข้าสู่ระบบด่วน</h3>
                  </div>
                  <p className="text-sm text-gray-600">เลือกประเภทผู้ใช้</p>
                </div>

                {/* Role Selection Buttons */}
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

                {/* Info Text */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    เลือกประเภทผู้ใช้เพื่อเข้าสู่ระบบ<br />
                    ระบบจะแสดงฟอร์มกรอกข้อมูลการเข้าสู่ระบบ
                  </p>
                </div>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={handleBackToNormalLogin}
                  className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  ← กลับไปเข้าสู่ระบบปกติ
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Fast Login Form Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {selectedRole === 'Admin' ? (
                      <Crown className="w-5 h-5 text-red-500" />
                    ) : (
                      <User className="w-5 h-5 text-green-500" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-800">เข้าสู่ระบบ {selectedRole}</h3>
                  </div>
                </div>

                {/* Fast Login Form */}
                <form onSubmit={handleFastLogin} className="space-y-4">
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
                        value={fastCredentials.username}
                        onChange={(e) => setFastCredentials({...fastCredentials, username: e.target.value})}
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
                        value={fastCredentials.password}
                        onChange={(e) => setFastCredentials({...fastCredentials, password: e.target.value})}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        placeholder="รหัสผ่าน"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBackToRoleSelection}
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
            )}
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ยังไม่มีบัญชี?{' '}
              <button
                onClick={onToggleForm}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                disabled={isLoading}
              >
                สมัครสมาชิก
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;