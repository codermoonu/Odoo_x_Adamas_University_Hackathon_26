import React, { useState, useEffect } from 'react'
import { Calendar, Clock, Landmark, Send, Info, FileSpreadsheet, CalendarDays, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { getDb, toggleAttendance, applyForLeave } from '../utils/mockDb.js'
function EmployeeDashboard({ user }) {
  const [dbData, setDbData] = useState({ employees: [], leaves: [], attendance: [], payslips: [] })

  // Leave request state
  const [leaveType, setLeaveType] = useState('CASUAL')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [formError, setFormError] = useState('')
  // Load database
  const reloadData = () => {
    setDbData(getDb())
  }
  useEffect(() => {
    reloadData()
  }, [])
  // Find this employee's details
  const empProfile = dbData.employees.find(e => e._id === user._id) || {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: '—',
    department: 'General Staff',
    position: 'Employee',
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    joinDate: '—',
    bio: ''
  }
  // Filter employee data logs
  const myAttendance = dbData.attendance.filter(a => a.employeeId === user._id)
  const myLeaves = dbData.leaves.filter(l => l.employeeId === user._id)
  const myPayslips = dbData.payslips.filter(p => p.employeeId === user._id)
  // Check if today attendance checked in
  const todayStr = new Date().toISOString().split('T')[0]
  const todayRecord = myAttendance.find(a => a.date === todayStr)
  const handleAttendanceClick = () => {
    toggleAttendance(user._id)
    reloadData()
  }
  const handleApplyLeave = (e) => {
    e.preventDefault()
    setFormSuccess('')
    setFormError('')
    if (!startDate || !endDate || !reason) {
      setFormError('Please fill in all fields.')
      return
    }
    if (new Date(startDate) > new Date(endDate)) {
      setFormError('Start date cannot be after end date.')
      return
    }
    try {
      applyForLeave(user._id, { type: leaveType, startDate, endDate, reason })
      setFormSuccess('Leave application submitted successfully!')
      setStartDate('')
      setEndDate('')
      setReason('')
      reloadData()
    } catch (err) {
      setFormError(err.message || 'Failed to apply.')
    }
  }
  const netSalary = empProfile.basicSalary + empProfile.allowances - empProfile.deductions
  return (
    <div className="space-y-8 animate-fade-in text-slate-100">

      {/* Page Welcome */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-outfit">
          Welcome back, <span className="text-violet-400">{empProfile.firstName}</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Access your payroll data, submit time-off requests, and track your daily attendance check-ins.
        </p>
      </div>
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Columns - Actions & Information */}
        <div className="lg:col-span-2 space-y-8">

          {/* Attendance Checker Card */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 translate-x-4 -translate-y-4 rounded-full bg-violet-600/5"></div>

            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-outfit">
              <Clock className="h-5 w-5 text-violet-400" />
              Daily Time Clock
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900/35 border border-slate-800/80 p-5 rounded-xl">
              <div className="space-y-1 text-center sm:text-left">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Today's Status</div>
                <div className="text-lg font-bold text-slate-200 mt-1 font-outfit">
                  {todayRecord ? (
                    todayRecord.checkOut ? (
                      <span className="text-slate-400">Checked Out (Completed)</span>
                    ) : (
                      <span className="text-emerald-400">Checked In (In Progress)</span>
                    )
                  ) : (
                    <span className="text-amber-400">Not Clocked In Yet</span>
                  )}
                </div>
                {todayRecord && (
                  <div className="text-xs text-slate-500 font-mono mt-1 space-y-0.5">
                    <div>Check-In: {new Date(todayRecord.checkIn).toLocaleTimeString()}</div>
                    {todayRecord.checkOut && (
                      <>
                        <div>Check-Out: {new Date(todayRecord.checkOut).toLocaleTimeString()}</div>
                        <div className="text-violet-400 font-semibold">Total Hours: {todayRecord.workingHours} hrs</div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button
                onClick={handleAttendanceClick}
                disabled={todayRecord && todayRecord.checkOut}
                className={`py-3.5 px-6 font-bold rounded-xl text-sm transition-all duration-300 transform active:scale-95 cursor-pointer flex items-center gap-2 ${todayRecord
                    ? todayRecord.checkOut
                      ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20 border border-rose-500/20'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20'
                  }`}
              >
                {todayRecord ? (
                  todayRecord.checkOut ? 'Day Finished' : 'Clock Out'
                ) : 'Clock In Now'}
              </button>
            </div>
          </div>
          {/* Attendance Log Table */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-outfit">
              <Calendar className="h-5 w-5 text-violet-400" />
              Recent Attendance History
            </h2>

            {myAttendance.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No attendance logs found. Clock in to create your first entry.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Check-In</th>
                      <th className="py-2.5 px-3">Check-Out</th>
                      <th className="py-2.5 px-3">Hours</th>
                      <th className="py-2.5 px-3 text-right">Classification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {myAttendance.map(record => (
                      <tr key={record._id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-300">{record.date}</td>
                        <td className="py-3 px-3 font-mono text-slate-400">
                          {new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-400">
                          {record.checkOut
                            ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : '—'}
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-mono">
                          {record.workingHours !== null ? `${record.workingHours} hrs` : '—'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${record.dayType === 'Full Day'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : record.dayType === 'Half Day'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            }`}>
                            {record.dayType}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* Leaves Tracking */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-outfit">
              <CalendarDays className="h-5 w-5 text-violet-400" />
              Time-Off History & Applications
            </h2>
            {myLeaves.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No leave requests filed yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Start Date</th>
                      <th className="py-2.5 px-3">End Date</th>
                      <th className="py-2.5 px-3">Reason</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {myLeaves.map(leave => (
                      <tr key={leave._id} className="hover:bg-slate-900/10 transition-colors">
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 uppercase">
                            {leave.type}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{leave.startDate}</td>
                        <td className="py-3 px-3 text-slate-300">{leave.endDate}</td>
                        <td className="py-3 px-3 text-slate-400 max-w-[150px] truncate" title={leave.reason}>
                          {leave.reason}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${leave.status === 'APPROVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : leave.status === 'REJECTED'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>
                            {leave.status === 'APPROVED' && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                            {leave.status === 'REJECTED' && <XCircle className="h-3 w-3 shrink-0" />}
                            {leave.status === 'PENDING' && <AlertCircle className="h-3 w-3 shrink-0" />}
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        {/* Right Column - Profile and Action Panel */}
        <div className="space-y-8">

          {/* Profile Card Summary */}
          <div className="glass-panel p-6 rounded-2xl space-y-5 text-center sm:text-left">
            <h2 className="text-lg font-bold text-white mb-2 font-outfit text-left">
              Employment Profile
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-850 pb-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xl">
                {`${empProfile.firstName[0]}${empProfile.lastName[0]}`.toUpperCase()}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-white">{empProfile.firstName} {empProfile.lastName}</h3>
                <p className="text-xs text-violet-400 font-medium">{empProfile.position}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{empProfile.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-left">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Department</span>
                <span className="font-semibold text-slate-200">{empProfile.department}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase">Join Date</span>
                <span className="font-semibold text-slate-200">{empProfile.joinDate}</span>
              </div>
            </div>
            {/* Salary Panel */}
            <div className="mt-4 border-t border-slate-850 pt-4 text-left">
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 space-y-2.5">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500">
                  <span>Payroll Structure</span>
                  <span className="text-violet-400 font-mono">Monthly</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Base Salary</span>
                    <span className="text-slate-300 font-mono">${empProfile.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Allowances</span>
                    <span className="text-emerald-400 font-mono">+${empProfile.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deductions</span>
                    <span className="text-rose-400 font-mono">-${empProfile.deductions.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-white border-t border-slate-800 pt-2.5 mt-1">
                  <span>Net Estimated Monthly Pay</span>
                  <span className="font-black font-outfit text-base font-mono text-white">
                    ${netSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Leave Application Request Form */}
          <div className="glass-panel p-6 rounded-2xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-outfit">
              <Send className="h-5 w-5 text-violet-400" />
              Apply for Leave
            </h2>
            {formSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}
            {formError && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
            <form onSubmit={handleApplyLeave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Leave Classification</label>
                <select
                  className="custom-input cursor-pointer py-2 px-3 text-xs"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                >
                  <option value="CASUAL" className="bg-slate-950 text-slate-100">Casual Leave</option>
                  <option value="SICK" className="bg-slate-950 text-slate-100">Sick Leave</option>
                  <option value="ANNUAL" className="bg-slate-950 text-slate-100">Annual Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Start Date</label>
                  <input
                    type="date"
                    className="custom-input py-2 px-3 text-xs"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">End Date</label>
                  <input
                    type="date"
                    className="custom-input py-2 px-3 text-xs"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Reason for Request</label>
                <textarea
                  placeholder="Provide details about your leave request..."
                  className="custom-input py-2.5 px-3 text-xs h-20 min-h-16 resize-y"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs transition-all duration-300 transform active:scale-95 shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 border border-violet-400/20 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Submit Request <Send className="h-3 w-3" />
              </button>
            </form>
          </div>
          {/* Payslip Records */}
          {myPayslips.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-outfit">
                <FileSpreadsheet className="h-5 w-5 text-violet-400" />
                Payslip Records
              </h2>
              <div className="space-y-3">
                {myPayslips.map(pay => (
                  <div key={pay._id} className="flex justify-between items-center bg-slate-900/35 border border-slate-800/80 p-3 rounded-xl">
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        {new Date(pay.year, pay.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Computed on {new Date(pay.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400 font-mono">
                        ${pay.netSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Processed</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default EmployeeDashboard;