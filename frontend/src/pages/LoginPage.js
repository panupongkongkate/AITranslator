import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Login/Register Forms */}
      {isLoginMode ? (
        <Login onToggleForm={() => setIsLoginMode(false)} />
      ) : (
        <Register onToggleForm={() => setIsLoginMode(true)} />
      )}
    </div>
  );
};

export default LoginPage;