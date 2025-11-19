import { useEffect, useMemo, useState } from 'react';

export default function Dashboard({ session }){
  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  const [prices, setPrices] = useState({BTC:0, ETH:0, USDT:1});
  const [wallets, setWallets] = useState([]);
  const [kyc, setKyc] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load(){
    const p = await fetch(`${API}/prices`).then(r=>r.json());
    setPrices(p);
    if(session){
      const w = await fetch(`${API}/wallets?email=${encodeURIComponent(session.email)}&password=${encodeURIComponent(session.password)}`).then(r=>r.json());
      setWallets(w.wallets || []);
      const ks = await fetch(`${API}/kyc/status?email=${encodeURIComponent(session.email)}&password=${encodeURIComponent(session.password)}`).then(r=>r.json());
      setKyc(ks);
    }
  }

  useEffect(()=>{ load(); const t=setInterval(load, 10000); return ()=>clearInterval(t); }, [session]);

  async function createDeposit(asset, amount){
    setBusy(true);
    try{
      const res = await fetch(`${API}/deposits/create`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: session.email, password: session.password, asset, amount})});
      const data = await res.json();
      if(res.ok){ alert(`Send ${amount} ${asset} to ${data.destination} (PayPal). Marked approved in demo.`); load(); }
      else alert(data.detail||'Deposit error');
    } finally{ setBusy(false);}  
  }

  async function place(side, base_asset, amount){
    setBusy(true);
    try{
      const res = await fetch(`${API}/trade/market`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: session.email, password: session.password, side, base_asset, amount})});
      const data = await res.json();
      if(res.ok){ alert(`Filled at ${data.price} USDT`); load(); }
      else alert(data.detail||'Trade error');
    } finally { setBusy(false); }
  }

  return (
    <section className="mt-6 grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-blue-100 font-semibold">Markets</h3>
            <div className="text-xs text-blue-300/70">Live price feed</div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 text-blue-100">
            <div className="bg-slate-800/70 rounded-md p-3">
              <div className="text-sm text-blue-300/80">BTC/USDT</div>
              <div className="text-2xl font-semibold">{prices.BTC?.toFixed?.(2)}</div>
            </div>
            <div className="bg-slate-800/70 rounded-md p-3">
              <div className="text-sm text-blue-300/80">ETH/USDT</div>
              <div className="text-2xl font-semibold">{prices.ETH?.toFixed?.(2)}</div>
            </div>
            <div className="bg-slate-800/70 rounded-md p-3">
              <div className="text-sm text-blue-300/80">USDT/USD</div>
              <div className="text-2xl font-semibold">1.00</div>
            </div>
          </div>
        </div>

        <div id="trade" className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <h3 className="text-blue-100 font-semibold mb-3">Market Trade</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/70 rounded-md p-3">
              <div className="text-blue-200/80 text-sm mb-2">Buy</div>
              <TradeForm side="buy" onSubmit={place} />
            </div>
            <div className="bg-slate-800/70 rounded-md p-3">
              <div className="text-blue-200/80 text-sm mb-2">Sell</div>
              <TradeForm side="sell" onSubmit={place} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <h3 className="text-blue-100 font-semibold">Wallets</h3>
          <div className="mt-3 space-y-2 text-blue-100">
            {wallets.map(w=> (
              <div key={w.id} className="flex items-center justify-between bg-slate-800/70 rounded-md p-2">
                <div>{w.asset}</div>
                <div className="text-right">
                  <div className="font-semibold">{Number(w.balance||0).toFixed(6)}</div>
                  <div className="text-xs text-blue-300/70">Avail {Number(w.available||0).toFixed(6)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <h3 className="text-blue-100 font-semibold">Quick Deposit (PayPal)</h3>
          <DepositForm busy={busy} onDeposit={createDeposit} />
          <div className="mt-2 text-xs text-blue-300/70">Destination: elvisspear046@gmail.com</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <h3 className="text-blue-100 font-semibold">KYC</h3>
          <KycPanel API={API} session={session} status={kyc} onStatus={setKyc}/>
        </div>
      </div>
    </section>
  )
}

function TradeForm({ side, onSubmit }){
  const [base, setBase] = useState('BTC');
  const [amount, setAmount] = useState('0.001');
  return (
    <div className="grid grid-cols-3 gap-2">
      <select value={base} onChange={e=>setBase(e.target.value)} className="col-span-1 bg-slate-900 text-blue-100 px-2 py-2 rounded-md">
        <option>BTC</option>
        <option>ETH</option>
      </select>
      <input value={amount} onChange={e=>setAmount(e.target.value)} className="col-span-1 bg-slate-900 text-blue-100 px-2 py-2 rounded-md"/>
      <button onClick={()=>onSubmit(side, base, Number(amount)||0)} className={`col-span-1 px-3 py-2 rounded-md ${side==='buy'?'bg-green-600 hover:bg-green-500':'bg-red-600 hover:bg-red-500'} text-white`}>{side==='buy'? 'Buy' : 'Sell'}</button>
    </div>
  )
}

function DepositForm({ onDeposit, busy }){
  const [asset, setAsset] = useState('USDT');
  const [amount, setAmount] = useState('100');
  return (
    <div className="grid grid-cols-3 gap-2 mt-2">
      <select value={asset} onChange={e=>setAsset(e.target.value)} className="bg-slate-900 text-blue-100 px-2 py-2 rounded-md">
        <option>USDT</option>
        <option>USD</option>
      </select>
      <input value={amount} onChange={e=>setAmount(e.target.value)} className="bg-slate-900 text-blue-100 px-2 py-2 rounded-md"/>
      <button disabled={busy} onClick={()=>onDeposit(asset, Number(amount)||0)} className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60">Deposit</button>
    </div>
  )
}

function KycPanel({ API, session, status, onStatus }){
  const [form, setForm] = useState({document_type:'passport', document_number:'', full_name:'', dob:'', address:''});
  const [submitting, setSubmitting] = useState(false);

  async function submit(){
    setSubmitting(true);
    try{
      const res = await fetch(`${API}/kyc/submit`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email: session.email, password: session.password, ...form})});
      const data = await res.json();
      if(res.ok){ alert('KYC submitted. Auto-approval in ~2 minutes.'); poll(); }
      else alert(data.detail||'KYC error');
    } finally{ setSubmitting(false); }
  }

  async function poll(){
    const ks = await fetch(`${API}/kyc/status?email=${encodeURIComponent(session.email)}&password=${encodeURIComponent(session.password)}`).then(r=>r.json());
    onStatus(ks);
  }

  return (
    <div>
      {status?.status==='approved'? (
        <div className="text-green-400 text-sm">Verified</div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <select value={form.document_type} onChange={e=>setForm(f=>({...f, document_type:e.target.value}))} className="bg-slate-900 text-blue-100 px-2 py-2 rounded-md">
              <option value="passport">Passport</option>
              <option value="id_card">ID Card</option>
              <option value="driver_license">Driver License</option>
            </select>
            <input value={form.document_number} onChange={e=>setForm(f=>({...f, document_number:e.target.value}))} placeholder="Document number" className="bg-slate-900 text-blue-100 px-2 py-2 rounded-md"/>
          </div>
          <input value={form.full_name} onChange={e=>setForm(f=>({...f, full_name:e.target.value}))} placeholder="Full name" className="w-full bg-slate-900 text-blue-100 px-2 py-2 rounded-md"/>
          <div className="grid grid-cols-2 gap-2">
            <input value={form.dob} onChange={e=>setForm(f=>({...f, dob:e.target.value}))} placeholder="DOB (YYYY-MM-DD)" className="bg-slate-900 text-blue-100 px-2 py-2 rounded-md"/>
            <input value={form.address} onChange={e=>setForm(f=>({...f, address:e.target.value}))} placeholder="Address" className="bg-slate-900 text-blue-100 px-2 py-2 rounded-md"/>
          </div>
          <div className="flex gap-2">
            <button onClick={submit} disabled={submitting} className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60">Submit KYC</button>
            <button onClick={poll} className="px-3 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-blue-100">Refresh</button>
          </div>
          {status?.record?.approve_at && (
            <div className="text-xs text-blue-300/70">Auto-approval at: {new Date(status.record.approve_at).toLocaleString()}</div>
          )}
        </div>
      )}
    </div>
  )
}
