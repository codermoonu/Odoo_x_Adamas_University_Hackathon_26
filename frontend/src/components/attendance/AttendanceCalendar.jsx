import React, { useMemo, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameMonth, isToday, startOfMonth, subMonths } from 'date-fns'

const AttendanceCalendar = ({history}) => {
    const [month, setMonth] = useState(new Date())

    const recordByDay = useMemo(()=>{
        const map = new Map()
        history.forEach((record)=>{
            map.set(format(new Date(record.date), "yyyy-MM-dd"), record)
        })
        return map
    },[history])

    const days = useMemo(()=>{
        const start = startOfMonth(month)
        const end = endOfMonth(month)
        return eachDayOfInterval({start, end})
    },[month])

    const leadingBlanks = Array.from({length: startOfMonth(month).getDay()})

    const getStatus = (day) => {
        const record = recordByDay.get(format(day, "yyyy-MM-dd"))
        if(!record) return day > new Date() ? "future" : "absent"
        if(record.status === "PRESENT" || record.status === "LATE") return "present"
        return "absent"
    }

    return (
        <div className='card p-5 sm:p-6 mb-8'>
            <div className='flex items-center justify-between mb-5'>
                <h3 className='font-semibold text-slate-900 text-sm'>{format(month, "MMMM yyyy")}</h3>
                <div className='flex items-center gap-1'>
                    <button onClick={()=> setMonth((m)=> subMonths(m, 1))} className='p-1.5 border-2 border-slate-700 hover:border-indigo-500 text-slate-400 hover:text-indigo-400'>
                        <ChevronLeftIcon className='w-4 h-4'/>
                    </button>
                    <button onClick={()=> setMonth((m)=> addMonths(m, 1))} className='p-1.5 border-2 border-slate-700 hover:border-indigo-500 text-slate-400 hover:text-indigo-400'>
                        <ChevronRightIcon className='w-4 h-4'/>
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-7 gap-1.5 text-center text-[11px] text-slate-500 uppercase tracking-wide mb-2'>
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d)=>(
                    <div key={d}>{d}</div>
                ))}
            </div>

            <div className='grid grid-cols-7 gap-1.5'>
                {leadingBlanks.map((_, i)=>(
                    <div key={`blank-${i}`}/>
                ))}
                {days.map((day)=>{
                    const status = getStatus(day)
                    const statusClass = status === "present"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-500"
                        : status === "absent"
                        ? "bg-rose-50 text-rose-700 border-rose-500"
                        : "bg-slate-50 text-slate-500 border-slate-700"
                    return (
                        <div key={day.toISOString()}
                        className={`aspect-square flex items-center justify-center text-xs border-2 ${statusClass} ${isToday(day) ? "ring-2 ring-indigo-500" : ""} ${!isSameMonth(day, month) ? "opacity-40" : ""}`}>
                            {format(day, "d")}
                        </div>
                    )
                })}
            </div>

            <div className='flex items-center gap-4 mt-5 text-xs text-slate-500'>
                <div className='flex items-center gap-1.5'><span className='w-3 h-3 bg-emerald-50 border-2 border-emerald-500 inline-block'/> Present</div>
                <div className='flex items-center gap-1.5'><span className='w-3 h-3 bg-rose-50 border-2 border-rose-500 inline-block'/> Absent</div>
                <div className='flex items-center gap-1.5'><span className='w-3 h-3 bg-slate-50 border-2 border-slate-700 inline-block'/> Future</div>
            </div>
        </div>
    )
}

export default AttendanceCalendar
