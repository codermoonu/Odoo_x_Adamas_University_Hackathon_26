import { format } from 'date-fns'
import { Download } from 'lucide-react'
import React from 'react'

const PayslipList = ({payslips}) => {
  return (
    <div className='card overflow-hidden'>
        <div className="overflow-x-auto">
            <table className="table-modern">
                <thead>
                    <tr>
                        <th>Period</th>
                        <th>Basic Salary</th>
                        <th>Net Salary</th>
                        <th className='text-center'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payslips.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-12 text-slate-400">
                                No payslips found
                            </td>
                        </tr>
                    ) : (
                        payslips.map((payslip)=>{
                            return (
                                <tr key={payslip._id || payslip.id}>
                                    <td className='text-slate-500'>
                                        {format(new Date(payslip.year, payslip.month - 1), "MMMM yyyy")}
                                    </td>

                                    <td className='text-slate-500'>
                                        ${payslip.basicSalary?.toLocaleString()}
                                    </td>

                                    <td className='font-medium text-slate-800'>
                                        ${payslip.netSalary?.toLocaleString()}
                                    </td>

                                    <td className='text-center'>
                                       <button
                                       onClick={()=> window.open(`/print/payslips/${payslip._id || payslip.id}`)}
                                       className='inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-600 hover:text-slate-950 transition-colors'>
                                        <Download className="w-3 h-3 mr-1.5" /> Download
                                       </button>
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

export default PayslipList
