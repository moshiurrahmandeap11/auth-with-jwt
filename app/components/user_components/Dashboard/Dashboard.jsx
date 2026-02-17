"use client"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../authcomponents/AuthContext/AuthContext';
import axiosInstance from '../../shared_components/AxiosInstance/AxiosInstance';

const Dashboard = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({ name: '', email: '' });

    // Fetch all users if admin
    useEffect(() => {
        const fetchUsers = async () => {
            if (user?.role === 'admin') {
                try {
                    const response = await axiosInstance.get('/users');
                    if (response.data.success) {
                        setUsers(response.data.data);
                    }
                } catch (error) {
                    console.error('Error fetching users:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to fetch users',
                        confirmButtonColor: '#2563eb'
                    });
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        if (user) {
            fetchUsers();
        }
    }, [user]);

    // Handle view user
    const handleViewUser = (userId) => {
        router.push(`/users/${userId}`);
    };

    // Handle edit user
    const handleEditUser = (user) => {
        setSelectedUser(user);
        setEditFormData({ name: user.name, email: user.email });
        setIsEditModalOpen(true);
    };

    // Handle update user
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.patch(`/users/${selectedUser.id}`, editFormData);
            
            if (response.data.success) {
                // Update users list
                setUsers(users.map(u => u.id === selectedUser.id ? response.data.data : u));
                
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'User updated successfully',
                    timer: 1500,
                    showConfirmButton: false
                });
                
                setIsEditModalOpen(false);
                setSelectedUser(null);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update user',
                confirmButtonColor: '#2563eb'
            });
        }
    };

    // Handle delete user
    const handleDeleteUser = async (userId, userName) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete ${userName}. This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosInstance.delete(`/users/${userId}`);
                
                if (response.data.success) {
                    // Remove user from list
                    setUsers(users.filter(u => u.id !== userId));
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'User has been deleted successfully',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Failed to delete user',
                    confirmButtonColor: '#2563eb'
                });
            }
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If user is not logged in
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-4">Please login to view this page.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // Admin View
    if (user.role === 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage all users from here</p>
                    </div>

                    {/* Users Table - Desktop */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hidden md:block">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((u, index) => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                u.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleViewUser(u.id)}
                                                className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View User"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleEditUser(u)}
                                                className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Edit User"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u.id, u.name)}
                                                className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Users Cards - Mobile */}
                    <div className="md:hidden space-y-4">
                        {users.map((u, index) => (
                            <div key={u.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{u.name}</h3>
                                        <p className="text-sm text-gray-600">{u.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        u.role === 'admin' 
                                            ? 'bg-purple-100 text-purple-800' 
                                            : 'bg-blue-100 text-blue-800'
                                    }`}>
                                        {u.role}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 mb-3">
                                    ID: #{index + 1} • Joined: {new Date(u.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex justify-end space-x-2 border-t pt-3">
                                    <button
                                        onClick={() => handleViewUser(u.id)}
                                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleEditUser(u)}
                                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteUser(u.id, u.name)}
                                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Edit Modal */}
                    {isEditModalOpen && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-xl max-w-md w-full p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Edit User</h2>
                                <form onSubmit={handleUpdateUser}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={editFormData.name}
                                                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={editFormData.email}
                                                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Normal User View
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome to your personal dashboard</p>
                </div>

                {/* User Profile Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-blue-600 px-6 py-4">
                        <h2 className="text-xl font-semibold text-white">Profile Information</h2>
                    </div>
                    
                    <div className="p-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl font-bold text-blue-600">
                                    {user.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                                <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                                    {user.role}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Email */}
                            <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                                <div className="sm:w-1/3">
                                    <span className="text-sm font-medium text-gray-500">Email Address</span>
                                </div>
                                <div className="sm:w-2/3 mt-1 sm:mt-0">
                                    <span className="text-gray-900">{user.email}</span>
                                </div>
                            </div>

                            {/* User ID */}
                            <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                                <div className="sm:w-1/3">
                                    <span className="text-sm font-medium text-gray-500">User ID</span>
                                </div>
                                <div className="sm:w-2/3 mt-1 sm:mt-0">
                                    <span className="text-gray-600 text-sm">{user.id}</span>
                                </div>
                            </div>

                            {/* Account Type */}
                            <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                                <div className="sm:w-1/3">
                                    <span className="text-sm font-medium text-gray-500">Account Type</span>
                                </div>
                                <div className="sm:w-2/3 mt-1 sm:mt-0">
                                    <span className="capitalize text-gray-900">{user.role}</span>
                                </div>
                            </div>

                            {/* Member Since */}
                            {user.created_at && (
                                <div className="flex flex-col sm:flex-row sm:items-center py-3">
                                    <div className="sm:w-1/3">
                                        <span className="text-sm font-medium text-gray-500">Member Since</span>
                                    </div>
                                    <div className="sm:w-2/3 mt-1 sm:mt-0">
                                        <span className="text-gray-900">
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => router.push('/profile')}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>View Full Profile</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;