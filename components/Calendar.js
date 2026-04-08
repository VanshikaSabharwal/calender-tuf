import { useState, useEffect, useRef } from 'react'
import styles from './Calendar.module.css'
import SpiralBinding from './SpiralBinding'

const DAYS   = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

// ── Season images ─────────────────────────────────────────────────────────────
const SEASON_IMAGES = {
  winter: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=800&q=80',
  spring: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80',
  summer: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  autumn: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
}

// ── Season CSS themes ─────────────────────────────────────────────────────────
const SEASON_THEMES = {
  winter: { '--c-accent':'#3b82f6', '--c-accent-dark':'#2563eb', '--c-accent-light':'#dbeafe', '--c-accent-text':'#1e3a5f', '--page-bg':'#e4eaf5' },
  spring: { '--c-accent':'#16a34a', '--c-accent-dark':'#15803d', '--c-accent-light':'#dcfce7', '--c-accent-text':'#14532d', '--page-bg':'#e2f0e8' },
  summer: { '--c-accent':'#0891b2', '--c-accent-dark':'#0e7490', '--c-accent-light':'#cffafe', '--c-accent-text':'#164e63', '--page-bg':'#ddf1f7' },
  autumn: { '--c-accent':'#d97706', '--c-accent-dark':'#b45309', '--c-accent-light':'#fef3c7', '--c-accent-text':'#78350f', '--page-bg':'#f5ede0' },
}

