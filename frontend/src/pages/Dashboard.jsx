import { useEffect, useState } from "react"
import Loading from "../components/Loading"
import EmployeeDashboard from "../components/EmployeeDashboard"
import api from "../api/axios"
import toast from "react-hot-toast"
// TEMP: only used as a local-preview fallback when there's no backend to answer /dashboard - remove with the block below
import { dummyEmployeeDashboardData } from "../assets/assets"

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    api.get('/dashboard').then((res)=> setData(res.data)).catch((err)=> {
      toast.error(err.response?.data?.error || err?.message)
      // TEMP: fall back to mock data for local preview without a backend - restore plain error handling before shipping
      setData(dummyEmployeeDashboardData)
    }).finally(()=> setLoading(false))
  },[])

  if(loading) return <Loading />
  if(!data) return <p className="text-center text-slate-500 py-12">Failed to load dashboard</p>

  return <EmployeeDashboard data={data}/>
}

export default Dashboard