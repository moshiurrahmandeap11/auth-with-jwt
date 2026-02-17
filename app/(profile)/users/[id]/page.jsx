"use client"
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import { useAuth } from '@/app/components/authcomponents/AuthContext/AuthContext';
import axiosInstance from '@/app/components/shared_components/AxiosInstance/AxiosInstance';


const ProfileWithID = () => {
    const { id } = useParams();
    const router = useRouter();
    const { user: currentUser } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/users/${id}`);
                
                if (response.data.success) {
                    setProfileUser(response.data.data);
                    setError(null);
                } else {
                    setError('User not found');
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setError(error.response?.data?.message || 'Failed to load user profile');
                
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Failed to load user profile',
                    confirmButtonColor: '#2563eb'
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserProfile();
        }
    }, [id]);

    // Check if current user is admin
    const isAdmin = currentUser?.role === 'admin';

    // If not admin, show access denied
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-6V7m0 0V5m0 2h2m-2 0H9m9 5a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                        <p className="text-gray-600 mb-6">You don&apos;t have permission to view this page.</p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        {/* Header Skeleton */}
                        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
                        
                        {/* Profile Card Skeleton */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="h-32 sm:h-40 bg-gray-200"></div>
                            <div className="px-4 sm:px-8 pb-8">
                                <div className="flex justify-center -mt-16 sm:-mt-20 mb-4">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-full border-4 border-white"></div>
                                </div>
                                <div className="text-center mb-8">
                                    <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
                                    <div className="h-5 bg-gray-200 rounded w-64 mx-auto mb-3"></div>
                                    <div className="h-6 bg-gray-200 rounded w-24 mx-auto"></div>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !profileUser) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || 'The requested user profile does not exist.'}</p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header with Back Button */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">User Profile</h1>
                        <p className="text-gray-600 mt-2">Viewing profile of {profileUser.name}</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Dashboard</span>
                    </button>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Cover Photo with Role Badge */}
                    <div className="h-32 sm:h-40 bg-linear-to-r from-blue-500 to-blue-600 relative">
                        <div className="absolute top-4 right-4">
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                                profileUser.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-blue-100 text-blue-800'
                            }`}>
                                {profileUser.role?.toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="px-4 sm:px-8 pb-8">
                        {/* Avatar */}
                        <div className="flex justify-center -mt-16 sm:-mt-20 mb-4">
                            <div className="relative">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-3xl sm:text-4xl font-bold text-blue-600">
                                            {profileUser.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Name and Email */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{profileUser.name}</h2>
                            <p className="text-gray-600 mt-2 break-all">{profileUser.email}</p>
                            
                            {/* Account Status Badge */}
                            <div className="mt-4 flex items-center justify-center space-x-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                                    profileUser.is_active !== false 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${
                                        profileUser.is_active !== false 
                                            ? 'bg-green-500' 
                                            : 'bg-red-500'
                                    }`}></span>
                                    {profileUser.is_active !== false ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>

                        {/* User Details Grid */}
                        <div className="max-w-2xl mx-auto border-t border-gray-100 pt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Information</h3>
                            
                            <div className="space-y-4">
                                {/* User ID */}
                                <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                                    <div className="sm:w-1/3">
                                        <span className="text-sm font-medium text-gray-500">User ID</span>
                                    </div>
                                    <div className="sm:w-2/3 mt-1 sm:mt-0">
                                        <span className="text-gray-900 text-sm font-mono break-all">{profileUser.id}</span>
                                    </div>
                                </div>

                                {/* Full Name */}
                                <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                                    <div className="sm:w-1/3">
                                        <span className="text-sm font-medium text-gray-500">Full Name</span>
                                    </div>
                                    <div className="sm:w-2/3 mt-1 sm:mt-0">
                                        <span className="text-gray-900">{profileUser.name}</span>
                                    </div>
                                </div>

                                {/* Email Address */}
                                <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                                    <div className="sm:w-1/3">
                                        <span className="text-sm font-medium text-gray-500">Email Address</span>
                                    </div>
                                    <div className="sm:w-2/3 mt-1 sm:mt-0">
                                        <span className="text-gray-900 break-all">{profileUser.email}</span>
                                    </div>
                                </div>

                                {/* Role */}
                                <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                                    <div className="sm:w-1/3">
                                        <span className="text-sm font-medium text-gray-500">Account Type</span>
                                    </div>
                                    <div className="sm:w-2/3 mt-1 sm:mt-0">
                                        <span className="capitalize text-gray-900 font-medium">{profileUser.role}</span>
                                    </div>
                                </div>

                                {/* Member Since */}
                                {profileUser.created_at && (
                                    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100">
                                        <div className="sm:w-1/3">
                                            <span className="text-sm font-medium text-gray-500">Member Since</span>
                                        </div>
                                        <div className="sm:w-2/3 mt-1 sm:mt-0">
                                            <span className="text-gray-900">
                                                {new Date(profileUser.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Last Updated */}
                                {profileUser.updated_at && (
                                    <div className="flex flex-col sm:flex-row sm:items-center py-3">
                                        <div className="sm:w-1/3">
                                            <span className="text-sm font-medium text-gray-500">Last Updated</span>
                                        </div>
                                        <div className="sm:w-2/3 mt-1 sm:mt-0">
                                            <span className="text-gray-600 text-sm">
                                                {new Date(profileUser.updated_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Additional Stats (Optional) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">-</div>
                                <div className="text-sm text-gray-600 mt-1">Posts</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">-</div>
                                <div className="text-sm text-gray-600 mt-1">Comments</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">-</div>
                                <div className="text-sm text-gray-600 mt-1">Likes</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-8">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Back to Dashboard</span>
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>View All Users</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileWithID;