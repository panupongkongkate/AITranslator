import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, roleAPI, handleAPIError } from '../services/api';
import {
  Users,
  Plus,
  Edit3,
  Trash2,
  Search,
  UserCircle,
  Crown,
  Mail,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const UserList = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'User'
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    // Reset to page 1 when search term changes
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchUsers();
    }
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers(currentPage, pageSize, searchTerm);
      setUsers(response.data.users || []);
      setPagination(response.data.pagination || {});
      setError(null);
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const response = await roleAPI.getAllRoles();
      setRoles(response.data || []);
    } catch (err) {
      console.error('Error fetching roles:', handleAPIError(err));
      // Fallback to default roles if API fails
      setRoles([
        { id: 1, name: 'Admin', description: 'System Administrator' },
        { id: 2, name: 'User', description: 'Regular User' }
      ]);
    } finally {
      setRolesLoading(false);
    }
  };

  const validateAddUser = () => {
    const errors = {};
    
    if (!newUser.username.trim()) {
      errors.username = 'กรุณากรอกชื่อผู้ใช้';
    } else if (newUser.username.length < 3) {
      errors.username = 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร';
    } else if (newUser.username.length > 50) {
      errors.username = 'ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร';
    }
    
    if (!newUser.email.trim()) {
      errors.email = 'กรุณากรอกอีเมล';
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
    } else if (newUser.email.length > 100) {
      errors.email = 'อีเมลต้องไม่เกิน 100 ตัวอักษร';
    }
    
    if (!newUser.password.trim()) {
      errors.password = 'กรุณากรอกรหัสผ่าน';
    } else if (newUser.password.length < 6) {
      errors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }
    
    if (!newUser.confirmPassword.trim()) {
      errors.confirmPassword = 'กรุณายืนยันรหัสผ่าน';
    } else if (newUser.password !== newUser.confirmPassword) {
      errors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    }
    
    if (!newUser.role) {
      errors.role = 'กรุณาเลือกบทบาท';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEditUser = () => {
    const errors = {};
    
    if (!selectedUser.username.trim()) {
      errors.username = 'กรุณากรอกชื่อผู้ใช้';
    } else if (selectedUser.username.length < 3) {
      errors.username = 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร';
    } else if (selectedUser.username.length > 50) {
      errors.username = 'ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร';
    }
    
    if (!selectedUser.email.trim()) {
      errors.email = 'กรุณากรอกอีเมล';
    } else if (!/\S+@\S+\.\S+/.test(selectedUser.email)) {
      errors.email = 'กรุณากรอกอีเมลให้ถูกต้อง';
    } else if (selectedUser.email.length > 100) {
      errors.email = 'อีเมลต้องไม่เกิน 100 ตัวอักษร';
    }
    
    if (!selectedUser.role) {
      errors.role = 'กรุณาเลือกบทบาท';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!validateAddUser()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await userAPI.createUser(newUser);
      setShowAddModal(false);
      setNewUser({ username: '', email: '', password: '', confirmPassword: '', role: 'User' });
      setFormErrors({});
      fetchUsers();
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    if (!validateEditUser()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await userAPI.updateUser(selectedUser.id, {
        Username: selectedUser.username,
        Email: selectedUser.email,
        Role: selectedUser.role?.name || selectedUser.role
      });
      setShowEditModal(false);
      setSelectedUser(null);
      setFormErrors({});
      fetchUsers();
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    
    try {
      await userAPI.deleteUser(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      setError(handleAPIError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value, isEdit = false) => {
    if (isEdit && selectedUser) {
      setSelectedUser({...selectedUser, [field]: value});
    } else {
      setNewUser({...newUser, [field]: value});
    }
    
    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const generatePageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination
      if (currentPage <= 4) {
        // Show first 5 pages + ... + last page
        pages.push(...[1, 2, 3, 4, 5, '...', totalPages]);
      } else if (currentPage >= totalPages - 3) {
        // Show first page + ... + last 5 pages
        pages.push(...[1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]);
      } else {
        // Show first page + ... + current-1, current, current+1 + ... + last page
        pages.push(...[1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]);
      }
    }
    
    return pages;
  };

  if (user?.role?.name !== 'Admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
          <p className="text-gray-600">คุณต้องเป็น Admin เพื่อเข้าถึงหน้านี้</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">จัดการผู้ใช้</h1>
          </div>
          <p className="text-gray-600">จัดการบัญชีผู้ใช้ในระบบ</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Required Fields Info */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-800">ข้อมูลที่จำเป็น</h3>
          </div>
          <p className="text-blue-700 text-sm">
            เครื่องหมาย <span className="text-red-500 font-medium">*</span> หมายถึงข้อมูลที่จำเป็นต้องกรอก
          </p>
          <ul className="text-blue-700 text-sm mt-2 ml-4 list-disc">
            <li>ชื่อผู้ใช้: 3-50 ตัวอักษร</li>
            <li>อีเมล: รูปแบบอีเมลที่ถูกต้อง ไม่เกิน 100 ตัวอักษร</li>
            <li>รหัสผ่าน: อย่างน้อย 6 ตัวอักษร (เฉพาะการเพิ่มผู้ใช้ใหม่)</li>
          </ul>
          <div className="mt-3 pt-2 border-t border-blue-200">
            <p className="text-blue-700 text-xs">
              <span className="font-medium">หมายเหตุ:</span> ผู้ใช้ระบบเริ่มต้น (admin, user) จะถูกป้องกันการแก้ไขและลบ
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Left side - Search and Page Size */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ค้นหาผู้ใช้..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 min-w-[250px]"
                />
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center gap-2 text-sm">
                <label className="text-gray-700 whitespace-nowrap">แสดง:</label>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-gray-700 whitespace-nowrap">รายการ</span>
              </div>
            </div>

            {/* Right side - Add User Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              เพิ่มผู้ใช้
            </button>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">ไม่พบผู้ใช้</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ผู้ใช้
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      อีเมล
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      บทบาท
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สร้างเมื่อ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.role?.name === 'Admin' ? (
                            <Crown className="w-8 h-8 text-yellow-600 mr-3" />
                          ) : (
                            <UserCircle className="w-8 h-8 text-gray-600 mr-3" />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="w-4 h-4 mr-2" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role?.name === 'Admin'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role?.name || user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(user.createdAt || Date.now()).toLocaleDateString('th-TH')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-2 justify-end">
                          {/* Disable edit/delete for default system users (id 1 = admin, id 2 = user) */}
                          {(user.id === 1 || user.id === 2) ? (
                            <div className="flex items-center gap-2 text-gray-400">
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">ระบบ</span>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowEditModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="แก้ไขผู้ใช้"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="ลบผู้ใช้"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && users.length > 0 && pagination.totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 mt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Results Info */}
              <div className="text-sm text-gray-700">
                แสดง {((pagination.currentPage - 1) * pagination.pageSize) + 1}-
                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} 
                {' '}จาก {pagination.totalCount} รายการ
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPreviousPage}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pagination.hasPreviousPage
                      ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                      : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  ก่อนหน้า
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {generatePageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                      disabled={typeof page !== 'number'}
                      className={`min-w-[40px] h-10 rounded-lg text-sm transition-colors ${
                        page === pagination.currentPage
                          ? 'bg-purple-600 text-white'
                          : typeof page === 'number'
                          ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                          : 'text-gray-400 cursor-default'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pagination.hasNextPage
                      ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                      : 'text-gray-400 bg-gray-50 cursor-not-allowed'
                  }`}
                >
                  ถัดไป
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">เพิ่มผู้ใช้ใหม่</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อผู้ใช้ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.username
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="กรอกชื่อผู้ใช้ (3-50 ตัวอักษร)"
                />
                {formErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  อีเมล <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="example@email.com"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="รหัสผ่านอย่างน้อย 6 ตัวอักษร"
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="ยืนยันรหัสผ่าน"
                />
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  บทบาท <span className="text-red-500">*</span>
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.role
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  disabled={rolesLoading}
                >
                  {rolesLoading ? (
                    <option value="">กำลังโหลด...</option>
                  ) : (
                    roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))
                  )}
                </select>
                {formErrors.role && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
                )}
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewUser({ username: '', email: '', password: '', confirmPassword: '', role: 'User' });
                    setFormErrors({});
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'เพิ่ม'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">แก้ไขผู้ใช้</h3>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อผู้ใช้ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) => handleInputChange('username', e.target.value, true)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.username
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="กรอกชื่อผู้ใช้ (3-50 ตัวอักษร)"
                />
                {formErrors.username && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  อีเมล <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => handleInputChange('email', e.target.value, true)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  placeholder="example@email.com"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  บทบาท <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedUser.role?.name || selectedUser.role}
                  onChange={(e) => handleInputChange('role', e.target.value, true)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    formErrors.role
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-300 focus:ring-purple-500'
                  }`}
                  disabled={rolesLoading}
                >
                  {rolesLoading ? (
                    <option value="">กำลังโหลด...</option>
                  ) : (
                    roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))
                  )}
                </select>
                {formErrors.role && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
                )}
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    setFormErrors({});
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'บันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">ยืนยันการลบ</h3>
              <p className="text-gray-600 mb-6">
                คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ <strong>{selectedUser.username}</strong>?<br />
                การดำเนินการนี้ไม่สามารถยกเลิกได้
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDeleteUser}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'ลบ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;