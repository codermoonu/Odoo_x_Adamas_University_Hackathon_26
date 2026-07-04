import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import Attendance from "./pages/Attendance"
import Leave from "./pages/Leave"
import Payslips from "./pages/Payslips"
import Settings from "./pages/Settings"
import PrintPayslip from "./pages/PrintPayslip"
import LoginForm from "./components/LoginForm"

const App = () => {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/login" element={ <LoginForm/> }/>

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />}/>
          <Route path="/attendance" element={<Attendance />}/>
          <Route path="/leave" element={<Leave />}/>
          <Route path="/payslips" element={<Payslips />}/>
          <Route path="/settings" element={<Settings />}/>
        </Route>
        <Route path="/print/payslips/:id" element={ <PrintPayslip/> }/>

        <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
      </Routes>
    </>
  )
}

export default App