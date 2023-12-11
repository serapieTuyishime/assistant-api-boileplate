'use client'

import { useOpenAi } from '@/lib/hooks/useOpenAi'

export const GetCurrentThread = () => {
  const { retrieveMessagesByThread } = useOpenAi()
  const getThread = async () => {
    await retrieveMessagesByThread()
  }

  return <span onClick={() => getThread()}>Get thread</span>
}
