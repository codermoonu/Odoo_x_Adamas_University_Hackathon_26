import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
    Briefcase, Users, CalendarCheck, FileSpreadsheet, Shield,
    ArrowRight, ChevronRight, CheckCircle, Star, Zap, Clock,
    BarChart3, Lock, Globe, Menu, X
} from 'lucide-react'
/* ─── tiny hook: count-up animation ─────────────────────────────── */
function useCountUp(target, duration = 1800, start = false) {
    const [value, setValue] = useState(0)
    useEffect(() => {
        if (!start) return
        let startTime = null
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            setValue(Math.floor(progress * target))
            if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
    }, [target, duration, start])
    return value
}
/* ─── Animated stat card ─────────────────────────────────────────── */
function StatCard({ value, suffix = '', label, color }) {
    const [visible, setVisible] = useState(false)
    const ref = useRef(null)
    const count = useCountUp(value, 1600, visible)
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.4 })
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [])
    return (
        <div ref={ref} className={`glass-panel p-6 rounded-2xl text-center border ${color}`}>
            <div className="text-4xl font-black text-white font-outfit">
                {count}{suffix}
            </div>
            <div className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-semibold">{label}</div>
        </div>
    )
}
/* ─── Feature card ───────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, gradient, delay }) {
    return (
        <div
            className="glass-panel p-6 rounded-2xl group cursor-default glass-panel-hover"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-white text-base mb-2 font-outfit">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    )
}
/* ─── Main Landing Page ──────────────────────────────────────────── */
function Landing() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])
    const features = [
        {
            icon: Shield,
            title: 'Secure Role-Based Access',
            desc: 'Separate portals for Admins/HR Officers and Employees, each with precisely scoped permissions and audit-ready authentication.',
            gradient: 'bg-gradient-to-tr from-violet-600 to-indigo-500',
            delay: 0
        },
        {
            icon: Users,
            title: 'Employee Profile Management',
            desc: 'Centralized employee records including department, position, salary structures, bio, contact details, and employment status.',
            gradient: 'bg-gradient-to-tr from-indigo-600 to-blue-500',
            delay: 80
        },
        {
            icon: CalendarCheck,
            title: 'Attendance Tracking',
            desc: 'Real-time daily clock-in/out with automated working-hour calculations, day-type classifications and weekly attendance history.',
            gradient: 'bg-gradient-to-tr from-emerald-600 to-teal-500',
            delay: 160
        },
        {
            icon: FileSpreadsheet,
            title: 'Leave & Time-Off Management',
            desc: 'Employees submit casual, sick, or annual leave requests. HR Officers review and approve or reject applications in one click.',
            gradient: 'bg-gradient-to-tr from-amber-600 to-orange-500',
            delay: 240
        },
        {
            icon: BarChart3,
            title: 'Payroll Visibility',
            desc: 'Monthly payslip records with base salary, allowances, statutory deductions, and net pay computed automatically.',
            gradient: 'bg-gradient-to-tr from-rose-600 to-pink-500',
            delay: 320
        },
        {
            icon: Zap,
            title: 'Approval Workflows',
            desc: 'Streamlined HR approval pipelines with instant status updates — Pending, Approved, and Rejected — visible to all stakeholders.',
            gradient: 'bg-gradient-to-tr from-sky-600 to-cyan-500',
            delay: 400
        },
    ]
    const roles = [
        {
            role: 'Admin / HR Officer',
            icon: Shield,
            color: 'from-violet-600 to-indigo-600',
            border: 'border-violet-500/30',
            tag: 'Management Portal',
            tagColor: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
            perks: [
                'View company-wide attendance statistics',
                'Approve or reject employee leave requests',
                'Browse & search full employee directory',
                'Review individual salary structures',
                'Monitor department & workforce metrics',
            ]
        },
        {
            role: 'Employee',
            icon: Users,
            color: 'from-indigo-600 to-blue-600',
            border: 'border-indigo-500/30',
            tag: 'Self-Service Portal',
            tagColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
            perks: [
                'Clock in and out with daily time tracking',
                'View personal attendance history & hours',
                'Submit and track leave applications',
                'Review payslip records & net pay',
                'Manage personal employment profile',
            ]
        }
    ]
    return (
        <div className="min-h-screen bg-[#090d16] text-slate-100 font-inter overflow-x-hidden">
            {/* ── Ambient background blobs ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-15%] left-[-10%] w-[800px] h-[800px] rounded-full bg-violet-600/8 blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-600/8 blur-[140px]" />
                <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-violet-800/6 blur-[100px]" />
                {/* grid dots */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #8b5cf6 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
            </div>
            {/* ── Nav ── */}
            <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#090d16]/85 backdrop-blur-xl border-b border-slate-800/60 shadow-xl shadow-black/20' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Brand */}
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-violet-600/20 rounded-xl border border-violet-500/30">
                            <Briefcase className="h-5 w-5 text-violet-400" />
                        </div>
                        <span className="font-extrabold tracking-tight text-white font-outfit text-lg">
                            Quick<span className="text-violet-400">EMS</span>
                        </span>
                    </div>
                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-violet-400 transition-colors">Features</a>
                        <a href="#roles" className="hover:text-violet-400 transition-colors">Roles</a>
                        <a href="#about" className="hover:text-violet-400 transition-colors">About</a>
                    </div>
                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-5 py-2 text-sm font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 rounded-xl transition-all duration-200"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/signup"
                            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-md shadow-violet-500/20 hover:shadow-violet-500/35 transition-all duration-200 border border-violet-500/20"
                        >
                            Get Started
                        </Link>
                    </div>
                    {/* Mobile hamburger */}
                    <button className="md:hidden p-2 text-slate-400" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden glass-panel border-t border-slate-800/60 px-6 py-4 space-y-3 animate-fade-in">
                        <a href="#features" className="block text-sm text-slate-400 hover:text-violet-400 py-1.5" onClick={() => setMenuOpen(false)}>Features</a>
                        <a href="#roles" className="block text-sm text-slate-400 hover:text-violet-400 py-1.5" onClick={() => setMenuOpen(false)}>Roles</a>
                        <a href="#about" className="block text-sm text-slate-400 hover:text-violet-400 py-1.5" onClick={() => setMenuOpen(false)}>About</a>
                        <div className="flex gap-3 pt-2 border-t border-slate-800">
                            <Link to="/login" className="flex-1 py-2 text-center text-sm font-semibold border border-slate-700 rounded-xl text-slate-300" onClick={() => setMenuOpen(false)}>Sign In</Link>
                            <Link to="/signup" className="flex-1 py-2 text-center text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl" onClick={() => setMenuOpen(false)}>Get Started</Link>
                        </div>
                    </div>
                )}
            </nav>
            {/* ─────────────────────────────────────────────────────────── */}
            {/* ── HERO ── */}
            {/* ─────────────────────────────────────────────────────────── */}
            <section className="relative z-10 pt-24 pb-32 px-6 text-center max-w-5xl mx-auto">
                {/* Badge pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/15 border border-violet-500/25 text-violet-400 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
                    <Star className="h-3 w-3" />
                    Human Resource Management System
                </div>
                {/* Headline */}
                <h1 className="animate-slide-up text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-outfit leading-[1.08]">
                    Every workday,
                    <br />
                    <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
                        perfectly aligned.
                    </span>
                </h1>
                {/* Subheadline */}
                <p className="mt-6 max-w-2xl mx-auto text-slate-400 text-lg leading-relaxed animate-slide-up">
                    QuickEMS digitises and streamlines your core HR operations — from onboarding and attendance tracking to leave approvals and payroll visibility — all inside one beautifully unified platform.
                </p>
                {/* CTA Row */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
                    <Link
                        to="/signup"
                        id="hero-get-started"
                        className="group inline-flex items-center gap-2.5 px-7 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 text-sm border border-violet-400/20 active:scale-[0.98]"
                    >
                        Start For Free
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/login"
                        id="hero-sign-in"
                        className="inline-flex items-center gap-2 px-7 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-2xl transition-all duration-200 text-sm"
                    >
                        Sign In to Portal
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
                {/* Trust strip */}
                <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 font-medium animate-fade-in">
                    {[
                        { icon: Lock, text: 'Secure Auth' },
                        { icon: Globe, text: 'Role-Based Access' },
                        { icon: Clock, text: 'Real-Time Tracking' },
                        { icon: CheckCircle, text: 'No Credit Card Required' },
                    ].map(({ icon: Icon, text }) => (
                        <span key={text} className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-violet-500" /> {text}
                        </span>
                    ))}
                </div>
            </section>
            {/* ── Dashboard Preview ── */}
            <section className="relative z-10 px-6 max-w-6xl mx-auto -mt-4 mb-32">
                <div className="relative rounded-3xl overflow-hidden border border-slate-800/60 shadow-2xl shadow-black/50">
                    {/* Fake browser chrome */}
                    <div className="flex items-center gap-2 px-5 py-3.5 bg-[#0e1525] border-b border-slate-800/80">
                        <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                        <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                        <div className="ml-4 flex-1 bg-slate-800/60 rounded-md px-4 py-1 text-[10px] text-slate-500 font-mono max-w-[280px]">
                            https://quickems.app/dashboard
                        </div>
                    </div>
                    {/* Mock dashboard UI */}
                    <div className="bg-[#0b1120] p-6 space-y-5">
                        {/* Header row */}
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="h-4 w-40 bg-slate-700/60 rounded-md" />
                                <div className="h-3 w-56 bg-slate-800/60 rounded mt-1.5" />
                            </div>
                            <div className="h-8 w-28 bg-violet-600/30 border border-violet-500/20 rounded-xl" />
                        </div>
                        {/* Stat cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Staff', val: '24', color: 'border-violet-500/20 bg-violet-600/8' },
                                { label: 'Departments', val: '10', color: 'border-indigo-500/20 bg-indigo-600/8' },
                                { label: 'Checked In', val: '18', color: 'border-emerald-500/20 bg-emerald-600/8' },
                                { label: 'Pending Leaves', val: '3', color: 'border-amber-500/20 bg-amber-600/8' },
                            ].map(s => (
                                <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
                                    <div className="text-2xl font-black text-white font-outfit">{s.val}</div>
                                    <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{s.label}</div>
                                </div>
                            ))}
                        </div>
                        {/* Table preview */}
                        <div className="rounded-xl border border-slate-800/60 overflow-hidden">
                            <div className="flex gap-4 px-5 py-3 bg-slate-900/40 border-b border-slate-800/60">
                                {['Employee', 'Department', 'Position', 'Net Pay', 'Status'].map(h => (
                                    <div key={h} className="flex-1 text-[9px] text-slate-500 uppercase font-bold tracking-widest">{h}</div>
                                ))}
                            </div>
                            {[
                                ['John Doe', 'Engineering', 'Sr. Developer', '$4,320', 'ACTIVE'],
                                ['Alex Matthew', 'Engineering', 'Developer', '$2,130', 'ACTIVE'],
                                ['David Michael', 'IT Support', 'Support Assoc.', '$1,090', 'ACTIVE'],
                            ].map(([name, dept, pos, pay, status]) => (
                                <div key={name} className="flex gap-4 px-5 py-3.5 border-b border-slate-800/30 last:border-0 hover:bg-slate-900/20">
                                    <div className="flex-1 text-xs font-semibold text-slate-300">{name}</div>
                                    <div className="flex-1 text-xs text-slate-400">{dept}</div>
                                    <div className="flex-1 text-xs text-slate-400">{pos}</div>
                                    <div className="flex-1 text-xs text-emerald-400 font-mono font-bold">{pay}</div>
                                    <div className="flex-1">
                                        <span className="text-[9px] font-extrabold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Glow under preview */}
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-32 bg-violet-600/15 blur-[60px] pointer-events-none" />
            </section>
            {/* ── Stats ── */}
            <section id="about" className="relative z-10 px-6 py-20 bg-gradient-to-b from-transparent via-slate-950/30 to-transparent">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        <StatCard value={10} suffix="+" label="Departments Supported" color="border-violet-500/20" />
                        <StatCard value={6} label="Core HR Modules" color="border-indigo-500/20" />
                        <StatCard value={2} label="Role Access Levels" color="border-emerald-500/20" />
                        <StatCard value={100} suffix="%" label="Browser-Native · No Install" color="border-amber-500/20" />
                    </div>
                </div>
            </section>
            {/* ── Features ── */}
            <section id="features" className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
                {/* Section header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-600/15 border border-indigo-500/25 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-5">
                        <Zap className="h-3 w-3" />
                        Core Platform Features
                    </div>
                    <h2 className="text-4xl font-black text-white font-outfit tracking-tight">
                        Everything HR needs,<br />
                        <span className="text-violet-400">nothing it doesn't.</span>
                    </h2>
                    <p className="mt-4 text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                        Designed around the real workflows of modern HR teams — built to be fast, intuitive, and comprehensive from day one.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map(f => <FeatureCard key={f.title} {...f} />)}
                </div>
            </section>
            {/* ── Scope bullets ── */}
            <section className="relative z-10 px-6 py-20 max-w-5xl mx-auto">
                <div className="glass-panel rounded-3xl p-10 md:p-14 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5 pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-10 items-start">
                        <div className="md:w-2/5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/15 border border-violet-500/25 text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                                System Scope
                            </div>
                            <h2 className="text-3xl font-black text-white font-outfit leading-tight">
                                Built to cover<br />the full HR cycle.
                            </h2>
                            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                                From secure sign-up to payslip review, the QuickEMS platform handles every stage of an employee's lifecycle within the organisation.
                            </p>
                        </div>
                        <div className="md:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {[
                                'Secure Authentication (Sign Up / Sign In)',
                                'Role-Based Access Control',
                                'Employee Profile Management',
                                'Attendance Tracking — Daily & Weekly',
                                'Leave & Time-Off Management',
                                'HR Approval Workflows',
                                'Payroll Visibility & Payslip Records',
                                'Real-Time Dashboard Metrics',
                            ].map(item => (
                                <div key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                                    <CheckCircle className="h-4 w-4 text-violet-500 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* ── Roles ── */}
            <section id="roles" className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/15 border border-violet-500/25 text-violet-400 text-xs font-bold uppercase tracking-widest mb-5">
                        <Shield className="h-3 w-3" />
                        Role-Based Experience
                    </div>
                    <h2 className="text-4xl font-black text-white font-outfit tracking-tight">
                        One system,<br />
                        <span className="text-violet-400">two tailored portals.</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {roles.map(({ role, icon: Icon, color, border, tag, tagColor, perks }) => (
                        <div key={role} className={`glass-panel p-8 rounded-3xl border ${border} relative overflow-hidden glass-panel-hover`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.04] pointer-events-none`} />
                            <div className="relative z-10">
                                {/* Role header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${color} flex items-center justify-center shadow-lg`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${tagColor}`}>
                                        {tag}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-white font-outfit mb-5">{role}</h3>
                                {/* Perk list */}
                                <ul className="space-y-3">
                                    {perks.map(p => (
                                        <li key={p} className="flex items-start gap-2.5 text-sm text-slate-300">
                                            <CheckCircle className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                                {/* CTA */}
                                <Link
                                    to="/signup"
                                    className={`mt-8 inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${color} text-white px-5 py-2.5 rounded-xl shadow-md hover:opacity-90 transition-opacity active:scale-[0.98] border border-white/10`}
                                >
                                    Register as {role.split(' ')[0]}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* ── Final CTA Banner ── */}
            <section className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
                <div className="relative rounded-3xl overflow-hidden glass-panel border border-violet-500/20 text-center p-14">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-indigo-600/8 to-transparent pointer-events-none" />
                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-violet-600/10 blur-[80px] pointer-events-none" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-black text-white font-outfit tracking-tight mb-4">
                            Ready to bring your<br />
                            <span className="text-violet-400">HR team online?</span>
                        </h2>
                        <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed mb-10">
                            Join QuickEMS today. Set up your organisation, onboard employees, and start running a more aligned, efficient workplace — in minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/signup"
                                id="cta-get-started"
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 text-sm border border-violet-400/20 active:scale-[0.98]"
                            >
                                Create Your Account
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/login"
                                id="cta-sign-in"
                                className="inline-flex items-center gap-2 px-8 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-2xl transition-all duration-200 text-sm"
                            >
                                Sign In to Portal
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* ── Footer ── */}
            <footer className="relative z-10 border-t border-slate-800/60 px-6 py-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-violet-500" />
                        <span className="font-bold text-slate-400">Quick<span className="text-violet-400">EMS</span></span>
                        <span className="ml-2">— Human Resource Management System</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/50">v1.0</span>
                        <span className="px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/50">Definitions: Admin · Employee · Time-Off</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
export default Landing
