'use client'

import { useOpenAi } from '@/lib/hooks/useOpenAi'
import { useEffect } from 'react'

export default function CreateThread() {
  const { getThreads } = useOpenAi()
  const retrieveThread = async () => {
    const founsThread = await getThreads()
    console.log('The found threads', founsThread)
  }
  useEffect(() => {
    retrieveThread()
  }, [])
  return (
    <span className="" onClick={() => retrieveThread()}>
      Create thread here
    </span>
  )
}
