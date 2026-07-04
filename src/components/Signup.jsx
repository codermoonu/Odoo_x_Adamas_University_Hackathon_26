import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Briefcase, User, Mail, Lock, Shield, Key, Landmark, Percent, Calendar, Phone, AlertCircle, ArrowRight } from 'lucide-react'
import { signupUser } from '../utils/mockDb.js'

const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "IT Support",
  "Customer Success",
  "Product Management",
  "Design"
];

const SUGGESTED_POSITIONS = {
  "Engineering": ["Junior Developer", "Software Developer", "Senior Developer", "Tech Lead", "QA Engineer"],
  "Human Resources": ["HR Recruiter", "HR Generalist", "HR Manager", "Compensation Specialist"],
  "Marketing": ["Marketing Analyst", "SEO Specialist", "Marketing Coordinator", "Marketing Manager"],
  "Sales": ["Sales Associate", "Account Executive", "Sales Manager", "Sales Operations Analyst"],
  "Finance": ["Financial Analyst", "Accountant", "Finance Manager", "Controller"],
  "Operations": ["Operations Associate", "Operations Coordinator", "Operations Manager"],
  "IT Support": ["Helpdesk Support", "Associate Business Support", "System Administrator", "Network Engineer"],
  "Customer Success": ["Customer Specialist", "Success Manager", "Support Lead"],
  "Product Management": ["Associate Product Manager", "Product Manager", "Senior Product Manager"],
  "Design": ["UI/UX Designer", "Product Designer", "Visual Designer", "Creative Lead"]
};

function Signup({ onLogin }) {
  const [role, setRole] = useState('EMPLOYEE') // Default to Employee as shown first in requirements
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')

  // Admin-specific
  const [secretCode, setSecretCode] = useState('')

  // Employee-specific
  const [department, setDepartment] = useState(DEPARTMENTS[0])
  const [position, setPosition] = useState('')
  const [basicSalary, setBasicSalary] = useState('')
  const [allowances, setAllowances] = useState('')
  const [deductions, setDeductions] = useState('')
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0])

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole)
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Basic Validations
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all core fields.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (role === 'ADMIN' && !secretCode) {
      setError('Please enter the Admin Secret Code.')
      return
    }

    if (role === 'EMPLOYEE') {
      if (!position) {
        setError('Please enter your position.')
        return
      }
      if (!basicSalary || Number(basicSalary) <= 0) {
        setError('Please enter a valid Basic Salary.')
        return
      }
    }

    setLoading(true)

    setTimeout(() => {
      try {
        const signupData = {
          role,
          firstName,
          lastName,
          email,
          password,
          phone,
          ...(role === 'ADMIN' ? { secretCode } : {
            department,
            position,
            basicSalary: Number(basicSalary),
            allowances: Number(allowances) || 0,
            deductions: Number(deductions) || 0,
            joinDate
          })
        }

        const user = signupUser(signupData)
        onLogin(user)
        navigate('/dashboard')
      } catch (err) {
        setError(err.message || 'Signup failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#090d16]">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[640px] animate-slide-up">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="p-3 bg-violet-600/20 rounded-2xl border border-violet-500/30 shadow-lg shadow-violet-500/15 mb-3">
            <Briefcase className="h-7 w-7 text-violet-400" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-outfit">
            Quick<span className="text-violet-400">EMS</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-inter">
            Human Resource Management System Registration
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none rounded-2xl"></div>

          <h2 className="text-xl font-semibold text-slate-100 mb-6 font-outfit">
            Create Account
          </h2>

          {/* Role Tabs */}
          <div className="mb-6 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select Registration Role
            </label>
            <div className="flex p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => handleRoleChange('EMPLOYEE')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${role === 'EMPLOYEE'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                  }`}
              >
                <User className="h-4.5 w-4.5" />
                Employee Account
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('ADMIN')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${role === 'ADMIN'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                  }`}
              >
                <Shield className="h-4.5 w-4.5" />
                Admin / HR Manager
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Core User Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">
                Core Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className="custom-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="custom-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="john.doe@company.com"
                      className="custom-input pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="tel"
                      placeholder="9876543210"
                      className="custom-input pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="custom-input pl-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="custom-input pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Specific Settings */}
            {role === 'ADMIN' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">
                  Admin Credentials
                </h3>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    Secret Verification Code <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="Enter verification code (e.g. any code for mockup)"
                      className="custom-input pl-10"
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Required to verify administrator rights. Any value works for this demo.
                  </p>
                </div>
              </div>
            )}

            {/* Employee Specific Settings */}
            {role === 'EMPLOYEE' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">
                  Employment Profile Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Department</label>
                    <select
                      className="custom-input cursor-pointer"
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value)
                        setPosition('') // Clear position suggestions
                      }}
                      disabled={loading}
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept} className="bg-slate-950 text-slate-100">{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Position / Job Title</label>
                    <input
                      type="text"
                      list="positions"
                      placeholder="e.g. Software Engineer"
                      className="custom-input"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      disabled={loading}
                    />
                    <datalist id="positions">
                      {SUGGESTED_POSITIONS[department]?.map(pos => (
                        <option key={pos} value={pos} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      Basic Salary <Landmark className="h-3 w-3 text-slate-500" />
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 3000"
                      className="custom-input"
                      value={basicSalary}
                      onChange={(e) => setBasicSalary(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      Allowances <Percent className="h-3 w-3 text-slate-500" />
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 400"
                      className="custom-input"
                      value={allowances}
                      onChange={(e) => setAllowances(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      Deductions <Percent className="h-3 w-3 text-slate-500" />
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 100"
                      className="custom-input"
                      value={deductions}
                      onChange={(e) => setDeductions(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    Join Date <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  </label>
                  <input
                    type="date"
                    className="custom-input"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 border border-violet-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Register Account <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Login Switch */}
          <div className="mt-8 text-center text-sm border-t border-slate-800/60 pt-6">
            <span className="text-slate-500">Already have an account? </span>
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors duration-150">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup;
