import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { CalendarIcon, FileTextIcon, UsersIcon } from "lucide-react"
import Loading from "../../components/Loading"
import api from "../../api/axios"
import toast from "react-hot-toast"
import { useAuth } from "../../context/AuthContext"

const AdminDashboard = () => {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    api.get('/admin/summary').then(({data})=> setSummary(data)).catch((err)=>{
      toast.error(err.response?.data?.message || err.message)
    }).finally(()=> setLoading(false))
  },[])

  if(loading) return <Loading />

  const cards = [
    { icon: UsersIcon, value: summary?.totalEmployees ?? 0, title: "Total Employees", subtitle: "Active accounts" },
    { icon: CalendarIcon, value: summary?.presentToday ?? 0, title: "Present Today", subtitle: "Checked in today" },
    { icon: FileTextIcon, value: summary?.pendingLeaves ?? 0, title: "Pending Leave Requests", subtitle: "Awaiting approval" },
  ]

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-orange-100">Welcome, {user?.firstName}</h1>
        <p className="page-subtitle">{user?.role === "ADMIN" ? "Administrator" : "HR Officer"} overview</p>
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

      <div className='flex flex-col sm:flex-row gap-3'>
        <Link to="/admin/employees" className='btn-primary text-center inline-flex items-center justify-center gap-2'>
          Manage Employees
        </Link>
        <Link to="/admin/leave" className='btn-secondary text-center'>
          Review Leave Requests
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard
