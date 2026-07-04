import { useCallback, useEffect, useState } from "react"
import { format } from "date-fns"
import { Loader2Icon, PlusIcon, X } from "lucide-react"
import Loading from "../../components/Loading"
import api from "../../api/axios"
import toast from "react-hot-toast"

const ROLE_OPTIONS = [
    { value: "EMPLOYEE", label: "Employee" },
    { value: "HR", label: "HR Officer" },
    { value: "ADMIN", label: "Admin" },
]

const EMPTY_FORM = {
    firstName: "", lastName: "", email: "", phone: "",
    department: "", position: "", basicSalary: "", allowances: "",
    deductions: "", joinDate: "", role: "EMPLOYEE"
}

const AddEmployeeModal = ({ open, onClose, onSuccess }) => {
    const [form, setForm] = useState(EMPTY_FORM)
    const [loading, setLoading] = useState(false)
    const [created, setCreated] = useState(null)

    const update = (field) => (e) => setForm((prev)=> ({...prev, [field]: e.target.value}))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const { data } = await api.post('/auth/create-employee', {
                ...form,
                basicSalary: Number(form.basicSalary),
                allowances: Number(form.allowances || 0),
                deductions: Number(form.deductions || 0),
            })
            setCreated(data.data)
            onSuccess()
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setForm(EMPTY_FORM)
        setCreated(null)
        onClose()
    }

    if (!open) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60' onClick={handleClose}>
            <div className='relative bg-[#121212] border-2 border-indigo-600 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in' onClick={(e)=>e.stopPropagation()}>
                <div className='flex items-center justify-between p-6 pb-0'>
                    <h2 className='text-base font-semibold text-slate-900'>Add Employee</h2>
                    <button onClick={handleClose} className='p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600'>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {created ? (
                    <div className='p-6 space-y-4'>
                        <div className='p-4 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 text-sm'>
                            Account created for {created.firstName} {created.lastName}. Share these credentials — the employee must change the password on first login.
                        </div>
                        <div>
                            <p className='text-xs text-slate-500 mb-1'>Login ID</p>
                            <p className='font-mono text-lg text-slate-900'>{created.loginId}</p>
                        </div>
                        <div>
                            <p className='text-xs text-slate-500 mb-1'>Temporary Password</p>
                            <p className='font-mono text-lg text-slate-900'>{created.tempPassword}</p>
                        </div>
                        <button type='button' onClick={handleClose} className='btn-primary w-full'>Done</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className='p-6 space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='text-xs font-medium text-slate-700 mb-1 block'>First Name</label>
                                <input value={form.firstName} onChange={update("firstName")} required/>
                            </div>
                            <div>
                                <label className='text-xs font-medium text-slate-700 mb-1 block'>Last Name</label>
                                <input value={form.lastName} onChange={update("lastName")} required/>
                            </div>
                        </div>

                        <div>
                            <label className='text-xs font-medium text-slate-700 mb-1 block'>Email</label>
                            <input type='email' value={form.email} onChange={update("email")} required/>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='text-xs font-medium text-slate-700 mb-1 block'>Phone</label>
                                <input value={form.phone} onChange={update("phone")}/>
                            </div>
                            <div>
                                <label className='text-xs font-medium text-slate-700 mb-1 block'>Role</label>
                                <select value={form.role} onChange={update("role")}>
                                    {ROLE_OPTIONS.map((r)=> <option key={r.value} value={r.value}>{r.label}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='text-xs font-medium text-slate-700 mb-1 block'>Department</label>
                                <input value={form.department} onChange={update("department")}/>
                            </div>
                            <div>
                                <label className='text-xs font-medium text-slate-700 mb-1 block'>Position</label>
                                <input value={form.position} onChange={update("position")} required/>
                            </div>
                        </div>

                        <div className='grid grid-cols-3 gap-4'>
                            <div>
                                <label className='text-xs font-medium text-slate-700 mb-1 block'>Basic Salary</label>
                                <input type='number' value={form.basicSalary} onChange={update("basicSalary")} required/>
                            </div>
                            <div>
                                <label className='text-xs font-medium text-slate-700 mb-1 block'>Allowances</label>
                                <input type='number' value={form.allowances} onChange={update("allowances")}/>
                            </div>
                            <div>
                                <label className='text-xs font-medium text-slate-700 mb-1 block'>Deductions</label>
                                <input type='number' value={form.deductions} onChange={update("deductions")}/>
                            </div>
                        </div>

                        <div>
                            <label className='text-xs font-medium text-slate-700 mb-1 block'>Join Date</label>
                            <input type='date' value={form.joinDate} onChange={update("joinDate")}/>
                        </div>

                        <div className='flex gap-3 pt-2'>
                            <button type='button' onClick={handleClose} className='btn-secondary flex-1'>Cancel</button>
                            <button type='submit' disabled={loading} className='btn-primary flex-1 flex items-center justify-center gap-2'>
                                {loading && <Loader2Icon className='w-4 h-4 animate-spin'/>}
                                Create Account
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

const AdminEmployees = () => {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)

    const fetchEmployees = useCallback(async () => {
        try {
            const { data } = await api.get('/employees')
            setEmployees(data.data || [])
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(()=>{ fetchEmployees() }, [fetchEmployees])

    if (loading) return <Loading />

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="page-title text-orange-100">Employees</h1>
                    <p className="page-subtitle">Manage employee, HR and admin accounts</p>
                </div>
                <button onClick={()=> setShowModal(true)} className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
                    <PlusIcon className="w-4 h-4" /> Add Employee
                </button>
            </div>

            <div className='card overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='table-modern'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Position</th>
                                <th>Join Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-12 text-slate-400">No employees found</td></tr>
                            ) : (
                                employees.map((emp)=>(
                                    <tr key={emp._id}>
                                        <td className='font-medium text-slate-800'>{emp.firstName} {emp.lastName}</td>
                                        <td className='text-slate-500'>{emp.email}</td>
                                        <td className='text-slate-500'>{emp.department || "-"}</td>
                                        <td className='text-slate-500'>{emp.position}</td>
                                        <td className='text-slate-500'>{emp.joinDate ? format(new Date(emp.joinDate), "MMM dd, yyyy") : "-"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddEmployeeModal open={showModal} onClose={()=> setShowModal(false)} onSuccess={fetchEmployees}/>
        </div>
    )
}

export default AdminEmployees
