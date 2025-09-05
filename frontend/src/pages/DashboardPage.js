import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Languages,
  Users,
  UserCircle,
  Crown,
  Globe,
  ArrowRight
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: 'ภาษาที่รองรับ',
      value: '24+',
      icon: Globe,
      color: 'green'
    }
  ];

  const quickActions = [
    {
      name: 'แปลภาษา',
      description: 'เริ่มแปลข้อความด้วย AI',
      href: '/',
      icon: Languages,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      name: 'โปรไฟล์',
      description: 'จัดการข้อมูลส่วนตัว',
      href: '/profile',
      icon: UserCircle,
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    },
    ...(user?.role?.name === 'Admin' ? [{
      name: 'จัดการผู้ใช้',
      description: 'ดูแลระบบผู้ใช้งาน',
      href: '/admin',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700'
    }] : [])
  ];

  // Remove mock activity data

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {user?.role?.name === 'Admin' ? (
              <Crown className="w-10 h-10 text-yellow-600" />
            ) : (
              <UserCircle className="w-10 h-10 text-gray-600" />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                ยินดีต้อนรับ, {user?.username}
              </h1>
              <p className="text-gray-600">
                {user?.role?.name === 'Admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'} • {new Date().toLocaleDateString('th-TH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'bg-blue-50 text-blue-600 border-blue-200',
              green: 'bg-green-50 text-green-600 border-green-200',
              purple: 'bg-purple-50 text-purple-600 border-purple-200',
              yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200'
            };
            
            return (
              <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full border-2 ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">การดำเนินการด่วน</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.name}
                      to={action.href}
                      className={`group p-6 bg-gradient-to-r ${action.color} hover:${action.hoverColor} text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Icon className="w-8 h-8" />
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{action.name}</h3>
                      <p className="text-white/80 text-sm">{action.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;