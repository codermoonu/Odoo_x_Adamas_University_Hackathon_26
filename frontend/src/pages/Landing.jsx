import { Navigate, Link } from 'react-router-dom'
import { CalendarIcon, DollarSignIcon, FileTextIcon, ShieldCheckIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'
import ParticleField from '../components/ParticleField'

const FEATURES = [
    { icon: CalendarIcon, title: "Attendance", text: "Day-wise check-in/check-out tracking for every employee." },
    { icon: FileTextIcon, title: "Time Off", text: "Apply for leave and get approvals from HR, all in one place." },
    { icon: DollarSignIcon, title: "Payroll", text: "Automatic salary computation from attendance and wage structure." },
    { icon: ShieldCheckIcon, title: "Admin Control", text: "HR and Admins manage employees, attendance and approvals." },
]

const roleHome = (user) => {
    if (user.firstLogin) return "/change-password"
    if (user.role === "ADMIN" || user.role === "HR") return "/admin/dashboard"
    return "/dashboard"
}

const Landing = () => {
    const { user, loading } = useAuth()

    if (loading) return <Loading />
    if (user) return <Navigate to={roleHome(user)} />

    return (
        <div className='min-h-screen bg-black relative overflow-hidden'>
            <div className="absolute -top-30 -left-30 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <ParticleField />

            <div className='relative z-10 flex flex-col min-h-screen'>
                <header className='flex items-center justify-between px-6 sm:px-12 py-6'>
                    <h2 className='text-white font-semibold tracking-wide'>Employee MS</h2>
                    <Link to="/login" className='btn-primary text-sm px-5 py-2'>Sign In</Link>
                </header>

                <main className='flex-1 flex flex-col items-center justify-center text-center px-6 py-16'>
                    <h1 className='text-3xl sm:text-5xl font-medium text-white mb-6 leading-tight tracking-wide max-w-3xl'>
                        Employee Management System
                    </h1>
                    <p className='text-slate-400 text-base sm:text-lg max-w-xl mb-10 leading-relaxed'>
                        Streamline your workforce operations, track attendance, manage payroll, and empower your team securely.
                    </p>
                    <Link to="/login" className='btn-primary px-8 py-3 text-base'>
                        Sign In to Your Account
                    </Link>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20 max-w-4xl w-full'>
                        {FEATURES.map((f) => (
                            <div key={f.title} className='border-2 border-slate-700 bg-slate-950/60 p-5 text-left'>
                                <f.icon className='w-6 h-6 text-orange-400 mb-3' />
                                <h3 className='text-white font-medium mb-1'>{f.title}</h3>
                                <p className='text-slate-500 text-sm'>{f.text}</p>
                            </div>
                        ))}
                    </div>
                </main>

                <footer className='text-center text-slate-600 text-xs py-6'>
                    Accounts are created by HR or an Administrator — self-registration is not available.
                </footer>
            </div>
        </div>
    )
}

export default Landing
