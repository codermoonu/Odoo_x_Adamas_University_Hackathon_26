import { ArrowRightIcon, CalendarIcon, ClockIcon, DollarSignIcon, FileTextIcon, LogOutIcon, UserIcon } from 'lucide-react';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EmployeeDashboard = ({data}) => {
    const emp = data.employee;
    const { logout } = useAuth();
    const navigate = useNavigate();

    const cards = [
        {
            icon: CalendarIcon,
            value: data.currentMonthAttendance,
            title: "Days Present",
            subtitle: "This month",
        },
        {
            icon: FileTextIcon,
            value: data.pendingLeaves,
            title: "Pending Leaves",
            subtitle: "Awaiting approval",
        },
        {
            icon: DollarSignIcon,
            value: data.latestPayslip ? `$${data.latestPayslip.netSalary?.toLocaleString()}` : "N/A",
            title: "Latest Payslip",
            subtitle: "Most recent payout",
        },
    ]

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    }

  return (
    <div className="animate-fade-in">
        <div className="page-header">
            <h1 className='page-title'>Welcome, {emp?.firstName}!</h1>
            <p className="page-subtitle">
                {emp?.position} - {emp?.department || "No Department"}
            </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8'>
            {cards.map((card, index)=>(
                <div key={index} className='card card-hover p-5 sm:p-6 relative overflow-hidden group flex items-center justify-between'>
                    <div>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-500/70 group-hover:bg-indigo-500/70"/>
                        <p className='text-sm font-medium text-slate-700'>{card.title}</p>
                        <p className='text-2xl font-bold text-slate-900 mt-1'>{card.value}</p>
                        <p className='text-xs text-slate-500 mt-1'>{card.subtitle}</p>
                    </div>
                    <card.icon className='size-10 p-2.5 bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-200'/>
                </div>
            ))}
        </div>

        <div className='flex flex-col sm:flex-row gap-3 mb-8'>
            <Link to="/attendance" className='btn-primary text-center inline-flex items-center justify-center gap-2'>
                Mark Attendance <ArrowRightIcon className="w-4 h-4" />
            </Link>

            <Link to="/leave" className='btn-secondary text-center'>
                Apply for Leave
            </Link>
        </div>

        {/* Quick access */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8'>
            <Link to="/settings" className='card card-hover p-5 sm:p-6 flex items-center gap-4 group'>
                <div className='p-3 bg-slate-100 group-hover:bg-indigo-50 transition-colors duration-200'>
                    <UserIcon className='w-5 h-5 text-slate-600 group-hover:text-indigo-600'/>
                </div>
                <div>
                    <p className='font-medium text-slate-900'>Profile</p>
                    <p className='text-sm text-slate-500'>View and edit your profile</p>
                </div>
            </Link>

            <button onClick={handleLogout} className='card card-hover p-5 sm:p-6 flex items-center gap-4 group text-left'>
                <div className='p-3 bg-slate-100 group-hover:bg-rose-50 transition-colors duration-200'>
                    <LogOutIcon className='w-5 h-5 text-slate-600 group-hover:text-rose-600'/>
                </div>
                <div>
                    <p className='font-medium text-slate-900'>Logout</p>
                    <p className='text-sm text-slate-500'>Sign out of your account</p>
                </div>
            </button>
        </div>

        {/* Recent Activity */}
        <div className='card p-5 sm:p-6'>
            <h2 className='font-semibold text-slate-900 text-sm mb-4 flex items-center gap-2'>
                <ClockIcon className='w-4 h-4 text-slate-400'/> Recent Activity
            </h2>
            {/* TODO: backend has no activity-feed endpoint yet - wire this up once one exists */}
            <p className='text-sm text-slate-500'>No recent activity to show yet.</p>
        </div>

    </div>
  )
}

export default EmployeeDashboard
