import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Landing from './components/Landing.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = sessionStorage.getItem('hrms_current_user');
        return saved ? JSON.parse(saved) : null;
    });

    const handleLogin = (user) => {
        setCurrentUser(user);
        sessionStorage.setItem('hrms_current_user', JSON.stringify(user));
    };

    const handleLogout = () => {
        setCurrentUser(null);
        sessionStorage.removeItem('hrms_current_user');
    };

    return (
        <Router>
            <div className="min-h-screen text-slate-100 selection:bg-violet-500/35 selection:text-white">
                <Routes>
                    {/* Public Landing Page */}
                    <Route path="/" element={<Landing />} />

                    {/* Login */}
                    <Route
                        path="/login"
                        element={
                            currentUser ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <Login onLogin={handleLogin} />
                            )
                        }
                    />

                    {/* Signup */}
                    <Route
                        path="/signup"
                        element={
                            currentUser ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <Signup onLogin={handleLogin} />
                            )
                        }
                    />

                    {/* Protected Dashboard */}
                    <Route
                        path="/dashboard"
                        element={
                            currentUser ? (
                                <Dashboard
                                    user={currentUser}
                                    onLogout={handleLogout}
                                />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    {/* Any unknown URL redirects to Landing */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;