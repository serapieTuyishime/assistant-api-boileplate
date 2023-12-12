'use client'

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
  const { clearAll } = useOpenAi()
  return (
    <span className="" onClick={() => clearAll()}>
      Clear current thread
    </span>
  )
}
