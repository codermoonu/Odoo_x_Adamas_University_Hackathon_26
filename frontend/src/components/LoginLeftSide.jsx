import ParticleField from './ParticleField'

const LoginLeftSide = () => {
  return (
    <div className="hidden md:flex w-1/2 bg-black relative overflow-hidden border-r-2 border-indigo-600">

        <div className="absolute -top-30 -left-30 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl"></div>

        <ParticleField/>

        <div className="relative z-10 flex flex-col items-start justify-center p-12 lg:p-20 w-full h-full">

            <h1 className="text-xl lg:text-2xl font-medium text-white mb-8 leading-loose tracking-wide">Employee <br /> Management System</h1>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">Streamline your workforce operations, track attendance, manage payroll, and empower your team securely.</p>
        </div>
    </div>
  )
}

export default LoginLeftSide