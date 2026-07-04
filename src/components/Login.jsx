import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Briefcase, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { loginUser, changePassword } from '../utils/apiClient.js'

function Login({ onLogin }) {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isFirstLogin, setIsFirstLogin] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!loginId || !password) {
        throw new Error('Please fill in all fields.')
      }

      const response = await loginUser(loginId, password)

      if (!response.success) {
        throw new Error(response.message || 'Login failed')
      }

      // If first login, show password change form
      if (response.user.firstLogin) {
        setCurrentUser(response.user)
        setIsFirstLogin(true)
        setLoginId('')
        setPassword('')
      } else {
        onLogin(response.user)
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!newPassword || !confirmPassword) {
        throw new Error('Please fill in all password fields.')
      }
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match.')
      }
      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long.')
      }

      const response = await changePassword(currentUser._id, newPassword, confirmPassword)

      if (!response.success) {
        throw new Error(response.message || 'Password change failed')
      }

      onLogin(currentUser)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Password change failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (demoLoginId, demoPass) => {
    setLoginId(demoLoginId)
    setPassword(demoPass)
    setError('')
  }

  // First Login Password Change Form
  if (isFirstLogin) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#090d16]">
        {/* Background gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-[440px] animate-slide-up">
          {/* Logo/Brand Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="p-3 bg-violet-600/20 rounded-2xl border border-violet-500/30 shadow-lg shadow-violet-500/15 mb-4 animate-pulse">
              <Briefcase className="h-8 w-8 text-violet-400" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-outfit">
              Quick<span className="text-violet-400">EMS</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 font-inter">
              Change Initial Password
            </p>
          </div>

          {/* Card */}
          <div className="glass-panel p-8 rounded-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-2xl"></div>

            <h2 className="text-xl font-semibold text-slate-100 mb-2 font-outfit">
              Welcome, {currentUser?.firstName}!
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              This is your first login. Please change your temporary password to continue.
            </p>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs animate-fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-5">
              {/* New Password Field */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-500" />
                  </div>
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password (min 8 characters)"
                    className="custom-input pl-10.5 pr-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-300"
                  >
                    {showNewPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your new password"
                    className="custom-input pl-10.5"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-xl text-sm transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 border border-violet-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Update Password <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Standard Login Form
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#090d16]">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[440px] animate-slide-up">
        {/* Logo/Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-3 bg-violet-600/20 rounded-2xl border border-violet-500/30 shadow-lg shadow-violet-500/15 mb-4 animate-pulse">
            <Briefcase className="h-8 w-8 text-violet-400" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-outfit">
            Quick<span className="text-violet-400">EMS</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-inter">
            Human Resource Management System
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-2xl"></div>

          <h2 className="text-xl font-semibold text-slate-100 mb-6 font-outfit">
            Sign In
          </h2>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login ID Field */}
            <div className="space-y-2">
              <label htmlFor="loginId" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Login ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-slate-500" />
                </div>
                <input
                  id="loginId"
                  type="text"
                  placeholder="e.g. OIJODO20220001"
                  className="custom-input pl-10.5 uppercase"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value.toUpperCase())}
                  disabled={loading}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                Format: OI + First 2 letters of first & last name + Year + Serial number
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-slate-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="custom-input pl-10.5 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-xl text-sm transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 border border-violet-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Demo Accounts Panel */}
          <div className="mt-8 text-center text-sm border-t border-slate-800/60 pt-6">
            <div className="text-slate-500 mb-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">⚡ Demo Accounts</span>
              <div className="space-y-2 text-left text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-violet-400">Admin:</span>
                  <code className="font-mono text-slate-400">OIADOW20260001 / Admin@123456</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-indigo-400">Employee:</span>
                  <code className="font-mono text-slate-400">OIDAMI20240001 / TempPass@1234</code>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-3">
              <button
                onClick={() => fillDemo('OIADOW20260001', 'Admin@123456')}
                className="flex-1 py-2 px-3 bg-violet-950/20 border border-violet-800/30 hover:border-violet-600/50 rounded-lg text-slate-300 text-left transition-colors duration-200"
              >
                <div className="font-bold text-violet-400 text-xs">Admin</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">OIADOW20260001</div>
              </button>
              <button
                onClick={() => fillDemo('OIDAMI20240001', 'TempPass@1234')}
                className="flex-1 py-2 px-3 bg-indigo-950/20 border border-indigo-800/30 hover:border-indigo-600/50 rounded-lg text-slate-300 text-left transition-colors duration-200"
              >
                <div className="font-bold text-indigo-400 text-xs">Employee</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">OIDAMI20240001</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;