import React, { useState } from 'react'
import {format} from 'date-fns'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const LEAVE_TYPE_LABELS = {
    SICK: "Sick",
    CASUAL: "Paid",
    ANNUAL: "Unpaid",
}

const LeaveHistory = ({leaves, onUpdate}) => {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN" || user?.role === "HR"
  const [actingId, setActingId] = useState(null)

  const handleStatus = async (leaveId, status) => {
    setActingId(leaveId)
    try {
      await api.patch(`/leave/${leaveId}`, { status })
      toast.success(`Leave ${status.toLowerCase()}`)
      onUpdate?.()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally {
      setActingId(null)
    }
  }

  return (
     <div className='card overflow-hidden'>
            <div className="overflow-x-auto">
                <table className="table-modern">
                    <thead>
                        <tr>
                            {isAdmin && <th>Employee</th>}
                            <th>Type</th>
                            <th>Dates</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Remarks</th>
                            {isAdmin && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length === 0 ? (
                            <tr>
                                <td colSpan={isAdmin ? 7 : 5} className="text-center py-12 text-slate-400">
                                    No leave applications found
                                </td>
                            </tr>
                        ) : (
                            leaves.map((leave)=>{
                                return (
                                    <tr key={leave._id || leave.id}>
                                        {isAdmin && (
                                            <td className='text-slate-700 font-medium'>{leave.employeeName || "-"}</td>
                                        )}

                                        <td>
                                            <span className='badge bg-slate-100 text-slate-600'>{LEAVE_TYPE_LABELS[leave.type] || leave.type}</span>
                                        </td>

                                        <td className='text-xs text-slate-500'>
                                            {format(new Date(leave.startDate), "MMM dd")} - {format(new Date(leave.endDate), "MMM dd, yyyy")}
                                        </td>

                                        <td className='max-w-xs truncate text-slate-500' title={leave.reason}>
                                            {leave.reason}
                                        </td>

                                        <td>
                                            <span className={`badge ${leave.status === "APPROVED" ? "badge-success" : leave.status === "REJECTED" ? "badge-danger" : "badge-warning"}`}>
                                                {leave.status}
                                            </span>
                                        </td>

                                        <td className='max-w-xs truncate text-slate-500' title={leave.remarks}>
                                            {leave.remarks || "-"}
                                        </td>

                                        {isAdmin && (
                                            <td>
                                                {leave.status === "PENDING" ? (
                                                    <div className='flex gap-2'>
                                                        <button
                                                            type='button'
                                                            disabled={actingId === leave._id}
                                                            onClick={()=> handleStatus(leave._id, "APPROVED")}
                                                            className='px-2.5 py-1 text-xs font-medium text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-600 hover:text-slate-950 transition-colors disabled:opacity-50'>
                                                            Approve
                                                        </button>
                                                        <button
                                                            type='button'
                                                            disabled={actingId === leave._id}
                                                            onClick={()=> handleStatus(leave._id, "REJECTED")}
                                                            className='px-2.5 py-1 text-xs font-medium text-rose-600 border-2 border-rose-600 hover:bg-rose-600 hover:text-slate-950 transition-colors disabled:opacity-50'>
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : "-"}
                                            </td>
                                        )}
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default LeaveHistory
