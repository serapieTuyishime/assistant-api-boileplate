'use client'

import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useOpenAi } from '@/lib/hooks/useOpenAi'

export const CreateThread = () => {
  // const retrieveThread = async () => {
  //   const foundThread = await getThreads()
  //   console.log('The found threads', foundThread)
  // }
  // useEffect(() => {
  //   retrieveThread()
  // }, [])
  return (
    <span className="" onClick={() => console.log('creating a thread')}>
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
