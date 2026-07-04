import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from "react-router-dom"
import Landing from "./pages/Landing"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import Attendance from "./pages/Attendance"
import Leave from "./pages/Leave"
import Payslips from "./pages/Payslips"
import Settings from "./pages/Settings"
import PrintPayslip from "./pages/PrintPayslip"
import LoginForm from "./components/LoginForm"
import ChangePassword from "./pages/ChangePassword"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminEmployees from "./pages/admin/AdminEmployees"
import AdminAttendance from "./pages/admin/AdminAttendance"
import AdminLeave from "./pages/admin/AdminLeave"

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={ <Landing/> }/>
        <Route path="/login" element={ <LoginForm/> }/>
        <Route path="/change-password" element={ <ChangePassword/> }/>

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/attendance" element={<Attendance />}/>
          <Route path="/leave" element={<Leave />}/>
          <Route path="/payslips" element={<Payslips />}/>
          <Route path="/settings" element={<Settings />}/>
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />}/>
          <Route path="/admin/employees" element={<AdminEmployees />}/>
          <Route path="/admin/attendance" element={<AdminAttendance />}/>
          <Route path="/admin/leave" element={<AdminLeave />}/>
        </Route>

        <Route path="/print/payslips/:id" element={ <PrintPayslip/> }/>

        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </>
  )
}

export default App
