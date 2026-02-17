"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';
import axiosInstance from '../../shared_components/AxiosInstance/AxiosInstance';

const ForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post('/users/forgot-password/request', {
                email: email
            });

            if (response.data.success) {
                setSubmitted(true);
                
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Email Sent!',
                    text: 'If your email exists in our system, you will receive a reset link.',
                    confirmButtonColor: '#2563eb',
                    background: 'white',
                    timer: 5000,
                    timerProgressBar: true
                });

                // In development, show the reset link
                if (response.data.dev_reset_link) {
                    console.log('Dev Reset Link:', response.data.dev_reset_link);
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Something went wrong. Please try again.',
                confirmButtonColor: '#2563eb',
                background: 'white'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl border border-gray-200 shadow-sm">
                
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-blue-600">
                        Forgot Password?
                    </h2>
                    <p className="mt-3 text-gray-600">
                        {!submitted 
                            ? "Enter your email address and we'll send you a reset link."
                            : "Check your email for the reset link."}
                    </p>
                </div>

                {!submitted ? (
                    <>
                        {/* Forgot Password Form */}
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : 'Send Reset Link'}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    /* Success Message */
                    <div className="mt-8 text-center">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h3>
                            <p className="text-gray-600 mb-4">
                                We&apos;ve sent a password reset link to:<br />
                                <span className="font-medium text-blue-600">{email}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Didn&apos;t receive the email? Check your spam folder or{' '}
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    try again
                                </button>
                            </p>
                        </div>
                    </div>
                )}

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

                {/* Security Note */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-700 text-center">
                        🔒 For security reasons, we will only send a reset link if the email exists in our system.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;