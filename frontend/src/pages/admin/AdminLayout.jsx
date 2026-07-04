import { Navigate, Outlet } from "react-router-dom"
import AdminSidebar from "../../components/AdminSidebar"
import { useAuth } from "../../context/AuthContext"
import Loading from "../../components/Loading"

const AdminLayout = () => {
  const {user, loading} = useAuth()

  if(loading) return <Loading />
  if(!user) return <Navigate to="/login" />
  if(user.firstLogin) return <Navigate to="/change-password" />
  if(user.role !== "ADMIN" && user.role !== "HR") return <Navigate to="/dashboard" />

  return (
    <div className="flex h-screen bg-slate-950">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
            <div className="p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8 max-w-400 mx-auto">
                <Outlet />
            </div>
        </main>
    </div>
  )
}

export default AdminLayout
