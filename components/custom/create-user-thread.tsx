'use client'

import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useOpenAi } from '@/lib/hooks/useOpenAi'

export const CreateThread = () => {
  const { createThread } = useOpenAi()
  // const retrieveThread = async () => {
  //   const foundThread = await getThreads()
  //   console.log('The found threads', foundThread)
  // }
  // useEffect(() => {
  //   retrieveThread()
  // }, [])
  return (
    <span
      className="m-2 cursor-pointer rounded-md border border-white p-2"
      onClick={() => createThread()}
    >
      Create thread here
    </span>
  )
}

export const ClearThread = () => {
  const { clearAssistant } = useLocalStorage()
  return (
    <span
      className="m-2 cursor-pointer rounded-md border border-white p-2"
      onClick={() => clearAssistant()}
    >
      Clear current thread
    </span>
  )
}
