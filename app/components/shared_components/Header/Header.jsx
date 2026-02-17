"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../authcomponents/AuthContext/AuthContext";

const Header = () => {
    const router = useRouter();
    const { user, logout, loading } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
        router.push("/login");
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.profile-menu')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Don't render anything while loading auth state
    if (loading) {
        return (
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="shrink-0">
                            <h1 className="text-2xl font-bold text-blue-600">
                                Auth With JWT
                            </h1>
                        </div>
                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="shrink-0">
                        <h1 
                            onClick={() => router.push('/')}
                            className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
                        >
                            Auth With JWT
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        {user ? (
                            <div className="relative flex items-center justify-center gap-4 profile-menu">
                                {/* Dashboard Button - Enhanced Design */}
                                <Link
                                    href="/dashboard"
                                    className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span>Dashboard</span>
                                </Link>

                                {/* Profile Button */}
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-semibold">
                                            {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="font-medium">
                                        {user.name || user.email?.split('@')[0]}
                                    </span>
                                    <svg 
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-12 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                        {/* User Info in Dropdown */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                                            {user.role && (
                                                <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                                                    {user.role}
                                                </span>
                                            )}
                                        </div>

                                        {/* Profile Link */}
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                                            onClick={() => {
                                                router.push("/profile");
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>View Profile</span>
                                        </button>

                                        {/* Dashboard Link in Dropdown (optional) */}
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                                            onClick={() => {
                                                router.push("/dashboard");
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            <span>Dashboard</span>
                                        </button>

                                        {/* Logout Button */}
                                        <button
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 border-t border-gray-100 mt-1"
                                            onClick={handleLogout}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => router.push("/login")}
                                    className="px-5 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => router.push("/register")}
                                    className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                                >
                                    Register
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="sm:hidden">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isDropdownOpen && (
                <div className="sm:hidden bg-white border-t border-gray-200">
                    <div className="px-4 py-3 space-y-2">
                        {user ? (
                            <>
                                <div className="py-3 text-gray-700 font-medium border-b border-gray-100">
                                    <p className="text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                                </div>
                                
                                {/* Mobile Dashboard Link */}
                                <button
                                    onClick={() => {
                                        router.push("/dashboard");
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                                >
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <span>Dashboard</span>
                                </button>

                                {/* Mobile Profile Link */}
                                <button
                                    onClick={() => {
                                        router.push("/profile");
                                        setIsDropdownOpen(false);
                                    }}
                                    className="w-full text-left px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-3"
                                >
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Profile</span>
                                </button>

                                {/* Mobile Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-3 border-t border-gray-100 mt-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => router.push("/login")}
                                    className="w-full px-3 py-3 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => router.push("/register")}
                                    className="w-full px-3 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;