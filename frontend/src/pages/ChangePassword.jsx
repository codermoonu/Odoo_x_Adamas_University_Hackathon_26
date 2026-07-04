import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Loader2Icon, EyeIcon, EyeOffIcon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Loading from '../components/Loading'
import api from '../api/axios'
import toast from 'react-hot-toast'

const ChangePassword = () => {
    const { user, loading: authLoading, refreshSession } = useAuth()
    const navigate = useNavigate()

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    if (authLoading) return <Loading />
    if (!user) return <Navigate to="/login" />

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.")
            return;
        }

        setLoading(true)
        try {
            await api.post("/auth/change-password", { currentPassword, newPassword, confirmPassword })
            await refreshSession()
            toast.success("Password updated successfully")
            navigate(user.role === "ADMIN" || user.role === "HR" ? "/admin/dashboard" : "/dashboard")
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Failed to change password"
            setError(message)
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]'>
            <div className="w-full max-w-md animate-fade-in">
                <div className="mb-8">
                    <h1 className='text-xl sm:text-2xl font-medium text-slate-900'>Change Your Password</h1>
                    <p className='text-slate-500 text-sm sm:text-base mt-3'>
                        {user.firstLogin
                            ? "This is your first login. Please set a new password before continuing."
                            : "Update your account password."}
                    </p>
                </div>

                {error && (
                    <div className='mb-6 p-4 bg-rose-50 border-2 border-rose-200 text-rose-700 text-sm flex items-start gap-3'>
                        <div className='w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0'/>
                        {error}
                    </div>
                )}

                <form className='space-y-5' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>Current Password</label>
                        <input type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={(e)=> setCurrentPassword(e.target.value)} required/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>New Password</label>
                        <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e)=> setNewPassword(e.target.value)} required/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-slate-700 mb-2'>Confirm New Password</label>
                        <div className='relative'>
                            <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)} required className='pr-11'/>
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
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword
