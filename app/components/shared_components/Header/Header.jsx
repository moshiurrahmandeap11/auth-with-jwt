"use client"
import { useEffect, useState } from "react";
import axiosInstance from "../AxiosInstance/AxiosInstance";

const Header = () => {
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const userData = localStorage.getItem("user");
    const parsedUser = userData ? JSON.parse(userData) : null;

    useEffect(() => {
        const tryFetch = async() => {
            if (parsedUser?.id) {
                try {
                    const res = await axiosInstance.get(`/users/${parsedUser.id}`);
                    if(res.data.success) {
                        setUser(res.data.data);
                    }
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            }
        };
        tryFetch();
    }, [parsedUser?.id]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setIsDropdownOpen(false);
        window.location.href = "/login";
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="shrink-0">
                        <h1 className="text-2xl font-bold text-blue-600">
                            Auth With JWT
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        {user ? (
                            <div className="relative">
                                {/* Profile Button */}
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
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
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                            onClick={() => window.location.href = "/profile"}
                                        >
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Profile</span>
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 border-t border-gray-100"
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
                                    onClick={() => window.location.href = "/login"}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => window.location.href = "/register"}
                                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                <div className="py-2 text-gray-700 font-medium border-b border-gray-100">
                                    {user.name || user.email}
                                </div>
                                <button
                                    onClick={() => window.location.href = "/profile"}
                                    className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => window.location.href = "/login"}
                                    className="w-full px-3 py-2 text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => window.location.href = "/register"}
                                    className="w-full px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
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