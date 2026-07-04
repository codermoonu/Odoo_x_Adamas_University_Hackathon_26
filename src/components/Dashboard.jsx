import React from 'react'
import { LogOut, Shield, User, Briefcase } from 'lucide-react'
import AdminDashboard from './AdminDashboard.jsx'
import EmployeeDashboard from './EmployeeDashboard.jsx'

function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col font-inter">
      {/* Premium Header */}
      <header className="glass-panel sticky top-0 z-50 border-x-0 border-t-0 border-b border-slate-800 bg-[#0c1220]/75 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-violet-600/20 rounded-xl border border-violet-500/30">
              <Briefcase className="h-5 w-5 text-violet-400" />
            </div>
            <span className="font-extrabold tracking-tight text-white font-outfit text-lg">
              Quick<span className="text-violet-400">EMS</span>
            </span>
          </div>

          {/* User profile controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-900/60 rounded-xl border border-slate-800/80">
              {user.role === 'ADMIN' ? (
                <Shield className="h-4 w-4 text-violet-400" />
              ) : (
                <User className="h-4 w-4 text-indigo-400" />
              )}
              <div className="text-left">
                <div className="text-xs font-semibold text-slate-200">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                  {user.role}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl border border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-all duration-200 cursor-pointer flex items-center gap-2 text-xs font-medium"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {user.role === 'ADMIN' ? (
          <AdminDashboard user={user} />
        ) : (
          <EmployeeDashboard user={user} />
        )}
      </main>
    </div>
  )
}

export default Dashboard;
