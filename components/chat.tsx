'use client'

import { useChat, type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { toast } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import {
  appendMessage,
  checkRunStatus,
  createRun,
  createThread,
  fetchAssistant,
  loadMessages
} from '@/lib/utils/assistant'
import { CustomMessage } from '@/lib/types'
import { EmptyScreen } from './empty-screen'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const { input, setInput } = useChat({
    initialMessages,
    id,
    body: {
      id,
      previewToken: ''
    },
    onResponse(response) {
      appendResult()
      if (response.status === 401) {
        toast.error(response.statusText)
      }
    }
  })

  const appendResult = async () => {
    console.log('appenind the result')
    await appendMessage({ role: 'assistant', content: input })
  }

  const [messages, setMessages] = useState<CustomMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchMessages = async () => {
    const newMessages = await loadMessages()
    setMessages(() => newMessages)
  }

  const onFormSubmit = async (stuff: CustomMessage) => {
    if (isLoading) return

    setIsLoading(true)
    setMessages(prev => [...prev, stuff])
    await appendMessage({ role: stuff.role, content: stuff.content })
    const run_id = await createRun()
    if (run_id) {
      await checkRunStatus(run_id)
      await fetchMessages()
    }
    setIsLoading(false)
  }

  const onNewConversation = async () => {
    await createThread()
    setMessages([])
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        append={onFormSubmit as any}
        input={input}
        setInput={setInput}
        onNewConversation={onNewConversation}
      />
    </>
  )
}
