import { CalendarDays, FileText, Loader2, Send, X } from 'lucide-react';
import React, { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import "react-day-picker/style.css"
import api from '../../api/axios';
import toast from 'react-hot-toast';

const LEAVE_TYPE_OPTIONS = [
    {value: "SICK", label: "Sick"},
    {value: "CASUAL", label: "Paid"},
    {value: "ANNUAL", label: "Unpaid"},
]

const ApplyLeaveModal = ({open, onClose, onSuccess}) => {

    const [loading, setLoading] = useState(false);
    const [type, setType] = useState("SICK")
    const [reason, setReason] = useState("")
    const [range, setRange] = useState(undefined)

    const today = new Date();
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!range?.from || !range?.to){
            toast.error("Please select a leave date range")
            return
        }
        setLoading(true)

        try {
            await api.post('/leave', {
                type,
                reason,
                startDate: range.from.toISOString(),
                endDate: range.to.toISOString(),
            })
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || err?.message)
        }finally{
            setLoading(false)
        }
    }

    if(!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60' onClick={onClose}>

        <div className='relative bg-[#121212] border-2 border-indigo-600 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in' onClick={(e)=>e.stopPropagation()}>
            {/* ----- Header------*/}
            <div className='flex items-center justify-between p-6 pb-0'>
                <div>
                    <h2 className='text-base font-semibold text-slate-900'>Apply for Leave</h2>
                    <p className='text-sm text-slate-400 mt-2'>Submit your leave request for approval</p>
                </div>
                <button onClick={onClose} className='p-2 hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600'>
                     <X className="w-5 h-5" />
                </button>
            </div>

            {/* --------Form-------- */}
            <form onSubmit={handleSubmit} className='p-6 space-y-5'>
                 {/* --- leave type ---- */}
                 <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-slate-700 mb-2'>
                        <FileText className="w-4 h-4 text-slate-400"/>
                        Leave Type
                    </label>
                    <select name="type" value={type} onChange={(e)=> setType(e.target.value)} required>
                        {LEAVE_TYPE_OPTIONS.map((opt)=>(
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                 </div>

                 {/* -- duration ------ */}
                 <div>
                    <label className='flex items-center gap-2 text-sm font-medium text-slate-700 mb-2'>
                        <CalendarDays className="w-4 h-4 text-slate-400"/>
                        Duration
                    </label>
                    <div className='flex justify-center border-2 border-slate-700'>
                        <DayPicker
                            className="pixel-daypicker"
                            mode="range"
                            selected={range}
                            onSelect={setRange}
                            disabled={{ before: tomorrow }}
                            numberOfMonths={1}
                        />
                    </div>
                    {range?.from && (
                        <p className='text-xs text-slate-400 mt-2'>
                            {range.from.toLocaleDateString()} {range.to ? `- ${range.to.toLocaleDateString()}` : ""}
                        </p>
                    )}
                 </div>

                 {/*------ reason ------ */}
                 <div>
                     <label className='text-sm font-medium text-slate-700 mb-2 block'>
                        Reason
                    </label>
                    <textarea value={reason} onChange={(e)=> setReason(e.target.value)} required rows={3} className="resize-none" placeholder="Briefly describe why you need this leave..." />
                 </div>

                 {/*------ buttons ------ */}
                 <div className="flex gap-3 pt-2">
                    <button onClick={onClose} type='button' className="btn-secondary flex-1">
                         Cancel
                    </button>

                    <button disabled={loading} type='submit' className="btn-primary flex-1 flex items-center justify-center gap-2">
                         {loading ? <Loader2 className='w-4 h-4 animate-spin'/> : <Send className="w-4 h-4"/>}
                         {loading ? "Submitting..." : "Submit"}
                    </button>
                 </div>
            </form>

        </div>
    </div>
  )
}

export default ApplyLeaveModal
