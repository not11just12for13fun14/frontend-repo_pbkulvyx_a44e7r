import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import AuthPanel from './components/AuthPanel'
import Dashboard from './components/Dashboard'

function Home(){
  const [session, setSession] = useState(null)
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <Navbar />
      <Hero />
      <main className="max-w-7xl mx-auto px-6">
        <AuthPanel onAuthed={setSession} />
        {session && <Dashboard session={session} />}
      </main>
      <footer className="mt-10 py-8 text-center text-blue-300/60 text-sm border-t border-slate-800/60">© {new Date().getFullYear()} laxo exchange</footer>
    </div>
  )
}

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
