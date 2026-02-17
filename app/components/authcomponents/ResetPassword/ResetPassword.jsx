"use client"
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../shared_components/AxiosInstance/AxiosInstance';

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);
    const [validToken, setValidToken] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Get token and email from URL on component mount
    useEffect(() => {
        const urlToken = searchParams.get('token');
        const urlEmail = searchParams.get('email');

        if (!urlToken || !urlEmail) {
            setValidToken(false);
            setVerifying(false);
            return;
        }

        setToken(urlToken);
        setEmail(decodeURIComponent(urlEmail));
        verifyToken(urlToken, decodeURIComponent(urlEmail));
    }, [searchParams]);

    // Verify token validity
    const verifyToken = async (token, email) => {
        try {
            const response = await axiosInstance.get('/users/forgot-password/verify-token', {
                params: { token, email }
            });

            if (response.data.success) {
                setValidToken(true);
            } else {
                setValidToken(false);
            }
        } catch (error) {
            console.error('Token verification error:', error);
            setValidToken(false);
        } finally {
            setVerifying(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear password error when typing
        if (passwordError) setPasswordError('');

        // Real-time password match validation
        if (name === 'confirmPassword' || name === 'newPassword') {
            if (name === 'newPassword' && formData.confirmPassword && value !== formData.confirmPassword) {
                setPasswordError('Passwords do not match');
            } else if (name === 'confirmPassword' && formData.newPassword && value !== formData.newPassword) {
                setPasswordError('Passwords do not match');
            } else {
                setPasswordError('');
            }
        }
    };

    const validatePassword = () => {
        if (formData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
            return false;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword()) return;

        setLoading(true);

        try {
            const response = await axiosInstance.post('/users/forgot-password/reset', {
                email: email,
                token: token,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            if (response.data.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Password Reset Successful!',
                    text: 'Your password has been changed. You can now login with your new password.',
                    confirmButtonColor: '#2563eb',
                    background: 'white',
                    timer: 3000,
                    timerProgressBar: true
                });

                // Redirect to login page
                router.push('/login');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to reset password. Please try again.',
                confirmButtonColor: '#2563eb',
                background: 'white'
            });
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (verifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verifying your reset link...</p>
                </div>
            </div>
        );
    }

    // Invalid token state
    if (!validToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl border border-gray-200 shadow-sm text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid or Expired Link</h2>
                    <p className="text-gray-600 mb-6">
                        The password reset link is invalid or has expired. Please request a new one.
                    </p>
                    <Link
                        href="/forgot-password"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl border border-gray-200 shadow-sm">
                
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-blue-600">
                        Reset Password
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Enter your new password below
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                        For: <span className="font-medium text-blue-600">{email}</span>
                    </p>
                </div>

                {/* Reset Password Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        {/* New Password Field */}
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 pr-12"
                                    placeholder="Enter new password"
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 pr-12"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Password Error Message */}
                        {passwordError && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                                {passwordError}
                            </div>
                        )}

                        {/* Password Requirements */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li className="flex items-center">
                                    <span className={`mr-2 ${formData.newPassword.length >= 6 ? 'text-green-500' : 'text-gray-400'}`}>
                                        {formData.newPassword.length >= 6 ? '✓' : '○'}
                                    </span>
                                    At least 6 characters long
                                </li>
                                <li className="flex items-center">
                                    <span className={`mr-2 ${formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'text-green-500' : 'text-gray-400'}`}>
                                        {formData.newPassword && formData.confirmPassword && formData.newPassword === formData.confirmPassword ? '✓' : '○'}
                                    </span>
                                    Passwords match
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Reset Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading || !!passwordError}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Resetting Password...
                                </>
                            ) : 'Reset Password'}
                        </button>
                    </div>
                </form>

                {/* Back to Login Link */}
                <div className="text-center mt-6">
                    <Link 
                        href="/login"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;