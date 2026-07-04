import { useEffect, useState } from "react"
import { format } from "date-fns"
import Loading from "../../components/Loading"
import { getDayTypeDisplay, getWorkingHoursDisplay } from "../../assets/assets"
import api from "../../api/axios"
import toast from "react-hot-toast"

const AdminAttendance = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    api.get('/attendance').then(({data})=> setRecords(data.data || [])).catch((err)=>{
      toast.error(err.response?.data?.message || err.message)
    }).finally(()=> setLoading(false))
  },[])

  if (loading) return <Loading />

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-orange-100">Today's Attendance</h1>
        <p className="page-subtitle">All employees checked in today - {format(new Date(), "MMMM dd, yyyy")}</p>
      </div>

      <div className='card overflow-hidden'>
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Check In</th>
                <th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Working Hours</th>
                <th className="px-6 py-4">Day Type</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">No one has checked in today yet</td></tr>
              ) : (
                records.map((record)=>{
                  const dayType = getDayTypeDisplay(record)
                  return (
                    <tr key={record._id}>
                      <td className='px-6 py-4 font-medium text-slate-900'>{record.employeeName || record.employeeId}</td>
                      <td className='px-6 py-4 text-slate-600'>{record.checkIn ? format(new Date(record.checkIn), "hh:mm a") : "-"}</td>
                      <td className='px-6 py-4 text-slate-600'>{record.checkOut ? format(new Date(record.checkOut), "hh:mm a") : "-"}</td>
                      <td className='px-6 py-4 text-slate-600 font-medium'>{getWorkingHoursDisplay(record)}</td>
                      <td className='px-6 py-4'>{dayType.label !== "-" ? <span className={`badge ${dayType.className}`}>{dayType.label}</span> : "-"}</td>
                      <td className='px-6 py-4'><span className="badge badge-success">{record.status}</span></td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminAttendance
