'use client'
import { useState } from 'react'
import Calendar from '../components/Calendar'
import TearCalendar from '../components/TearCalendar'

export default function Home() {
  const [view, setView] = useState<'wall' | 'tear'>('wall')

  return (
    <main style={{ position: 'relative' }}>
      {/* Toggle */}
      <div style={{
        position: 'fixed', top: 12, right: 12, zIndex: 999,
        display: 'flex', gap: 6, background: 'rgba(0,0,0,0.55)',
        borderRadius: 20, padding: '4px 6px', backdropFilter: 'blur(8px)',
      }}>
        <button
          onClick={() => setView('wall')}
          style={{
            fontSize: 11, fontWeight: 700, padding: '5px 12px',
            borderRadius: 16, border: 'none', cursor: 'pointer',
            background: view === 'wall' ? '#3b82f6' : 'transparent',
            color: view === 'wall' ? '#fff' : 'rgba(255,255,255,0.6)',
            transition: 'all 0.2s',
          }}
        >Wall Calendar</button>
        <button
          onClick={() => setView('tear')}
          style={{
            fontSize: 11, fontWeight: 700, padding: '5px 12px',
            borderRadius: 16, border: 'none', cursor: 'pointer',
            background: view === 'tear' ? '#f59e0b' : 'transparent',
            color: view === 'tear' ? '#fff' : 'rgba(255,255,255,0.6)',
            transition: 'all 0.2s',
          }}
        >Tear Pad</button>
      </div>

      {view === 'wall' ? <Calendar /> : <TearCalendar />}
    </main>
  )
}
