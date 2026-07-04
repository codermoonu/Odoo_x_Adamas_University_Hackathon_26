import { TriangleAlertIcon } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { dummySalaryStructure } from '../../assets/assets'

const money = (n) => `$${(Number(n) || 0).toLocaleString(undefined, {maximumFractionDigits: 2})}`

const UnderlineInput = ({value, onChange, type = "number", disabled = false, className = ""}) => (
    <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e)=> onChange?.(e.target.value)}
        className={`bg-transparent border-0 border-b-2 rounded-none px-0 py-1 text-sm focus:ring-0 focus:outline-none ${disabled ? "border-slate-800 text-slate-500 cursor-not-allowed" : "border-slate-700 focus:border-indigo-500 text-slate-900"} ${className}`}
    />
)

// TODO: no backend endpoint for salary structure yet - wage/components/PF/professional tax
// all live in local state, seeded from dummySalaryStructure. Wire this up to a real
// GET/POST salary-structure endpoint once one exists.
const SalaryStructure = () => {
    const [wage, setWage] = useState(dummySalaryStructure.wage)
    const [components, setComponents] = useState(dummySalaryStructure.components)
    const [pfRate, setPfRate] = useState(12)
    const [professionalTax, setProfessionalTax] = useState(200)

    const updateComponent = (key, field) => (value) => {
        setComponents((prev)=> prev.map((c)=> c.key === key ? {...c, [field]: value} : c))
    }

    const basicAmount = useMemo(()=>{
        const basic = components.find((c)=> c.key === "basic")
        if(!basic) return 0
        return basic.type === "fixed" ? (Number(basic.value) || 0) : (wage * (Number(basic.value) || 0)) / 100
    }, [components, wage])

    const computedAmounts = useMemo(()=>{
        return components.reduce((acc, c)=>{
            if(c.key === "basic"){ acc[c.key] = basicAmount; return acc }
            if(c.type === "fixed"){ acc[c.key] = Number(c.value) || 0; return acc }
            const base = c.base === "basic" ? basicAmount : wage
            acc[c.key] = (base * (Number(c.value) || 0)) / 100
            return acc
        }, {})
    }, [components, wage, basicAmount])

    const componentsTotal = useMemo(()=> Object.values(computedAmounts).reduce((a, b)=> a + b, 0), [computedAmounts])
    const isOverBudget = componentsTotal > wage
    const fixedAllowance = Math.max(wage - componentsTotal, 0)
    const grossTotal = componentsTotal + fixedAllowance

    const pfAmount = (basicAmount * (Number(pfRate) || 0)) / 100
    const netSalary = grossTotal - pfAmount - (Number(professionalTax) || 0)

    return (
        <div className='space-y-6'>

            {/* Wage type + wage */}
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl'>
                <div>
                    <label className='block text-xs text-slate-500 mb-1.5'>Wage Type</label>
                    <UnderlineInput type='text' value='Fixed Wage' disabled/>
                </div>
                <div>
                    <label className='block text-xs text-slate-500 mb-1.5'>Wage (Monthly)</label>
                    <UnderlineInput value={wage} onChange={(v)=> setWage(Number(v) || 0)} className='w-full'/>
                </div>
            </div>

            {isOverBudget && (
                <div className='p-3 bg-rose-50 border-2 border-rose-200 text-rose-700 text-sm flex items-start gap-2 max-w-xl'>
                    <TriangleAlertIcon className='w-4 h-4 shrink-0 mt-0.5'/>
                    Salary components exceed the defined wage by {money(componentsTotal - wage)}. Reduce a percentage or fixed amount below.
                </div>
            )}

            {/* Salary components */}
            <div className='card overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='table-modern'>
                        <thead>
                            <tr>
                                <th>Component</th>
                                <th>Computation Type</th>
                                <th>Value</th>
                                <th className='text-right'>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {components.map((c)=>(
                                <tr key={c.key}>
                                    <td className='text-slate-800 font-medium'>{c.name}</td>
                                    <td>
                                        <select value={c.type} onChange={(e)=> updateComponent(c.key, "type")(e.target.value)} className='max-w-[9rem]'>
                                            <option value='fixed'>Fixed Amount</option>
                                            <option value='percentage'>Percentage</option>
                                        </select>
                                    </td>
                                    <td>
                                        {c.type === "percentage" ? (
                                            <div className='flex items-center gap-2'>
                                                <UnderlineInput value={c.value} onChange={updateComponent(c.key, "value")} className='w-16'/>
                                                <span className='text-xs text-slate-500'>% of {c.base === "basic" ? "Basic" : "Wage"}</span>
                                            </div>
                                        ) : (
                                            <UnderlineInput value={c.value} onChange={updateComponent(c.key, "value")} className='w-24'/>
                                        )}
                                    </td>
                                    <td className='text-right font-medium text-slate-900'>{money(computedAmounts[c.key])}</td>
                                </tr>
                            ))}
                            <tr>
                                <td className='text-slate-800 font-medium'>Fixed Allowance</td>
                                <td className='text-xs text-slate-500' colSpan={2}>Wage - total of other components</td>
                                <td className='text-right font-medium text-slate-900'>{money(fixedAllowance)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Statutory configuration */}
            <div>
                <h3 className='text-sm font-medium text-slate-900 mb-4 pb-2 border-b border-slate-800'>Statutory Deductions</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl'>
                    <div>
                        <label className='block text-xs text-slate-500 mb-1.5'>PF Rate (%)</label>
                        <UnderlineInput value={pfRate} onChange={(v)=> setPfRate(Number(v) || 0)} className='w-full'/>
                    </div>
                    <div>
                        <label className='block text-xs text-slate-500 mb-1.5'>Professional Tax</label>
                        <UnderlineInput value={professionalTax} onChange={(v)=> setProfessionalTax(Number(v) || 0)} className='w-full'/>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className='card p-5 max-w-md space-y-2'>
                <div className='flex justify-between text-sm'>
                    <span className='text-slate-500'>Gross Total</span>
                    <span className='text-slate-900 font-medium'>{money(grossTotal)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                    <span className='text-slate-500'>PF Deduction ({pfRate}% of Basic)</span>
                    <span className='text-rose-500'>-{money(pfAmount)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                    <span className='text-slate-500'>Professional Tax</span>
                    <span className='text-rose-500'>-{money(professionalTax)}</span>
                </div>
                <div className='flex justify-between text-sm pt-2 border-t border-slate-800'>
                    <span className='text-slate-800 font-medium'>Net Salary</span>
                    <span className='text-indigo-600 font-semibold'>{money(netSalary)}</span>
                </div>
            </div>
        </div>
    )
}

export default SalaryStructure
