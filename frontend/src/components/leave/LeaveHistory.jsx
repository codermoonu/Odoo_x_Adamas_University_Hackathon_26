import React from 'react'
import {format} from 'date-fns'

const LEAVE_TYPE_LABELS = {
    SICK: "Sick",
    CASUAL: "Paid",
    ANNUAL: "Unpaid",
}

const LeaveHistory = ({leaves}) => {
  return (
     <div className='card overflow-hidden'>
            <div className="overflow-x-auto">
                <table className="table-modern">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Dates</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaves.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-12 text-slate-400">
                                    No leave applications found
                                </td>
                            </tr>
                        ) : (
                            leaves.map((leave)=>{
                                return (
                                    <tr key={leave._id || leave.id}>
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

                                        {/* TODO: backend does not yet return an admin remarks/notes field on leave records - render it here once available */}
                                        <td className='max-w-xs truncate text-slate-500' title={leave.remarks}>
                                            {leave.remarks || "-"}
                                        </td>
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
