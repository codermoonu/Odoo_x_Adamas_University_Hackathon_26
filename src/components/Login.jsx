import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Briefcase, AlertCircle, ArrowRight } from 'lucide-react'
import { loginUser } from '../utils/mockDb.js'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Small timeout to simulate loading state for rich micro-interactions
    setTimeout(() => {
      try {
        if (!email || !password) {
          throw new Error('Please fill in all fields.')
        }
        const user = loginUser(email, password)
        onLogin(user)
        navigate('/dashboard')
      } catch (err) {
        setError(err.message || 'Login failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }, 600)
  }

  const fillDemo = (demoEmail, demoPass) => {
    setEmail(demoEmail)
    setPassword(demoPass)
    setError('')
  }

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
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-slate-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="custom-input pl-10.5"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-slate-500" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="custom-input pl-10.5"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  Sign In <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Create Account Link */}
          <div className="mt-8 text-center text-sm border-t border-slate-800/60 pt-6">
            <span className="text-slate-500">New to EMS? </span>
            <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors duration-150">
              Create an account
            </Link>
          </div>
        </div>

        {/* Demo Accounts Panel */}
        <div className="mt-6 glass-panel p-4 rounded-xl text-xs space-y-2.5">
          <div className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
            ⚡ Quick Demo Accounts
          </div>
          <div className="flex gap-2 justify-between">
            <button
              onClick={() => fillDemo('admin@example.com', 'admin123')}
              className="flex-1 py-2 px-3 bg-violet-950/20 border border-violet-800/30 hover:border-violet-600/50 rounded-lg text-slate-300 text-left transition-colors duration-200"
            >
              <div className="font-bold text-violet-400">Admin Role</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">admin@example.com</div>
            </button>
            <button
              onClick={() => fillDemo('johndoe@example.com', 'password123')}
              className="flex-1 py-2 px-3 bg-indigo-950/20 border border-indigo-800/30 hover:border-indigo-600/50 rounded-lg text-slate-300 text-left transition-colors duration-200"
            >
              <div className="font-bold text-indigo-400">Employee Role</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">johndoe@example.com</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login;
