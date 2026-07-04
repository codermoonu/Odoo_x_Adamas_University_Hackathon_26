import { useCallback, useEffect, useState } from "react"
import Loading from "../components/Loading"
import CheckInButton from "../components/attendance/CheckInButton"
import AttendanceStats from "../components/attendance/AttendanceStats"
import AttendanceHistory from "../components/attendance/AttendanceHistory"
import AttendanceCalendar from "../components/attendance/AttendanceCalendar"
import api from "../api/axios"
import { toast } from "react-hot-toast"
import {
  addMonths,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
} from "date-fns"

const SmallMonthCalendar = ({ monthDate, history, label }) => {
  const start = startOfMonth(monthDate)
  const end = endOfMonth(monthDate)
  const totalDays = end.getDate()
  const startDay = getDay(start)

  const days = Array.from({ length: startDay + totalDays }, (_, index) => {
    if (index < startDay) return null
    return index - startDay + 1
  })

  const getStatus = (day) => {
    if (!day) return "empty"

    const date = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      day
    )

    date.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (date > today) return "future"

    const record = history.find((r) =>
      isSameDay(new Date(r.date), date)
    )

    if (record) return "present"

    return "absent"
  }

  return (
    <div className="border border-slate-700 p-4">
      <p className="text-xs text-slate-500">{label}</p>

      <h3 className="text-lg font-semibold text-orange-100 mb-4">
        {format(monthDate, "MMMM yyyy")}
      </h3>

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-slate-500 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, index) => (
          <span key={index}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {days.map((day, index) => {
          const status = getStatus(day)

          return (
            <div
              key={index}
              className={`h-8 flex items-center justify-center border text-xs ${
                status === "empty"
                  ? "border-transparent"
                  : status === "present"
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                  : status === "absent"
                  ? "bg-rose-500/20 border-rose-400 text-rose-300"
                  : "bg-slate-900 border-slate-700 text-slate-500"
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-4 text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-emerald-500"></span>
          Present
        </div>

        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-rose-500"></span>
          Absent
        </div>

        <div className="flex items-center gap-1">
          <span className="w-3 h-3 border border-slate-500"></span>
          Future
        </div>
      </div>
    </div>
  )
}

const Attendance = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)
  const [view, setView] = useState("daily")

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get("/attendance")
      const json = res.data

      setHistory(json.data || [])

      if (json.employee?.isDeleted) {
        setIsDeleted(true)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <Loading />

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayRecord = history.find((r) =>
    isSameDay(new Date(r.date), today)
  )

  const currentMonthHistory = history.filter((r) =>
    isSameMonth(new Date(r.date), today)
  )

  const filteredHistory =
    view === "daily"
      ? history.filter((r) => isSameDay(new Date(r.date), today))
      : currentMonthHistory

  const monthCalendars = [
    { label: "Previous Month", date: addMonths(today, -2) },
    { label: "Previous Month", date: addMonths(today, -1) },
    { label: "Current Month", date: today },
    { label: "Upcoming Month", date: addMonths(today, 1) },
  ]

  return (
    <div className="relative animate-fade-in space-y-8 pb-32">

      {!isDeleted && (
        <div className="fixed bottom-6 right-6 z-50 w-[300px] max-w-[calc(100vw-2rem)]">
          <div className="rounded-3xl border border-orange-500/40 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-md">
            <CheckInButton todayRecord={todayRecord} onAction={fetchData} />
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-semibold text-orange-100">
          Attendance Dashboard
        </h1>

        <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-400">
          Track your work hours, daily check-ins, monthly records and attendance performance.
        </p>
      </div>

      {isDeleted && (
        <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-6 text-center shadow-lg">
          <p className="font-medium text-rose-600">
            You can no longer clock in or out because your employee records have been marked as deleted.
          </p>
        </div>
      )}

      {view === "daily" && (
        <div className="flex justify-center">
          <div className="w-full lg:w-[78%] xl:w-[68%]">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-orange-100">
                Attendance Calendar
              </h2>
              <p className="text-xs text-slate-500">
                Quick monthly overview of your attendance
              </p>
            </div>

            <div className="scale-[0.92] origin-top">
              <AttendanceCalendar history={history} />
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center sm:justify-start">
        <div className="inline-flex overflow-hidden border border-slate-700 bg-slate-950 p-1 shadow-lg">
          <button
            type="button"
            onClick={() => setView("daily")}
            className={`px-6 py-2 text-sm font-medium ${
              view === "daily"
                ? "bg-orange-500 text-slate-950"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            Daily
          </button>

          <button
            type="button"
            onClick={() => setView("monthly")}
            className={`px-6 py-2 text-sm font-medium ${
              view === "monthly"
                ? "bg-orange-500 text-slate-950"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {view === "monthly" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {monthCalendars.map((month, index) => (
            <SmallMonthCalendar
              key={index}
              label={month.label}
              monthDate={month.date}
              history={history}
            />
          ))}
        </div>
      )}

      <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-orange-100">
            Attendance Stats
          </h2>

          <p className="text-xs text-slate-500">
            {view === "daily"
              ? "Showing today's attendance summary"
              : "Showing current month's attendance summary"}
          </p>
        </div>

        <AttendanceStats history={filteredHistory} />
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-orange-100">
            Attendance History
          </h2>

          <p className="text-xs text-slate-500">
            {view === "daily"
              ? "Your check-in and check-out record for today"
              : "Your check-in and check-out records for current month"}
          </p>
        </div>

        <AttendanceHistory history={filteredHistory} />
      </div>
    </div>
  )
}

export default Attendance