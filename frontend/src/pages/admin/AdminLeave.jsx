import { useCallback, useEffect, useState } from "react"
import Loading from "../../components/Loading"
import LeaveHistory from "../../components/leave/LeaveHistory"
import api from "../../api/axios"
import toast from "react-hot-toast"

const AdminLeave = () => {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLeaves = useCallback(async () => {
    try {
      const { data } = await api.get('/leave')
      setLeaves(data.data || [])
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(()=>{ fetchLeaves() }, [fetchLeaves])

  if (loading) return <Loading />

  const pendingCount = leaves.filter((l)=> l.status === "PENDING").length

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-orange-100">Leave Approvals</h1>
        <p className="page-subtitle">{pendingCount} request{pendingCount === 1 ? "" : "s"} awaiting your review</p>
      </div>

      <LeaveHistory leaves={leaves} onUpdate={fetchLeaves} />
    </div>
  )
}

export default AdminLeave
