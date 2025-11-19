import { useState } from 'react';
import { Menu, Bell, User, Wallet, ArrowUpCircle, ArrowDownCircle, BarChart3, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar(){
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-slate-900/70 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="lg:hidden p-2" onClick={()=>setOpen(!open)}>
            <Menu className="w-5 h-5 text-blue-300"/>
          </button>
          <Link to="/" className="text-xl font-bold tracking-tight text-white">
            laxo <span className="text-blue-400">•</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 ml-6 text-sm text-blue-200/80">
            <Link to="/markets" className="hover:text-white">Markets</Link>
            <Link to="/trade" className="hover:text-white">Trade</Link>
            <Link to="/wallets" className="hover:text-white">Wallets</Link>
            <Link to="/kyc" className="hover:text-white">KYC</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-md hover:bg-slate-800/70">
            <Bell className="w-5 h-5 text-blue-200"/>
          </button>
          <Link to="/wallets" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-600/90 hover:bg-blue-600 text-white text-sm">
            <Wallet className="w-4 h-4"/> Wallets
          </Link>
          <Link to="/account" className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-100 text-sm">
            <User className="w-4 h-4"/> Account
          </Link>
        </div>
      </div>
      {open && (
        <div className="lg:hidden px-4 pb-3 text-blue-200/80 border-t border-slate-700/50">
          <div className="py-2 grid grid-cols-2 gap-3 text-sm">
            <Link to="/markets" className="hover:text-white flex items-center gap-2"><BarChart3 className="w-4 h-4"/> Markets</Link>
            <Link to="/trade" className="hover:text-white flex items-center gap-2"><Settings className="w-4 h-4"/> Trade</Link>
            <Link to="/wallets" className="hover:text-white flex items-center gap-2"><ArrowDownCircle className="w-4 h-4"/> Wallets</Link>
            <Link to="/kyc" className="hover:text-white flex items-center gap-2"><ArrowUpCircle className="w-4 h-4"/> KYC</Link>
          </div>
        </div>
      )}
    </header>
  )
}
