# Calendar App

A modern, interactive calendar built with **Next.js** — featuring per-day tasks, month notes, emoji tags, country-based public holidays, seasonal themes, a soft paper page-flip animation, and a tear-pad UI with New Year celebration effects.

**Live Demo:** https://calender-mu-green.vercel.app/

---

## Installation

1. **Fork** the repository
2. **Clone** your fork

   ```bash
   git clone <your-repo-url>
   ```

3. Add upstream remote

   ```bash
   git remote add upstream https://github.com/VanshikaSabharwal/calender-tuf.git
   ```

4. Verify remotes

   ```bash
   git remote -v
   ```

5. Install dependencies

   ```bash
   npm install
   ```

6. Start development server

   ```bash
   npm run dev
   ```

---

## Tech Stack

- **Next.js** — React framework with app router
- **CSS Modules** — scoped, component-level styling
- **LocalStorage** — client-side persistence, no backend needed
- **Prettier** — code formatting
- **Vercel** — deployment

---

## Features

### Navigation

- **Arrow buttons** — step forward and backward through months
- **Swipe gestures** — swipe up/down on mobile to navigate
- **Today button** — jump back to the current month instantly
- **Soft paper page flip** — realistic 3D flip animation with shadow and flutter on every month change

### Country & Season

- **Country selector** — choose from 6 supported countries; holidays and seasons update automatically
- **Seasonal themes** — background image, color palette, and season badge all change with the season
- **Hemisphere-aware seasons** — Southern Hemisphere countries (Australia) get reversed seasons

### Day Panel

- **Click any date** — opens the Day panel on the left
- **Mark / Unmark day** — cross off a day with a red ✕; cell dims to show it has passed
- **Emoji tags** — attach up to 10 visual emoji labels per day (🎯 💼 🏋️ and more)
- **Per-day tasks** — type a task and press Enter; a dot appears on the calendar cell
- **Complete tasks** — checkbox strikes through a task; ✕ deletes it
- **Task dot indicator** — filled dot on the cell shows days that have tasks

### Notes & Export

- **Month notes** — free-text notes panel for the whole month, styled like a ruled notebook
- **Download Day PDF** — export all tasks for the selected day as a printable PDF
- **Download Month PDF** — export all tasks across the entire month as a printable PDF

### Onboarding & Help

- **Welcome modal** — shown on first visit, offering a guided tour
- **Guided tour** — step-by-step walkthrough of every feature, re-launchable anytime via the ▶ Tour button
- **ⓘ Info panel** — quick feature reference accessible from the hero image

### Special Effects

- **Tear pad effect** — satisfying page-tear animation and sound at the end of each year
- **New Year celebration** — visual and audio celebration when Dec 31 rolls over to Jan 1
- **Page flip sound** — subtle sound plays on every month navigation

---

## Supported Countries

| Country      | Fixed Holidays                                              | Variable Holidays                              | Season Logic                   |
| ------------ | ----------------------------------------------------------- | ---------------------------------------------- | ------------------------------ |
| 🇮🇳 India     | Republic Day, Independence Day, Gandhi Jayanti + more       | Holi, Eid, Diwali, Guru Nanak Jayanti          | Northern Hemisphere            |
| 🇺🇸 USA       | Independence Day, Veterans Day, Juneteenth + more           | MLK Day, Thanksgiving, Memorial Day            | Northern Hemisphere            |
| 🇬🇧 UK        | Christmas, Boxing Day, New Year's                           | Good Friday, Easter Monday, Bank Holidays      | Northern Hemisphere            |
| 🇦🇺 Australia | Australia Day, ANZAC Day, Christmas                         | Good Friday, Easter Monday, King's Birthday    | Southern Hemisphere (reversed) |
| 🇯🇵 Japan     | National Foundation Day, Children's Day, Culture Day + more | Coming of Age Day, Marine Day, Sports Day      | Northern Hemisphere            |
| 🇩🇪 Germany   | Labour Day, German Unity Day, Christmas + more              | Good Friday, Easter, Ascension, Corpus Christi | Northern Hemisphere            |

Holiday data covers **2025 and 2026**.

---

## UI Highlights

- Seasonal hero images — unique nature photograph per season
- Four full color themes — Winter (blue), Spring (green), Summer (cyan), Autumn (amber)
- Holiday legend — list of all holidays in the current month shown below the grid
- Holiday dots — red dot on calendar cells that fall on public holidays
- Mobile-friendly layout — compact hero, side-by-side panels, swipe navigation

---

## Design Decisions

1. **LocalStorage over a backend** — eliminates server round-trips and works offline after first load; no login required
2. **PDF export** — makes the calendar solve a real-world problem; users can print and carry their schedule
3. **Country-based holidays and seasons** — a calendar app used globally should reflect each user's actual reality, not a single locale
4. **Emoji tags per day** — keeps the interface lively and gives users a fast visual language for categorizing days
5. **Per-day and per-month PDF** — two export granularities cover both daily planning and monthly reviews
6. **Cross / mark-off gesture** — gives users a clear visual record of days that have passed, reducing mental load
7. **Tear pad UI with anxiety in mind** — research shows that physically tearing a day off a calendar gives people a sense of closure and satisfaction; the tear animation replicates that digitally
8. **New Year celebration** — a moment of delight that makes the app feel alive, not just functional
9. **Seasonal themes** — the calendar changes its look with the real-world season, making it feel connected to the outside world rather than a static grid
10. **Guided tour on first visit** — lowers the learning curve without cluttering the UI with permanent tooltips

---

## Future Improvements

- Cloud sync (login-based storage)
- Drag & drop task reordering
- Recurring tasks
- Push notifications and reminders
- Dark mode toggle
- More country support

---

## Credits

- Page flip sound — [freesound_community](https://pixabay.com/users/freesound_community-46691455/) from [Pixabay](https://pixabay.com/)
- Tear sound — [freesound_community](https://pixabay.com/users/freesound_community-46691455/) from [Pixabay](https://pixabay.com/)
- Celebration music — [BACKGROUND MUSIC](https://pixabay.com/users/background_music-53364585/) from [Pixabay](https://pixabay.com/)
- Season photos — [Unsplash](https://unsplash.com/)

---

## Notes

- All data is stored locally in the browser — no account, no backend, no data leaves your device
- Works offline after the initial load
- Designed for both productivity and a pleasant daily experience

---

## Author

Built by [Vanshika Sabharwal](https://github.com/VanshikaSabharwal)
