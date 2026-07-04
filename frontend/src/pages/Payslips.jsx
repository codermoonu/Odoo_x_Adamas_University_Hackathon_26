import { useCallback, useEffect, useState } from "react"
import Loading from "../components/Loading";
import PayslipList from "../components/payslip/PayslipList";
import SalaryStructure from "../components/payslip/SalaryStructure";
import api from "../api/axios";
import toast from "react-hot-toast";

const TABS = ["Payslip History", "Salary Information"]

const Payslips = () => {
  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Payslip History")

  const fetchPayslips = useCallback(async ()=>{
    try {
      const res = await api.get('/payslips')
      setPayslips(res.data.data || [])
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
    }finally{
      setLoading(false)
    }
  },[])

  useEffect(()=>{
    fetchPayslips()
  },[fetchPayslips])

  if(loading) return <Loading />

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="page-title text-orange-100">Payslips</h1>
          <p className="page-subtitle">Your payslip history and salary structure</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab)=>(
          <button key={tab} type="button" onClick={()=> setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium border-2 ${activeTab === tab ? "bg-indigo-600 border-indigo-600 text-slate-950" : "border-slate-700 text-slate-500 hover:border-indigo-500 hover:text-indigo-400"}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Payslip History" && <PayslipList payslips={payslips}/>}
      {activeTab === "Salary Information" && <SalaryStructure/>}
    </div>
  )
}

export default Payslips
