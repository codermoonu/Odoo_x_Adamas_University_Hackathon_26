import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Briefcase, User, Mail, Shield, Landmark, Percent, Calendar, Phone, AlertCircle, ArrowRight, Copy, Check } from 'lucide-react'
import { createUserByAdmin } from '../utils/mockDb.js'

const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "IT Support",
  "Customer Success",
  "Product Management",
  "Design"
];

const SUGGESTED_POSITIONS = {
  "Engineering": ["Junior Developer", "Software Developer", "Senior Developer", "Tech Lead", "QA Engineer"],
  "Human Resources": ["HR Recruiter", "HR Generalist", "HR Manager", "Compensation Specialist"],
  "Marketing": ["Marketing Analyst", "SEO Specialist", "Marketing Coordinator", "Marketing Manager"],
  "Sales": ["Sales Associate", "Account Executive", "Sales Manager", "Sales Operations Analyst"],
  "Finance": ["Financial Analyst", "Accountant", "Finance Manager", "Controller"],
  "Operations": ["Operations Associate", "Operations Coordinator", "Operations Manager"],
  "IT Support": ["Helpdesk Support", "Associate Business Support", "System Administrator", "Network Engineer"],
  "Customer Success": ["Customer Specialist", "Success Manager", "Support Lead"],
  "Product Management": ["Associate Product Manager", "Product Manager", "Senior Product Manager"],
  "Design": ["UI/UX Designer", "Product Designer", "Visual Designer", "Creative Lead"]
};

function Signup({ onLogin, currentUser }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is logged in and has admin role
  const isAdminAccess = currentUser?.role === "ADMIN";

  // Redirect to login if not admin
  React.useEffect(() => {
    if (location.pathname === '/signup' && !isAdminAccess) {
      navigate('/login');
    }
  }, [isAdminAccess, location.pathname, navigate]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [position, setPosition] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [allowances, setAllowances] = useState('');
  const [deductions, setDeductions] = useState('');
  const [joinDate, setJoinDate] = useState(new Date().toISOString().split('T')[0]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!firstName || !lastName || !email) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!position) {
      setError('Please enter the employee position.');
      return;
    }

    if (!basicSalary || Number(basicSalary) <= 0) {
      setError('Please enter a valid Basic Salary.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        const newUser = createUserByAdmin({
          firstName,
          lastName,
          email,
          phone,
          department,
          position,
          basicSalary: Number(basicSalary),
          allowances: Number(allowances) || 0,
          deductions: Number(deductions) || 0,
          joinDate
        });

        setCreatedUser(newUser);
        setSuccess(true);
        // Reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setDepartment(DEPARTMENTS[0]);
        setPosition('');
        setBasicSalary('');
        setAllowances('');
        setDeductions('');
        setJoinDate(new Date().toISOString().split('T')[0]);
      } catch (err) {
        setError(err.message || 'Failed to create user. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If not admin, show access denied message
  if (!isAdminAccess && location.pathname === '/signup') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#090d16]">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-[440px] animate-slide-up">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="p-3 bg-rose-600/20 rounded-2xl border border-rose-500/30 shadow-lg shadow-rose-500/15 mb-4">
              <AlertCircle className="h-8 w-8 text-rose-400" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white font-outfit">
              Quick<span className="text-violet-400">EMS</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1.5 font-inter">
              Access Denied
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl relative text-center">
            <p className="text-slate-300 mb-6">
              Only HR Administrators can add new employees. Please log in with an Admin account.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all duration-300"
            >
              Go to Login <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#090d16]">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[680px] animate-slide-up">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="p-3 bg-violet-600/20 rounded-2xl border border-violet-500/30 shadow-lg shadow-violet-500/15 mb-3">
            <Briefcase className="h-7 w-7 text-violet-400" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white font-outfit">
            Quick<span className="text-violet-400">EMS</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-inter">
            Add New Employee
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 rounded-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none rounded-2xl"></div>

          <h2 className="text-xl font-semibold text-slate-100 mb-1 font-outfit">
            Create Employee Account
          </h2>
          <p className="text-slate-400 text-xs mb-6">
            Login credentials will be auto-generated. Employee will receive their Login ID and temporary password.
          </p>

          {/* Success Message */}
          {success && createdUser && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-fade-in">
              <h3 className="text-emerald-300 font-semibold mb-4">✓ Employee Account Created Successfully!</h3>
              
              <div className="space-y-3 text-sm">
                {/* Employee Info */}
                <div className="bg-slate-900/40 p-3 rounded-lg">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Employee Details</p>
                  <p className="text-slate-100"><span className="font-semibold">Name:</span> {createdUser.firstName} {createdUser.lastName}</p>
                  <p className="text-slate-100"><span className="font-semibold">Email:</span> {createdUser.email}</p>
                </div>

                {/* Login Credentials */}
                <div className="bg-slate-900/40 p-3 rounded-lg">
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Login Credentials</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Login ID</p>
                        <p className="text-slate-100 font-mono font-bold text-sm">{createdUser.loginId}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(createdUser.loginId)}
                        className="p-2 hover:bg-slate-900 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">Temporary Password</p>
                        <p className="text-slate-100 font-mono font-bold text-sm">{createdUser.tempPassword}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(createdUser.tempPassword)}
                        className="p-2 hover:bg-slate-900 rounded transition-colors"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2">
                    ℹ Employee must change this password on first login.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSuccess(false)}
                className="w-full mt-4 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg text-sm transition-all"
              >
                Add Another Employee
              </button>
            </div>
          )}

          {error && !success && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Employee Personal Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">
                  Personal Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">First Name <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      placeholder="John"
                      className="custom-input"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Last Name <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="custom-input"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email Address <span className="text-rose-400">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        placeholder="john.doe@company.com"
                        className="custom-input pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                      <input
                        type="tel"
                        placeholder="9876543210"
                        className="custom-input pl-10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">
                  Employment Profile
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Department <span className="text-rose-400">*</span></label>
                    <select
                      className="custom-input cursor-pointer"
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        setPosition('');
                      }}
                      disabled={loading}
                    >
                      {DEPARTMENTS.map(dept => (
                        <option key={dept} value={dept} className="bg-slate-950 text-slate-100">{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Position / Job Title <span className="text-rose-400">*</span></label>
                    <input
                      type="text"
                      list="positions"
                      placeholder="e.g. Software Engineer"
                      className="custom-input"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      disabled={loading}
                    />
                    <datalist id="positions">
                      {SUGGESTED_POSITIONS[department]?.map(pos => (
                        <option key={pos} value={pos} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    Join Date <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  </label>
                  <input
                    type="date"
                    className="custom-input"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-[10px] text-slate-500">
                    Login ID will be generated based on this date
                  </p>
                </div>
              </div>

              {/* Salary Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-widest border-b border-slate-800/80 pb-2">
                  Salary Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      Basic Salary <Landmark className="h-3 w-3 text-slate-500" /> <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 3000"
                      className="custom-input"
                      value={basicSalary}
                      onChange={(e) => setBasicSalary(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      Allowances <Percent className="h-3 w-3 text-slate-500" />
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 400"
                      className="custom-input"
                      value={allowances}
                      onChange={(e) => setAllowances(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      Deductions <Percent className="h-3 w-3 text-slate-500" />
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 100"
                      className="custom-input"
                      value={deductions}
                      onChange={(e) => setDeductions(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl text-sm transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-violet-500/20 hover:shadow-violet-500/35 border border-violet-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Employee Account <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-slate-500">
            <p>❓ Questions about employee creation?</p>
            <p className="mt-1">Contact your system administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;