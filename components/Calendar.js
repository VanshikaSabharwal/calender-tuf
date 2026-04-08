'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './Calendar.module.css'
import SpiralBinding from './SpiralBinding'
import useCalendarTour from './useCalendarTour'

const DAYS   = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

const EMOJI_OPTIONS = ['🎯','💼','🏋️','🏠','🛒','🍽️','🚗','✈️','🎉','🎂']

const FEATURES = [
  { icon: '◀▶', label: 'Navigate months',        desc: 'Arrow buttons or swipe up/down on mobile' },
  { icon: '🌍', label: 'Country holidays',        desc: 'Pick your country for personalised public holidays' },
  { icon: '📅', label: 'Click a day',             desc: 'Select a date to open the Day panel' },
  { icon: '✕',  label: 'Mark / Unmark day',       desc: 'Cross off a day; the cell dims with a red ✕' },
  { icon: '😊', label: 'Emoji tags',              desc: 'Add visual emoji labels to any day' },
  { icon: '➕', label: 'Add tasks',               desc: 'Type & press Enter — dot appears on the cell' },
  { icon: '✅', label: 'Complete tasks',           desc: 'Checkbox strikes through; ✕ deletes it' },
  { icon: '📝', label: 'Month notes',             desc: 'Free-text notes for the whole month' },
  { icon: '📄', label: 'Download PDF',            desc: 'Export day or month tasks as a printable PDF' },
]

//  Season images
const SEASON_IMAGES = {
  winter: 'https://images.unsplash.com/photo-1483664852095-d6cc6870702d?w=800&q=80',
  spring: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80',
  summer: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  autumn: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
}

//  Season CSS themes
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

//  Country-based holidays
const COUNTRY_HOLIDAYS = {
  IN: {
    label: '🇮🇳 India',
    fixed: {
      '01-01': "New Year's Day", '01-26': 'Republic Day',
      '05-01': 'Labour Day',     '08-15': 'Independence Day',
      '10-02': 'Gandhi Jayanti', '12-25': 'Christmas Day',
      '12-31': "New Year's Eve",
    },
    variable: {
      2025: { '03-14':'Holi', '03-31':'Eid al-Fitr', '04-14':'Dr. Ambedkar Jayanti', '04-18':'Good Friday', '06-07':'Eid al-Adha', '10-20':'Diwali', '11-05':'Guru Nanak Jayanti' },
      2026: { '03-03':'Holi', '03-20':'Eid al-Fitr', '04-03':'Good Friday', '04-14':'Dr. Ambedkar Jayanti', '05-27':'Eid al-Adha', '11-07':'Diwali' },
    },
  },
  US: {
    label: '🇺🇸 USA',
    fixed: {
      '01-01': "New Year's Day", '06-19': 'Juneteenth',
      '07-04': 'Independence Day', '11-11': 'Veterans Day',
      '12-25': 'Christmas Day',   '12-31': "New Year's Eve",
    },
    variable: {
      2025: { '01-20':'MLK Day', '02-17':"Presidents' Day", '05-26':'Memorial Day', '09-01':'Labor Day', '10-13':'Columbus Day', '11-27':'Thanksgiving' },
      2026: { '01-19':'MLK Day', '02-16':"Presidents' Day", '05-25':'Memorial Day', '09-07':'Labor Day', '10-12':'Columbus Day', '11-26':'Thanksgiving' },
    },
  },
  GB: {
    label: '🇬🇧 UK',
    fixed: {
      '01-01': "New Year's Day", '12-25': 'Christmas Day',
      '12-26': 'Boxing Day',     '12-31': "New Year's Eve",
    },
    variable: {
      2025: { '04-18':'Good Friday', '04-21':'Easter Monday', '05-05':'Early May Bank Holiday', '05-26':'Spring Bank Holiday', '08-25':'Summer Bank Holiday' },
      2026: { '04-03':'Good Friday', '04-06':'Easter Monday', '05-04':'Early May Bank Holiday', '05-25':'Spring Bank Holiday', '08-31':'Summer Bank Holiday' },
    },
  },
  AU: {
    label: '🇦🇺 Australia',
    fixed: {
      '01-01': "New Year's Day", '01-26': 'Australia Day',
      '04-25': 'ANZAC Day',      '12-25': 'Christmas Day',
      '12-26': 'Boxing Day',
    },
    variable: {
      2025: { '04-18':'Good Friday', '04-19':'Easter Saturday', '04-21':'Easter Monday', '06-09':"King's Birthday" },
      2026: { '04-03':'Good Friday', '04-04':'Easter Saturday', '04-06':'Easter Monday', '06-08':"King's Birthday" },
    },
  },
  JP: {
    label: '🇯🇵 Japan',
    fixed: {
      '01-01': "New Year's Day",   '02-11': 'National Foundation Day',
      '04-29': 'Showa Day',        '05-03': 'Constitution Day',
      '05-04': 'Greenery Day',     '05-05': "Children's Day",
      '08-11': 'Mountain Day',     '11-03': 'Culture Day',
      '11-23': 'Labour Thanksgiving Day',
    },
    variable: {
      2025: { '01-13':'Coming of Age Day', '03-20':'Vernal Equinox', '07-21':'Marine Day', '09-15':'Respect for the Aged Day', '09-23':'Autumnal Equinox', '10-13':'Sports Day' },
      2026: { '01-12':'Coming of Age Day', '03-20':'Vernal Equinox', '07-20':'Marine Day', '09-21':'Respect for the Aged Day', '09-23':'Autumnal Equinox', '10-12':'Sports Day' },
    },
  },
  DE: {
    label: '🇩🇪 Germany',
    fixed: {
      '01-01': "New Year's Day",  '05-01': 'Labour Day',
      '10-03': 'German Unity Day','12-25': 'Christmas Day',
      '12-26': 'Second Christmas Day',
    },
    variable: {
      2025: { '04-18':'Good Friday', '04-20':'Easter Sunday', '04-21':'Easter Monday', '05-29':'Ascension Day', '06-08':'Whit Sunday', '06-09':'Whit Monday', '06-19':'Corpus Christi' },
      2026: { '04-03':'Good Friday', '04-05':'Easter Sunday', '04-06':'Easter Monday', '05-14':'Ascension Day', '05-24':'Whit Sunday', '05-25':'Whit Monday', '06-04':'Corpus Christi' },
    },
  },
}

