import { Navigate, Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { useAuth } from "../context/AuthContext"
import Loading from "../components/Loading"


const Layout = () => {
  const {user, loading} = useAuth()

  if(loading) return <Loading />
  // TEMP: auth gate disabled for local preview without a backend - restore this before shipping
  // if(!user) return <Navigate to="/login" />

  return (
    <div className="flex h-screen bg-slate-950">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
            <div className="p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8 max-w-400 mx-auto">
                <Outlet />
            </div>
        </main>
    </div>
  )
}

export default Layout