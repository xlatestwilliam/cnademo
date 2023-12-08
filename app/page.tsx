'use client'

import dynamic from 'next/dynamic'

const DynamicWidget = dynamic(() => import('./components/loginWidget'), { ssr: false })

export default function Home() {

  return <DynamicWidget/>
}
