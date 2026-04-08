'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './TearCalendar.module.css'

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const MONS = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
]

function addDays(d, n) {
  const r = new Date(d)
  r.setDate(d.getDate() + n)
  return r
}

//  Confetti
function Confetti({ active }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const pieces = useRef([])

  const COLORS = [
    '#f43f5e',
    '#3b82f6',
    '#22c55e',
    '#f59e0b',
    '#a855f7',
    '#06b6d4',
    '#ec4899',
  ]

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    pieces.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 200,
      w: 6 + Math.random() * 8,
      h: 3 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: 2 + Math.random() * 4,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.2,
      drift: (Math.random() - 0.5) * 1.5,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      pieces.current.forEach((p) => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height)
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
        p.y += p.speed
        p.x += p.drift
        p.angle += p.spin
      })
      if (pieces.current.some((p) => p.y < canvas.height + 20)) {
        rafRef.current = requestAnimationFrame(draw)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  if (!active) return null
  return <canvas ref={canvasRef} className={styles.confettiCanvas} />
}

//  Page face
function PageFace({ date, faded }) {
  return (
    <>
      <div className={`${styles.pageTop} ${faded ? styles.faded : ''}`}>
        <span className={styles.pageYear}>{date.getFullYear()}</span>
        <span className={styles.pageMon}>{MONS[date.getMonth()]}</span>
      </div>
      <div className={`${styles.pageNum} ${faded ? styles.faded : ''}`}>
        {String(date.getDate()).padStart(2, '0')}
      </div>
      <div className={`${styles.pageDayName} ${faded ? styles.faded : ''}`}>
        {DAYS[date.getDay()]}
      </div>
    </>
  )
}

//  Main component
export default function TearCalendar() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [current, setCurrent] = useState(today)
  const [tearAngle, setTearAngle] = useState(0)
  const [tearing, setTearing] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [snapping, setSnapping] = useState(false)
  const [celebration, setCelebration] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [hint, setHint] = useState(true)
  const flipSoundRef = useRef(null)
  const celebrateSoundRef = useRef(null)

  const touchStartY = useRef(null)
  const mouseStartY = useRef(null)
  const isDragging = useRef(false)

  const next = addDays(current, 1)

  const isNewYear = current.getMonth() === 11 && current.getDate() === 31

  useEffect(() => {
    flipSoundRef.current = new Audio('/audio/tear-cal-flip.mp3')
    celebrateSoundRef.current = new Audio('/audio/happy-new-year-sound.mp3')

    // optional tuning
    flipSoundRef.current.volume = 0.5
    celebrateSoundRef.current.volume = 0.7
  }, [])

  const completeTear = useCallback(() => {
    setCompleting(true)
    setTearAngle(185)

    if (flipSoundRef.current) {
      flipSoundRef.current.pause()
      flipSoundRef.current.currentTime = 0
      flipSoundRef.current.play().catch(() => {})
    }

    setTimeout(() => {
      setCurrent((prev) => addDays(prev, 1))
      setTearAngle(0)
      setCompleting(false)
      setTearing(false)

      if (isNewYear) {
        setCelebration(true)
        setConfetti(true)

        if (celebrateSoundRef.current) {
          celebrateSoundRef.current.currentTime = 0
          celebrateSoundRef.current.play().catch(() => {})
        }

        setTimeout(() => setConfetti(false), 4000)
      }
    }, 420)
  }, [isNewYear])

  const stopCelebrateSound = () => {
    if (celebrateSoundRef.current) {
      celebrateSoundRef.current.pause()
      celebrateSoundRef.current.currentTime = 0
    }
  }

  const snapBack = useCallback(() => {
    setSnapping(true)
    setTearAngle(0)
    setTimeout(() => {
      setSnapping(false)
      setTearing(false)
    }, 300)
  }, [])

  //  Touch
  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
    setTearing(true)
    setHint(false)
  }
  const onTouchMove = (e) => {
    if (touchStartY.current === null) return
    const dy = touchStartY.current - e.touches[0].clientY
    const angle = Math.max(0, Math.min(175, dy * 0.9))
    setTearAngle(angle)
  }
  const onTouchEnd = () => {
    if (tearAngle > 60) completeTear()
    else snapBack()
    touchStartY.current = null
  }

  //  Mouse (desktop)
  const onMouseDown = (e) => {
    mouseStartY.current = e.clientY
    isDragging.current = true
    setTearing(true)
    setHint(false)
    e.preventDefault()
  }
  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current) return
      const dy = mouseStartY.current - e.clientY
      const angle = Math.max(0, Math.min(175, dy * 0.9))
      setTearAngle(angle)
    }
    const onUp = () => {
      if (!isDragging.current) return
      isDragging.current = false
      if (tearAngle > 60) completeTear()
      else snapBack()
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [tearAngle, completeTear, snapBack])

  const pageStyle = {
    transform: `perspective(700px) rotateX(${-tearAngle}deg)`,
    transformOrigin: 'top center',
    transition: completing
      ? 'transform 0.42s cubic-bezier(0.4,0,0.6,1)'
      : snapping
        ? 'transform 0.3s ease-out'
        : 'none',
    cursor: tearing ? 'grabbing' : 'grab',
    zIndex: 10,
  }

  const goToLastDay = () => {
    const year = current.getFullYear()
    const lastDay = new Date(year, 11, 31) // Dec = 11
    lastDay.setHours(0, 0, 0, 0)
    setCurrent(lastDay)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.topControls}>
        <button className={styles.jumpBtn} onClick={goToLastDay}>
          Dec 31 (For a Celebration!)
        </button>

        <button className={styles.todayBtn} onClick={() => setCurrent(today)}>
          Today
        </button>
      </div>
      <Confetti active={confetti} />

      <div className={styles.scene}>
        <div className={styles.calendarBlock}>
          {/*  Right edge (page stack depth) */}
          <div className={styles.edgeRight} />
          {/*  Bottom edge */}
          <div className={styles.edgeBottom} />

          {/*  Rings / binding at top */}
          <div className={styles.ringsWrap}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className={styles.ring} />
            ))}
          </div>

          {/*  Base stand */}
          <div className={styles.baseStand} />

          {/*  Next page (revealed underneath) */}
          <div className={styles.nextPage}>
            <PageFace date={next} faded={false} />
          </div>

          {/*  Current page (torn by user) */}
          <div
            className={styles.currentPage}
            style={pageStyle}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
          >
            {/* Perforated tear line at top */}
            <div className={styles.tearLine}>
              {Array.from({ length: 22 }, (_, i) => (
                <span key={i} className={styles.tearDot} />
              ))}
            </div>

            <PageFace date={current} faded={false} />

            {hint && (
              <div className={styles.hint}>
                <span className={styles.hintArrow}>↑</span> drag to tear
              </div>
            )}
          </div>

          {/*  Back of torn page (shows when angle > 90) */}
          {tearAngle > 85 && <div className={styles.pageBack} />}
        </div>

        <p className={styles.subLabel}>
          {current.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/*  Celebration popup */}
      {celebration && (
        <div
          className={styles.celebOverlay}
          onClick={() => setCelebration(false)}
        >
          <div
            className={styles.celebCard}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.celebEmojis}>🎊 🥂 🎆</div>
            <h2 className={styles.celebTitle}>Happy New Year!</h2>
            <p className={styles.celebYear}>{next.getFullYear()}</p>
            <p className={styles.celebSub}>
              Wishing you joy, health &amp; success!
            </p>
            <button
              className={styles.celebBtn}
              onClick={() => {
                stopCelebrateSound()
                setCelebration(false)
              }}
            >
              🎉 End Celebration!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
