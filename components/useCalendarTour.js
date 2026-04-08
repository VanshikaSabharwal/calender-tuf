'use client'
import { useRef } from 'react'

export default function useCalendarTour() {
  const tourRef = useRef(null)

  const startTour = async () => {
    const Shepherd = (await import('shepherd.js')).default

    if (tourRef.current) {
      try { tourRef.current.cancel() } catch {}
    }

    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon:    { enabled: true },
        scrollTo:      { behavior: 'smooth', block: 'center' },
        modalOverlayOpeningPadding: 8,
        modalOverlayOpeningRadius: 8,
        popperOptions: {
          modifiers: [{ name: 'offset', options: { offset: [0, 16] } }],
        },
        classes: 'shepherd-custom',
      },
    })

    const next = () => tour.next()
    const back = () => tour.back()
    const btn  = (label, action, cls = 'shepherd-btn-next') => ({ text: label, action, classes: cls })

    tour.addStep({
      id: 'nav',
      attachTo: { element: '#cal-month-nav', on: 'bottom' },
      title: '◀ ▶ Navigate months',
      text:  'Use the <strong>‹</strong> and <strong>›</strong> arrows to flip between months. On mobile, <strong>swipe up or down</strong> on the calendar.',
      buttons: [ btn('Skip tour', () => tour.cancel(), 'shepherd-btn-skip'), btn('Next →', next) ],
    })

    tour.addStep({
      id: 'country',
      attachTo: { element: '#cal-country', on: 'bottom' },
      title: 'Pick your country',
      text:  'Choose your country from this dropdown to see <strong>personalised public holidays</strong> highlighted on your calendar.',
      buttons: [ btn('← Back', back, 'shepherd-btn-skip'), btn('Skip tour', () => tour.cancel(), 'shepherd-btn-skip'), btn('Next →', next) ],
    })

    tour.addStep({
      id: 'day-click',
      attachTo: { element: '#cal-grid', on: 'top' },
      title: 'Click any day',
      text:  'Tap or click a date to select it. This opens the <strong>Day panel</strong> on the left with marking, emoji and task options.',
      buttons: [ btn('← Back', back, 'shepherd-btn-skip'), btn('Skip tour', () => tour.cancel(), 'shepherd-btn-skip'), btn('Next →', next) ],
    })

    tour.addStep({
      id: 'cross',
      attachTo: { element: '#cal-cross', on: 'right' },
      title: '✕ Mark / Unmark a day',
      text:  'Click <strong>"✕ Mark day"</strong> to cross off a day. The cell dims with a red ✕. Click <strong>"✕ Unmark"</strong> to restore it.',
      buttons: [ btn('← Back', back, 'shepherd-btn-skip'), btn('Skip tour', () => tour.cancel(), 'shepherd-btn-skip'), btn('Next →', next) ],
    })

    tour.addStep({
      id: 'emoji',
      attachTo: { element: '#cal-emoji', on: 'right' },
      title: 'Tag days with emojis',
      text:  'Add emoji tags to any day as a quick visual reference — 🎯 goals, ✈️ travel, 🎂 birthdays. They appear as tiny icons on the grid cell.',
      buttons: [ btn('← Back', back, 'shepherd-btn-skip'), btn('Skip tour', () => tour.cancel(), 'shepherd-btn-skip'), btn('Next →', next) ],
    })

    tour.addStep({
      id: 'task-add',
      attachTo: { element: '#cal-task-input', on: 'top' },
      title: 'Add tasks',
      text:  'Type a task and press <strong>Enter</strong> or click <strong>"+ Add task"</strong>. Days with tasks show a small dot on the grid.',
      buttons: [ btn('← Back', back, 'shepherd-btn-skip'), btn('Skip tour', () => tour.cancel(), 'shepherd-btn-skip'), btn('Next →', next) ],
    })

    tour.addStep({
      id: 'task-complete',
      attachTo: { element: '#cal-task-list', on: 'right' },
      title: 'Complete & delete tasks',
      text:  'Check the <strong>checkbox</strong> to mark a task done (it strikes through). Hit <strong>✕</strong> to delete it permanently.',
      buttons: [ btn('← Back', back, 'shepherd-btn-skip'), btn('Done ✓', () => tour.complete()) ],
    })

tour.addStep({
  id: 'day-based-pdf-download',
  attachTo: { element: '#cal-day-pdf', on: 'right' },
  title: 'Download PDF for Daily Tasks',
  text: 'Click to download a PDF of your daily tasks.',
  buttons: [
    btn('← Back', back, 'shepherd-btn-skip'),
    btn('Done ✓', () => tour.complete())
  ],
})

tour.addStep({
  id: 'month-based-pdf-download',
  attachTo: { element: '#cal-month-pdf', on: 'right' },
  title: 'Download PDF for Monthly Tasks',
  text: 'Click to download a PDF of your monthly tasks.',
  buttons: [
    btn('← Back', back, 'shepherd-btn-skip'),
    btn('Done ✓', () => tour.complete())
  ],
})

    tourRef.current = tour
    tour.start()
  }

  return startTour
}
