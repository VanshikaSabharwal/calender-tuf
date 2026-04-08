import Head from 'next/head'
import Calendar from '../components/Calendar'

export default function Home() {
  return (
    <>
      <Head>
        <title>Wall Calendar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Calendar />
      </main>
    </>
  )
}
