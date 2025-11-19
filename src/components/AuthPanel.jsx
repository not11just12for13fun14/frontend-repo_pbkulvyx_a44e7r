import { useState } from 'react';

export default function AuthPanel({ onAuthed }){
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  async function submit(){
    setLoading(true);
    try{
      if(mode==='register'){
        await fetch(`${API}/auth/register`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email, password})});
      }
      const res = await fetch(`${API}/auth/login`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email, password})});
      const data = await res.json();
      if(res.ok){ onAuthed({email, password, user:data}); }
      else alert(data.detail || 'Auth failed');
    }catch(e){ alert('Network error'); }
    setLoading(false);
  }

  return (
    <div id="auth" className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-blue-100 font-semibold">Account</h3>
        <div className="text-xs text-blue-300/70">
          <button className={mode==='login'? 'text-white' : ''} onClick={()=>setMode('login')}>Login</button>
          <span className="mx-2">·</span>
          <button className={mode==='register'? 'text-white' : ''} onClick={()=>setMode('register')}>Register</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="bg-slate-800 text-blue-100 px-3 py-2 rounded-md"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="bg-slate-800 text-blue-100 px-3 py-2 rounded-md"/>
        <button onClick={submit} disabled={loading} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-60">{loading? 'Please wait...' : (mode==='login'? 'Login' : 'Create account')}</button>
      </div>
    </div>
  )
}
