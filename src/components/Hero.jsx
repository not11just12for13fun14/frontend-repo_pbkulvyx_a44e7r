import Spline from '@splinetool/react-spline';

export default function Hero(){
  return (
    <section className="relative h-[420px] overflow-hidden border-b border-slate-800/60">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">laxo exchange</h1>
          <p className="mt-3 text-blue-200/80 max-w-xl">A fast, modern crypto venue with custodial wallets, instant KYC, and market-only trading. Built for clarity and speed.</p>
          <div className="mt-6 flex gap-3">
            <a href="#auth" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500">Get started</a>
            <a href="#trade" className="px-4 py-2 rounded-md bg-slate-800 text-blue-100 hover:bg-slate-700">Trade now</a>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/10 to-slate-900"></div>
    </section>
  )
}