function getSeason(month) {
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

// ── Holidays ──────────────────────────────────────────────────────────────────
const FIXED_HOLIDAYS = {
  '01-01': "New Year's Day", '01-26': 'Republic Day',
  '05-01': 'Labour Day',     '08-15': 'Independence Day',
  '10-02': 'Gandhi Jayanti', '12-25': 'Christmas Day',
  '12-31': "New Year's Eve",
}
const VARIABLE_HOLIDAYS = {
  2025: { '03-14':'Holi', '04-14':'Dr. Ambedkar Jayanti', '04-18':'Good Friday', '10-20':'Diwali', '11-05':'Guru Nanak Jayanti', '03-31':'Eid al-Fitr', '06-07':'Eid al-Adha' },
  2026: { '03-03':'Holi', '04-14':'Dr. Ambedkar Jayanti', '04-03':'Good Friday', '11-07':'Diwali', '03-20':'Eid al-Fitr', '05-27':'Eid al-Adha' },
}
function getHoliday(day, month, year) {
  const mmdd = `${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  return FIXED_HOLIDAYS[mmdd] || VARIABLE_HOLIDAYS[year]?.[mmdd] || null
}

// ── Sound ─────────────────────────────────────────────────────────────────────
function playFlipSound() {
  try { new Audio('/audio/flip-sound.mp3').play() } catch {}
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}
function formatDate(d) {
  if (!d) return null
  return `${d.year}-${String(d.month+1).padStart(2,'0')}-${String(d.day).padStart(2,'0')}`
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Calendar() {
  const today = new Date()

  const [viewMonth,   setViewMonth]   = useState(today.getMonth())
  const [viewYear,    setViewYear]    = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState(null)
  const [notes,       setNotes]       = useState({})
  const [tasks,       setTasks]       = useState({})
  const [activeTab,   setActiveTab]   = useState('month')
  const [newTask,     setNewTask]     = useState('')
  const [isFlipping,  setIsFlipping]  = useState(false)
  const flipLock = useRef(false)

  // Load from localStorage
  useEffect(() => {
    console.log('[Calendar] mount — loading localStorage')
    try {
      const saved = localStorage.getItem('wc_state')
      if (saved) {
        const p = JSON.parse(saved)
        console.log('[Calendar] loaded:', p)
        if (p.notes)      setNotes(p.notes)
        if (p.tasks)      setTasks(p.tasks)
        if (p.viewMonth !== undefined) setViewMonth(p.viewMonth)
        if (p.viewYear  !== undefined) setViewYear(p.viewYear)
      }
    } catch(e) { console.error('[Calendar] load error:', e) }
  }, [])

  // Save to localStorage
  useEffect(() => {
    console.log(`[Calendar] saving — ${MONTHS[viewMonth]} ${viewYear}`)
    try {
      localStorage.setItem('wc_state', JSON.stringify({ notes, tasks, viewMonth, viewYear }))
    } catch(e) { console.error('[Calendar] save error:', e) }
  }, [notes, tasks, viewMonth, viewYear])

  // ── Navigation ──────────────────────────────────────────────────────────────
  const navigate = (dir) => {
    if (flipLock.current) { console.warn('[navigate] blocked — flip in progress'); return }
    console.log(`[navigate] ${dir}  ${MONTHS[viewMonth]} ${viewYear}`)
    flipLock.current = true
    setIsFlipping(true)
    playFlipSound()

    const curMonth = viewMonth
    const curYear  = viewYear

    // Swap content at midpoint when card is edge-on (invisible)
    setTimeout(() => {
      if (dir === 'next') {
        if (curMonth === 11) { setViewMonth(0); setViewYear(curYear + 1) }
        else setViewMonth(curMonth + 1)
      } else {
        if (curMonth === 0) { setViewMonth(11); setViewYear(curYear - 1) }
        else setViewMonth(curMonth - 1)
      }
    }, 250)

    // Release lock after animation completes
    setTimeout(() => {
      console.log('[navigate] flip done')
      setIsFlipping(false)
      flipLock.current = false
    }, 500)
  }

  const prevMonth = () => navigate('prev')
  const nextMonth = () => navigate('next')

  // ── Day click ───────────────────────────────────────────────────────────────
  const handleDayClick = (day) => {
    const d = { year: viewYear, month: viewMonth, day }
    console.log('[handleDayClick]', formatDate(d))
    setSelectedDay(d)
    setActiveTab('day')
    setNewTask('')
  }

  // ── Tasks ───────────────────────────────────────────────────────────────────
  const selectedKey = selectedDay ? formatDate(selectedDay) : null
  const dayTasks    = selectedKey ? (tasks[selectedKey] || []) : []

  const addTask = () => {
    if (!newTask.trim()) { console.warn('[addTask] empty'); return }
    if (!selectedKey)    { console.warn('[addTask] no day selected'); return }
    const task = { id: Date.now(), text: newTask.trim(), done: false }
    console.log('[addTask]', selectedKey, task.text)
    setTasks(t => ({ ...t, [selectedKey]: [...(t[selectedKey] || []), task] }))
    setNewTask('')
  }
  const toggleTask = (id) => {
    console.log('[toggleTask]', id)
    setTasks(t => ({ ...t, [selectedKey]: (t[selectedKey]||[]).map(tk => tk.id===id ? {...tk,done:!tk.done} : tk) }))
  }
  const deleteTask = (id) => {
    console.log('[deleteTask]', id)
    setTasks(t => ({ ...t, [selectedKey]: (t[selectedKey]||[]).filter(tk => tk.id!==id) }))
  }

  // ── Build cells ─────────────────────────────────────────────────────────────
  const monthNoteKey = `month-${viewYear}-${String(viewMonth+1).padStart(2,'0')}`
  const daysInMonth  = getDaysInMonth(viewYear, viewMonth)
  const firstDay     = getFirstDayOfMonth(viewYear, viewMonth)
  const totalCells   = Math.ceil((firstDay + daysInMonth) / 7) * 7

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day      = i - firstDay + 1
    const valid    = day >= 1 && day <= daysInMonth
    const isToday  = valid && day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
    const isSelected = valid && selectedDay?.year === viewYear && selectedDay?.month === viewMonth && selectedDay?.day === day
    const col      = i % 7
    const weekend  = col === 5 || col === 6
    const dateKey  = valid ? `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` : null
    const hasTasks = dateKey && (tasks[dateKey]?.length > 0)
    const holiday  = valid ? getHoliday(day, viewMonth, viewYear) : null
    return { day, valid, isToday, isSelected, weekend, hasTasks, holiday }
  })

  // ── Card width for SpiralBinding ────────────────────────────────────────────
  const cardRef  = useRef(null)
  const [cardWidth, setCardWidth] = useState(420)
  useEffect(() => {
    if (!cardRef.current) return
    const ro = new ResizeObserver(([e]) => setCardWidth(Math.round(e.contentRect.width)))
    ro.observe(cardRef.current)
    return () => ro.disconnect()
  }, [])

  const season = getSeason(viewMonth)
  const theme  = SEASON_THEMES[season]

  return (
    <div className={styles.page} style={{ '--page-bg': theme['--page-bg'] }}>
      <div className={styles.calendarWrap}>
        <SpiralBinding width={cardWidth} />

        <div
          className={[styles.card, isFlipping ? styles.flipping : ''].filter(Boolean).join(' ')}
          style={theme}
          ref={cardRef}
        >
          {/* ── Hero ── */}
          <div className={styles.heroWrap}>
            <img src={SEASON_IMAGES[season]} alt={season} className={styles.heroImg} />
            <div className={styles.seasonBadge}>{season.toUpperCase()}</div>
            <div className={styles.monthBadge}>
              <span className={styles.badgeYear}>{viewYear}</span>
              <span className={styles.badgeMonth}>{MONTHS[viewMonth].toUpperCase()}</span>
            </div>
          </div>

          {/* ── Bottom ── */}
          <div className={styles.bottom}>
            {/* Notes / Tasks */}
            <div className={styles.notesCol}>
              <div className={styles.notesLabel}>
                {activeTab === 'day' && selectedDay
                  ? `${selectedDay.day} ${MONTHS[selectedDay.month].slice(0,3)}`
                  : 'Notes'}
              </div>
              <div className={styles.notesTabs}>
                <button
                  className={`${styles.tabBtn} ${activeTab==='month' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('month')}
                >Month</button>
                <button
                  className={`${styles.tabBtn} ${activeTab==='day' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('day')}
                  disabled={!selectedDay}
                >Day</button>
              </div>

              {activeTab === 'month' && (
                <div className={styles.linesWrap}>
                  <textarea
                    className={styles.notesTextarea}
                    value={notes[monthNoteKey] || ''}
                    onChange={e => { const v=e.target.value; setNotes(n => ({...n,[monthNoteKey]:v})) }}
                    placeholder={`Notes for ${MONTHS[viewMonth]}…`}
                  />
                </div>
              )}

              {activeTab === 'day' && selectedDay && (
                <div className={styles.taskPanel}>
                  <div className={styles.taskList}>
                    {dayTasks.length === 0 && <div className={styles.taskEmpty}>No tasks yet</div>}
                    {dayTasks.map(task => (
                      <div key={task.id} className={styles.taskItem}>
                        <input type="checkbox" className={styles.taskCheck}
                          checked={task.done} onChange={() => toggleTask(task.id)} />
                        <span className={`${styles.taskText} ${task.done ? styles.taskDone : ''}`}>
                          {task.text}
                        </span>
                        <button className={styles.taskDel} onClick={() => deleteTask(task.id)}>✕</button>
                      </div>
                    ))}
                  </div>
                  <div className={styles.taskInputRow}>
                    <input className={styles.taskInput} type="text" value={newTask}
                      onChange={e => setNewTask(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && addTask()}
                      placeholder="Add task…" />
                    <button className={styles.taskAddBtn} onClick={addTask}>+ Add task</button>
                  </div>
                </div>
              )}
            </div>

            {/* Calendar Grid */}
            <div className={styles.gridCol}>
              <div className={styles.monthNav}>
                <button className={styles.navArrow} onClick={prevMonth}>‹</button>
                <span className={styles.navLabel}>{MONTHS[viewMonth]} {viewYear}</span>
                <button className={styles.navArrow} onClick={nextMonth}>›</button>
              </div>

              <div className={styles.dayRow}>
                {DAYS.map(d => (
                  <div key={d} className={`${styles.dayHead} ${d==='SAT'||d==='SUN' ? styles.weekend : ''}`}>
                    {d}
                  </div>
                ))}
              </div>

              <div className={styles.grid}>
                {cells.map((c, i) => (
                  <button key={i} disabled={!c.valid} title={c.holiday||undefined}
                    className={[
                      styles.cell,
                      !c.valid         ? styles.cellBlank    : '',
                      c.isToday        ? styles.cellToday    : '',
                      c.isSelected     ? styles.cellSelected : '',
                      c.holiday && !c.isSelected ? styles.cellHoliday  : '',
                      c.weekend && c.valid && !c.isSelected ? styles.cellWeekend : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => c.valid && handleDayClick(c.day)}
                  >
                    {c.valid ? c.day : ''}
                    <span className={styles.cellDots}>
                      {c.hasTasks && <span className={styles.taskDot} />}
                      {c.holiday  && <span className={styles.holidayDot} />}
                    </span>
                  </button>
                ))}
              </div>

              <div className={styles.holidayLegend}>
                {cells.filter(c => c.valid && c.holiday).map((c, i) => (
                  <div key={i} className={styles.legendItem}>
                    <span className={styles.legendDot} />
                    <span className={styles.legendText}>{c.day} – {c.holiday}</span>
                  </div>
                ))}
              </div>

              <button className={styles.todayBtn} onClick={() => {
                console.log('[Today] releasing lock, jumping to today')
                flipLock.current = false
                setIsFlipping(false)
                setViewMonth(today.getMonth())
                setViewYear(today.getFullYear())
              }}>Today</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
