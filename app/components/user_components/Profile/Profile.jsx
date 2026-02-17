"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../authcomponents/AuthContext/AuthContext';
import axiosInstance from '../../shared_components/AxiosInstance/AxiosInstance';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle edit toggle
    const handleEditToggle = () => {
        setIsEditing(true);
        setFormData({
            name: user?.name || '',
            email: user?.email || ''
        });
    };

    // Handle cancel edit
    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user?.name || '',
            email: user?.email || ''
        });
    };

    // Handle update profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.patch(`/users/${user.id}`, {
                name: formData.name,
                email: formData.email
            });

            if (response.data.success) {
                // Update user in context
                updateUser(response.data.data);
                
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Profile updated successfully',
                    timer: 1500,
                    showConfirmButton: false,
                    background: 'white',
                    iconColor: '#2563eb'
                });
                
                setIsEditing(false);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update profile',
                confirmButtonColor: '#2563eb',
                background: 'white'
            });
        } finally {
            setLoading(false);
        }
    };

    // If user is not logged in
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                        <p className="text-gray-600 mb-6">Please login to view your profile.</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-2">Manage your personal information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Cover Photo */}
                    <div className="h-32 sm:h-40 bg-linear-to-r from-blue-500 to-blue-600 relative">
                        {!isEditing && (
                            <button
                                onClick={handleEditToggle}
                                className="absolute bottom-4 right-4 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 border border-gray-200 flex items-center space-x-2 transition-colors"
                            >
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit Profile</span>
                            </button>
                        )}
                    </div>

                    {/* Profile Info */}
                    <div className="px-4 sm:px-8 pb-8">
                        {/* Avatar */}
                        <div className="flex justify-center -mt-16 sm:-mt-20 mb-4">
                            <div className="relative">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-3xl sm:text-4xl font-bold text-blue-600">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                {!isEditing && (
                                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Edit Form or View Mode */}
                        {isEditing ? (
                            <form onSubmit={handleUpdateProfile} className="max-w-2xl mx-auto mt-8">
                                <div className="space-y-6">
                                    {/* Name Field */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter your email"
                                        />
                                    </div>

                                    {/* Form Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Updating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>Save Changes</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <span>Cancel</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <>
                                {/* User Info */}
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{user.name}</h2>
                                    <p className="text-gray-600 mt-2">{user.email}</p>
                                    <span className="inline-block mt-3 px-4 py-1.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                                    </span>
                                </div>

                                {/* Details Grid */}
                                <div className="max-w-2xl mx-auto border-t border-gray-100 pt-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Details</h3>
                                    
                                    <div className="space-y-4">
                                        {/* User ID */}
                                        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                                            <div className="sm:w-1/3">
                                                <span className="text-sm font-medium text-gray-500">User ID</span>
                                            </div>
                                            <div className="sm:w-2/3 mt-1 sm:mt-0">
                                                <span className="text-gray-900 text-sm break-all">{user.id}</span>
                                            </div>
                                        </div>

                                        {/* Full Name */}
                                        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                                            <div className="sm:w-1/3">
                                                <span className="text-sm font-medium text-gray-500">Full Name</span>
                                            </div>
                                            <div className="sm:w-2/3 mt-1 sm:mt-0">
                                                <span className="text-gray-900">{user.name}</span>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                                            <div className="sm:w-1/3">
                                                <span className="text-sm font-medium text-gray-500">Email Address</span>
                                            </div>
                                            <div className="sm:w-2/3 mt-1 sm:mt-0">
                                                <span className="text-gray-900 break-all">{user.email}</span>
                                            </div>
                                        </div>

                                        {/* Role */}
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
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <span>Go to Dashboard</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;