function getHoliday(day, month, year, country = 'IN') {
  const c = COUNTRY_HOLIDAYS[country]
  if (!c) return null
  const mmdd = `${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  return c.fixed[mmdd] || c.variable[year]?.[mmdd] || null
}

//  Sound
function playFlipSound() {
  try { new Audio('/audio/flip-sound.mp3').play() } catch {}
}

//  Helpers
function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate() }
function getFirstDayOfMonth(year, month) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}
function formatDate(d) {
  if (!d) return null
  return `${d.year}-${String(d.month+1).padStart(2,'0')}-${String(d.day).padStart(2,'0')}`
}

//  Component
export default function Calendar() {
  const today = new Date()

  const [viewMonth,   setViewMonth]   = useState(today.getMonth())
  const [viewYear,    setViewYear]    = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState(null)
  const [notes,       setNotes]       = useState({})
  const [tasks,       setTasks]       = useState({})
  const [crosses,     setCrosses]     = useState({})
  const [dayEmojis,   setDayEmojis]   = useState({})
  const [country,     setCountry]     = useState('IN')
  const [activeTab,   setActiveTab]   = useState('month')
  const [newTask,     setNewTask]     = useState('')
  const [flipDir,     setFlipDir]     = useState(null)
  const [showInfo,    setShowInfo]    = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const flipLock    = useRef(false)
  const touchStartY = useRef(null)

  const startTour = useCalendarTour()

  // Load from localStorage + show welcome tour on first visit
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wc_state')
      if (saved) {
        const p = JSON.parse(saved)
        if (p.notes)      setNotes(p.notes)
        if (p.tasks)      setTasks(p.tasks)
        if (p.crosses)    setCrosses(p.crosses)
        if (p.dayEmojis)  setDayEmojis(p.dayEmojis)
        if (p.country)    setCountry(p.country)
        if (p.viewMonth !== undefined) setViewMonth(p.viewMonth)
        if (p.viewYear  !== undefined) setViewYear(p.viewYear)
      }
    } catch(e) {}

    // Show welcome modal on first visit
    if (!localStorage.getItem('wc_tour_seen')) {
      setShowWelcome(true)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wc_state', JSON.stringify({ notes, tasks, crosses, dayEmojis, country, viewMonth, viewYear }))
    } catch(e) {}
  }, [notes, tasks, crosses, dayEmojis, country, viewMonth, viewYear])

  //  Navigation
  const navigate = (dir) => {
    if (flipLock.current) return
    flipLock.current = true
    setFlipDir(dir)
    playFlipSound()
    const curMonth = viewMonth
    const curYear  = viewYear
    setTimeout(() => {
      if (dir === 'next') {
        if (curMonth === 11) { setViewMonth(0); setViewYear(curYear + 1) }
        else setViewMonth(curMonth + 1)
      } else {
        if (curMonth === 0) { setViewMonth(11); setViewYear(curYear - 1) }
        else setViewMonth(curMonth - 1)
      }
    }, 325)
    setTimeout(() => { setFlipDir(null); flipLock.current = false }, 650)
  }

  const prevMonth = () => navigate('prev')
  const nextMonth = () => navigate('next')

  //  Swipe
  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY }
  const handleTouchEnd   = (e) => {
    if (touchStartY.current === null) return
    const diff = touchStartY.current - e.changedTouches[0].clientY
    if (Math.abs(diff) > 40) { diff > 0 ? nextMonth() : prevMonth() }
    touchStartY.current = null
  }

  //  Day click
  const handleDayClick = (day) => {
    setSelectedDay({ year: viewYear, month: viewMonth, day })
    setActiveTab('day')
    setNewTask('')
  }

  //  Cross toggle
  const selectedKey = selectedDay ? formatDate(selectedDay) : null
  const toggleCross = () => {
    if (!selectedKey) return
    setCrosses(c => ({ ...c, [selectedKey]: !c[selectedKey] }))
  }

  //  Emoji toggle
  const dayEmojiList = selectedKey ? (dayEmojis[selectedKey] || []) : []
  const toggleEmoji  = (emoji) => {
    if (!selectedKey) return
    setDayEmojis(d => {
      const cur = d[selectedKey] || []
      const next = cur.includes(emoji) ? cur.filter(e => e !== emoji) : [...cur, emoji]
      return { ...d, [selectedKey]: next }
    })
  }

  //  Tasks
  const dayTasks = selectedKey ? (tasks[selectedKey] || []) : []
  const addTask  = () => {
    if (!newTask.trim() || !selectedKey) return
    const task = { id: Date.now(), text: newTask.trim(), done: false }
    setTasks(t => ({ ...t, [selectedKey]: [...(t[selectedKey] || []), task] }))
    setNewTask('')
  }
  const toggleTask = (id) => setTasks(t => ({ ...t, [selectedKey]: (t[selectedKey]||[]).map(tk => tk.id===id ? {...tk,done:!tk.done} : tk) }))
  const deleteTask = (id) => setTasks(t => ({ ...t, [selectedKey]: (t[selectedKey]||[]).filter(tk => tk.id!==id) }))

  //  Download PDF
  const downloadTasks = (mode) => {
    const accent = SEASON_THEMES[getSeason(viewMonth)]['--c-accent']
    let title, rows
    if (mode === 'day' && selectedDay) {
      title = `Tasks — ${selectedDay.day} ${MONTHS[selectedDay.month]} ${selectedDay.year}`
      const list = tasks[selectedKey] || []
      rows = list.length
        ? `<ul>${list.map(t => `<li class="${t.done ? 'done' : ''}">${t.text}</li>`).join('')}</ul>`
        : '<p class="empty">No tasks for this day.</p>'
    } else {
      title = `Tasks — ${MONTHS[viewMonth]} ${viewYear}`
      const days = getDaysInMonth(viewYear, viewMonth)
      rows = Array.from({ length: days }, (_, i) => {
        const d   = i + 1
        const key = `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
        const list = tasks[key] || []
        if (!list.length) return ''
        return `<div class="day-block"><div class="day-head">${d} ${MONTHS[viewMonth]}</div><ul>${list.map(t => `<li class="${t.done ? 'done' : ''}">${t.text}</li>`).join('')}</ul></div>`
      }).filter(Boolean).join('') || '<p class="empty">No tasks this month.</p>'
    }
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${title}</title>
<style>body{font-family:'Segoe UI',system-ui,sans-serif;color:#1e293b;padding:32px;max-width:600px;margin:auto}
h1{font-size:18px;font-weight:800;color:${accent};margin-bottom:16px;border-bottom:2px solid ${accent};padding-bottom:8px}
.day-block{margin-bottom:14px}.day-head{font-size:12px;font-weight:700;color:${accent};margin-bottom:4px}
ul{list-style:none;padding:0;margin:0}li{font-size:12px;padding:3px 0 3px 18px;position:relative;border-bottom:1px solid #f1f5f9}
li::before{content:'☐';position:absolute;left:0;color:#94a3b8}li.done{text-decoration:line-through;color:#94a3b8}
li.done::before{content:'☑';color:${accent}}.empty{color:#94a3b8;font-size:12px}
@media print{body{padding:16px}}</style></head><body>
<h1>${title}</h1>${rows}
<script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}<\/script></body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.target = '_blank'; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 5000)
  }

  //  Build cells
  const monthNoteKey = `month-${viewYear}-${String(viewMonth+1).padStart(2,'0')}`
  const daysInMonth  = getDaysInMonth(viewYear, viewMonth)
  const firstDay     = getFirstDayOfMonth(viewYear, viewMonth)
  const totalCells   = Math.ceil((firstDay + daysInMonth) / 7) * 7

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day        = i - firstDay + 1
    const valid      = day >= 1 && day <= daysInMonth
    const isToday    = valid && day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
    const isSelected = valid && selectedDay?.year === viewYear && selectedDay?.month === viewMonth && selectedDay?.day === day
    const col        = i % 7
    const weekend    = col === 5 || col === 6
    const dateKey    = valid ? `${viewYear}-${String(viewMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}` : null
    const hasTasks   = dateKey && (tasks[dateKey]?.length > 0)
    const holiday    = valid ? getHoliday(day, viewMonth, viewYear, country) : null
    const isCrossed  = dateKey ? !!crosses[dateKey] : false
    const emojis     = dateKey ? (dayEmojis[dateKey] || []) : []
    return { day, valid, isToday, isSelected, weekend, hasTasks, holiday, isCrossed, emojis }
  })

  //  Card width for SpiralBinding
  const cardRef = useRef(null)
  const [cardWidth, setCardWidth] = useState(560)
  useEffect(() => {
    if (!cardRef.current) return
    const ro = new ResizeObserver(([e]) => setCardWidth(Math.round(e.contentRect.width)))
    ro.observe(cardRef.current)
    return () => ro.disconnect()
  }, [])

  const season    = getSeason(viewMonth)
  const theme     = SEASON_THEMES[season]
  const flipClass = flipDir === 'next' ? styles.flippingNext
                  : flipDir === 'prev' ? styles.flippingPrev : ''

  const handleStartTour = () => {
    setShowWelcome(false)
    localStorage.setItem('wc_tour_seen', '1')
    // small delay so welcome modal unmounts first
    setTimeout(() => startTour(), 120)
  }

  const handleSkipTour = () => {
    setShowWelcome(false)
    localStorage.setItem('wc_tour_seen', '1')
  }

  return (
    <div className={styles.page} style={{ '--page-bg': theme['--page-bg'] }}>

      {/* ── Welcome modal (first visit) ── */}
      {showWelcome && (
        <div className={styles.welcomeOverlay}>
          <div className={styles.welcomeCard}>
            <div className={styles.welcomeEmoji}>📅</div>
            <h2 className={styles.welcomeTitle}>Welcome to your Calendar!</h2>
            <p className={styles.welcomeDesc}>Would you like a quick tour of all the features?</p>
            <div className={styles.welcomeBtns}>
              <button className={styles.welcomeSkip} onClick={handleSkipTour}>Skip tour</button>
              <button className={styles.welcomeStart} onClick={handleStartTour}>▶ Start tour</button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.calendarWrap}>
        <SpiralBinding width={cardWidth} />

        <div
          className={[styles.card, flipClass].filter(Boolean).join(' ')}
          style={theme}
          ref={cardRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/*  Hero  */}
          <div className={styles.heroWrap}>
            <img src={SEASON_IMAGES[season]} alt={season} className={styles.heroImg} />
            <div className={styles.seasonBadge}>{season.toUpperCase()}</div>

            {/* ── ⓘ and Tour buttons inside hero ── */}
            <div className={styles.heroToolbar}>
              <button
                className={styles.heroBtnInfo}
                onClick={() => setShowInfo(v => !v)}
                title="Feature list"
              >ⓘ</button>
              <button
                className={styles.heroBtnTour}
                onClick={handleStartTour}
                title="Start guided tour"
              >▶ Tour</button>
            </div>

            {/* ── Info panel ── */}
            {showInfo && (
              <div className={styles.infoPanel}>
                <div className={styles.infoPanelHeader}>
                  <span className={styles.infoPanelTitle}>Features</span>
                  <button className={styles.infoPanelClose} onClick={() => setShowInfo(false)}>✕</button>
                </div>
                <ul className={styles.featureList}>
                  {FEATURES.map(f => (
                    <li key={f.label} className={styles.featureItem}>
                      <span className={styles.featureIcon}>{f.icon}</span>
                      <div>
                        <div className={styles.featureLabel}>{f.label}</div>
                        <div className={styles.featureDesc}>{f.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.monthBadge}>
              <span className={styles.badgeYear}>{viewYear}</span>
              <span className={styles.badgeMonth}>{MONTHS[viewMonth].toUpperCase()}</span>
            </div>
          </div>

          {/*  Bottom  */}
          <div className={styles.bottom}>

            {/* ── Notes / Tasks panel ── */}
            <div className={styles.notesCol}>
              <div className={styles.notesLabel}>
                {activeTab === 'day' && selectedDay
                  ? `${selectedDay.day} ${MONTHS[selectedDay.month].slice(0,3)}`
                  : 'Notes'}
              </div>
              <div className={styles.notesTabs}>
                <button className={`${styles.tabBtn} ${activeTab==='month' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('month')}>Month</button>
                <button className={`${styles.tabBtn} ${activeTab==='day' ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab('day')} disabled={!selectedDay}>Day</button>
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

                  {/* Cross toggle */}
                  <button id="cal-cross"
                    className={`${styles.crossToggleBtn} ${crosses[selectedKey] ? styles.crossActive : ''}`}
                    onClick={toggleCross}
                  >
                    {crosses[selectedKey] ? '✕ Unmark' : '✕ Mark day'}
                  </button>

                  {/* Emoji picker */}
                  <div id="cal-emoji" className={styles.emojiPicker}>
                    {EMOJI_OPTIONS.map(emoji => (
                      <button key={emoji}
                        className={`${styles.emojiBtn} ${dayEmojiList.includes(emoji) ? styles.emojiActive : ''}`}
                        onClick={() => toggleEmoji(emoji)}
                        title={emoji}
                      >{emoji}</button>
                    ))}
                  </div>

                  {/* Task list */}
                  <div id="cal-task-list" className={styles.taskList}>
                    <div className={styles.taskHeader}>
                      <span className={styles.taskHeading}>Tasks</span>
                      <div className={styles.downloadBtns}>
                        <button id="cal-day-pdf" className={styles.dlBtn} onClick={() => downloadTasks('day')}>Day PDF</button>
                        <button id="cal-month-pdf" className={styles.dlBtn} onClick={() => downloadTasks('month')}>Month PDF</button>
                      </div>
                    </div>
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

                  <div id="cal-task-input" className={styles.taskInputRow}>
                    <input className={styles.taskInput} type="text" value={newTask}
                      onChange={e => setNewTask(e.target.value)}
                      onKeyDown={e => e.key==='Enter' && addTask()}
                      placeholder="Add task…" />
                    <button className={styles.taskAddBtn} onClick={addTask}>+ Add task</button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Calendar Grid ── */}
            <div className={styles.gridCol}>
              <div id="cal-month-nav" className={styles.monthNav}>
                <button className={styles.navArrow} onClick={prevMonth}>‹</button>
                <span className={styles.navLabel}>{MONTHS[viewMonth]} {viewYear}</span>
                <button className={styles.navArrow} onClick={nextMonth}>›</button>
              </div>

              {/* Country selector */}
              <select id="cal-country" className={styles.countrySelect}
                value={country} onChange={e => setCountry(e.target.value)}>
                {Object.entries(COUNTRY_HOLIDAYS).map(([code, { label }]) => (
                  <option key={code} value={code}>{label}</option>
                ))}
              </select>

              <div className={styles.dayRow}>
                {DAYS.map(d => (
                  <div key={d} className={`${styles.dayHead} ${d==='SAT'||d==='SUN' ? styles.weekend : ''}`}>{d}</div>
                ))}
              </div>

              <div id="cal-grid" className={styles.grid}>
                {cells.map((c, i) => (
                  <button key={i} disabled={!c.valid} title={c.holiday||undefined}
                    className={[
                      styles.cell,
                      !c.valid                              ? styles.cellBlank    : '',
                      c.isToday                             ? styles.cellToday    : '',
                      c.isSelected                          ? styles.cellSelected : '',
                      c.holiday && !c.isSelected            ? styles.cellHoliday  : '',
                      c.weekend && c.valid && !c.isSelected ? styles.cellWeekend  : '',
                      c.isCrossed && !c.isSelected          ? styles.cellCrossed  : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => c.valid && handleDayClick(c.day)}
                  >
                    {c.valid ? c.day : ''}
                    {c.isCrossed && <span className={styles.crossMark}>✕</span>}
                    {c.emojis.length > 0 && (
                      <span className={styles.cellEmojiRow}>{c.emojis.slice(0,2).join('')}</span>
                    )}
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
                flipLock.current = false
                setFlipDir(null)
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
