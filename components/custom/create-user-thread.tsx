'use client'

import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useOpenAi } from '@/lib/hooks/useOpenAi'
import { useEffect } from 'react'

export const CreateThread = () => {
  const { getThreads } = useOpenAi()
  const retrieveThread = async () => {
    const foundThread = await getThreads()
    console.log('The found threads', foundThread)
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

export const ClearThread = () => {
  const { clearAssistant } = useLocalStorage()
  return (
    <span className="" onClick={() => clearAssistant()}>
      Clear current thread
    </span>
  )
}
