'use client'

import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useOpenAi } from '@/lib/hooks/useOpenAi'
import { createThread } from '@/lib/utils/assistant'

export const CreateThread = () => {
  const { loadMessages } = useOpenAi()
  const createNewThread = async () => {
    // check if the assistant exists in the local storage
    const assistantId = await localStorage.getItem('the_assistant_id')
    if (!assistantId) {
      console.log('Trying to create the assitant but there is no assistant id')
      return
    }
    const thread = await createThread()
    await loadMessages(thread.id)
  }
  return (
    <span
      className="m-2 cursor-pointer rounded-md border border-white p-2"
      onClick={() => createNewThread()}
    >
      Create new thread here
    </span>
  )
}

export const ClearThread = () => {
  // const { clearAssistant } = useLocalStorage()
  return (
    <span
      className="m-2 cursor-pointer rounded-md border border-white p-2"
      onClick={() => console.log('clear')}
    >
      Clear current thread
    </span>
  )
}
