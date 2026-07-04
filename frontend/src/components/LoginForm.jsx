import React, { useState } from 'react'
import LoginLeftSide from './LoginLeftSide'
import { Navigate, useNavigate } from 'react-router-dom'
import { EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Loading from './Loading'
import toast from 'react-hot-toast'

const LoginForm = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const {user, loading: authLoading, login} = useAuth()
    const navigate = useNavigate()

    if(authLoading) return <Loading />
    if(user) return <Navigate to="/dashboard" />

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        setLoading(true)
        try {
            await login(email, password, "employee")
            navigate("/dashboard")
        } catch (error) {
            const message = error.response?.data?.error || error.message || "Login failed"
            setError(message)
            toast.error(message)
        }finally{
            setLoading(false)
        }
    }

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
        <LoginLeftSide />
        <div className='flex-1 flex items-center justify-center p-6 sm:p-12 bg-[#0a0a0a]'>
            <div className="w-full max-w-md animate-fade-in">

            <div className="mb-8">
                <h1 className='text-xl sm:text-2xl font-medium text-slate-900'>Employee Portal</h1>
                <p className='text-slate-500 text-sm sm:text-base mt-3'>Sign in to access your account</p>
            </div>

            {error && (
                <div className='mb-6 p-4 bg-rose-50 border-2 border-rose-200 text-rose-700 text-sm flex items-start gap-3'>
                    <div className='w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0'/>
                    {error}
                </div>
            )}

            <form className='space-y-5' onSubmit={handleSubmit}>
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Email address</label>
                    <input type="email" value={email} onChange={(e)=> setEmail(e.target.value)} required placeholder='john@example.com'/>
                </div>
                <div>
                    <label className='block text-sm font-medium text-slate-700 mb-2'>Password</label>
                    <div className='relative'>
                        <input type={showPassword ? 'text' : 'password'} onChange={(e)=> setPassword(e.target.value)} required className='pr-11' placeholder='••••••••'/>
                        <button type='button' className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors" onClick={()=> setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOffIcon size={18}/> : <EyeIcon size={18}/>}
                        </button>
                    </div>
                    
                </div>

                <button
                type='submit'
                disabled={loading}
                className='w-full py-3 bg-indigo-600 text-slate-950 text-sm font-semibold border-2 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700 disabled:opacity-50 shadow-md active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center'>
                    {loading && <Loader2Icon className="animate-spin h-4 w-4 mr-2"/>}
                    Sign in
                </button>
            </form>

        </div>
        </div>
        
    </div>
  )
}

export default LoginForm