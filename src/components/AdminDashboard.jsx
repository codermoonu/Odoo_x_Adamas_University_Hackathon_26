import React, { useState, useEffect } from 'react'
import { Users, FolderTree, CalendarCheck, FileSpreadsheet, Search, Phone, Mail, User, Info, Check, X, ShieldAlert } from 'lucide-react'
import { getDb, updateLeaveStatus } from '../utils/mockDb.js'

function AdminDashboard({ user }) {
  const [data, setData] = useState({ employees: [], leaves: [], attendance: [], users: [] })
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('ALL')
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  // Reload data from local database
  const reloadData = () => {
    setData(getDb())
  }

  useEffect(() => {
    reloadData()
  }, [])

  // Handle Leave Status Update
  const handleLeaveAction = (leaveId, action) => {
    updateLeaveStatus(leaveId, action)
    reloadData()
  }

  // Calculated Stats
  const totalEmployees = data.employees.length
  const totalDepts = new Set(data.employees.map(e => e.department)).size

  const todayStr = new Date().toISOString().split('T')[0]
  const todayAttendance = data.attendance.filter(a => a.date === todayStr && a.status === 'PRESENT').length
  const pendingLeaves = data.leaves.filter(l => l.status === 'PENDING').length

  // Filters
  const filteredEmployees = data.employees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase())

    const matchesDept = deptFilter === 'ALL' || emp.department === deptFilter

    return matchesSearch && matchesDept
  })

  // Departments List for filtering
  const departments = ['ALL', ...new Set(data.employees.map(e => e.department))]

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">

      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-outfit">
            Admin <span className="text-violet-400">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Overview of company operations, staff details, and pending approvals.
          </p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1 */}
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 translate-x-4 -translate-y-4 rounded-full bg-violet-600/5"></div>
          <div className="p-3.5 bg-violet-600/20 border border-violet-500/30 rounded-xl text-violet-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Staff</div>
            <div className="text-3xl font-black text-white mt-1 font-outfit">{totalEmployees}</div>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 translate-x-4 -translate-y-4 rounded-full bg-indigo-600/5"></div>
          <div className="p-3.5 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
            <FolderTree className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Departments</div>
            <div className="text-3xl font-black text-white mt-1 font-outfit">{totalDepts}</div>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 translate-x-4 -translate-y-4 rounded-full bg-emerald-600/5"></div>
          <div className="p-3.5 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-emerald-400">
            <CalendarCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Checked In Today</div>
            <div className="text-3xl font-black text-white mt-1 font-outfit">{todayAttendance}</div>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 translate-x-4 -translate-y-4 rounded-full bg-amber-600/5"></div>
          <div className="p-3.5 bg-amber-600/20 border border-amber-500/30 rounded-xl text-amber-400">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pending Leaves</div>
            <div className="text-3xl font-black text-white mt-1 font-outfit">
              {pendingLeaves > 0 ? (
                <span className="text-amber-400">{pendingLeaves}</span>
              ) : (
                pendingLeaves
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Leave Management Section */}
      {data.leaves.some(l => l.status === 'PENDING') && (
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/10">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 font-outfit">
            <ShieldAlert className="h-5 w-5 text-amber-400" />
            Pending Leave Approvals
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-xs">
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.leaves
                  .filter(l => l.status === 'PENDING')
                  .map(leave => {
                    const employee = data.employees.find(e => e._id === leave.employeeId) || {
                      firstName: 'Unknown',
                      lastName: 'Employee',
                      department: '—'
                    }
                    return (
                      <tr key={leave._id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="py-3.5 px-4">
                          <div>
                            <div className="font-semibold text-slate-200">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-[10px] text-slate-500">{employee.department}</div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/10 text-violet-400 uppercase border border-violet-500/20">
                            {leave.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {leave.startDate} to {leave.endDate}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 max-w-[200px] truncate" title={leave.reason}>
                          {leave.reason}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleLeaveAction(leave._id, 'APPROVED')}
                              className="p-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 transition-all cursor-pointer"
                              title="Approve Leave"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleLeaveAction(leave._id, 'REJECTED')}
                              className="p-1.5 rounded-lg bg-rose-600/15 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 transition-all cursor-pointer"
                              title="Reject Leave"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Staff List Header & Search Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-white font-outfit">
            Employee Directory ({filteredEmployees.length})
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search name, position..."
                className="custom-input pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Department Filter */}
            <select
              className="custom-input cursor-pointer sm:w-48"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept} className="bg-slate-950 text-slate-100">
                  {dept === 'ALL' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Staff Grid */}
        {filteredEmployees.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center">
            <Info className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <div className="text-lg font-semibold text-slate-300">No employees found</div>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search criteria or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(emp => {
              const netSalary = emp.basicSalary + emp.allowances - emp.deductions
              const initials = `${emp.firstName[0] || ''}${emp.lastName[0] || ''}`.toUpperCase()

              return (
                <div
                  key={emp._id}
                  onClick={() => setSelectedEmployee(emp)}
                  className="glass-panel p-6 rounded-2xl glass-panel-hover flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-violet-500/20">
                          {initials}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-200 group-hover:text-violet-400 transition-colors">
                            {emp.firstName} {emp.lastName}
                          </h3>
                          <p className="text-xs text-slate-400">{emp.position}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                        {emp.employmentStatus}
                      </span>
                    </div>

                    {/* Meta Fields */}
                    <div className="space-y-2 border-t border-slate-800/80 pt-4 text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <FolderTree className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>Department: <strong className="text-slate-300">{emp.department}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{emp.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        <span>{emp.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial calculations */}
                  <div className="mt-5 border-t border-slate-800/60 pt-4 flex justify-between items-center bg-slate-900/20 p-2.5 rounded-xl border border-slate-800/30">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Net Monthly Pay</div>
                      <div className="text-lg font-black text-white font-outfit mt-0.5">
                        ${netSalary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className="text-[10px] text-right text-slate-400 space-y-0.5 font-mono">
                      <div>Base: ${emp.basicSalary}</div>
                      <div className="text-emerald-400">All: +${emp.allowances}</div>
                      <div className="text-rose-400">Ded: -${emp.deductions}</div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Modal Component */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-[540px] rounded-2xl relative overflow-hidden animate-slide-up shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>

            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-[#0e1422]/60">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-lg">
                  {`${selectedEmployee.firstName[0]}${selectedEmployee.lastName[0]}`.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white font-outfit">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h3>
                  <p className="text-xs text-violet-400">{selectedEmployee.position}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Profile Details Grid */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">
                  Profile Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Department</span>
                    <span className="font-semibold text-slate-200">{selectedEmployee.department}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Join Date</span>
                    <span className="font-semibold text-slate-200">{selectedEmployee.joinDate}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Email Address</span>
                    <span className="font-semibold text-slate-200 truncate block">{selectedEmployee.email}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-500">Phone Number</span>
                    <span className="font-semibold text-slate-200">{selectedEmployee.phone}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {selectedEmployee.bio && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">
                    Professional Biography
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed italic">
                    "{selectedEmployee.bio}"
                  </p>
                </div>
              )}

              {/* Salary Breakdown Details */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">
                  Salary Structure Details
                </h4>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Basic Base Salary</span>
                    <span className="font-semibold font-mono text-slate-200">${selectedEmployee.basicSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Performance & Housing Allowances</span>
                    <span className="font-semibold font-mono text-emerald-400">+${selectedEmployee.allowances.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Statutory Tax & Insurance Deductions</span>
                    <span className="font-semibold font-mono text-rose-400">-${selectedEmployee.deductions.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm border-t border-slate-800 pt-3 mt-1.5 font-semibold text-white">
                    <span>Computed Net Pay</span>
                    <span className="font-black font-outfit text-lg font-mono text-white">
                      ${(selectedEmployee.basicSalary + selectedEmployee.allowances - selectedEmployee.deductions).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard;
