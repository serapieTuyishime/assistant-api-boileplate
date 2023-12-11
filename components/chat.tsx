'use client'

import { useChat, type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'
import { useOpenAi } from '@/lib/hooks/useOpenAi'
import { useEffect, useState } from 'react'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const { isLoading, input, setInput } = useChat({
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

  const { onFormSubmit, messages, appendMessage, assistantId } = useOpenAi()

  const appendResult = async () => {
    await appendMessage({ role: 'assistant', content: input })
  }
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userInput, setUserInput] = useState('')
  const { getValue, setValue } = useLocalStorage()

  useEffect(() => {
    const localApiKey = getValue('assistant_api_key')
    setUserInput(localApiKey)
    setIsDialogOpen(Boolean(!localApiKey && assistantId))
  }, [])
  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages?.length ? (
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
      />
      {/* TODO: open the mmodal when there is no api key */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={() => console.log('chaning the api key')}
      >
        {true ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter your OpenAI Key</DialogTitle>
              <DialogDescription>
                If you have not obtained your OpenAI API key, you can do so by{' '}
                <a
                  href="https://platform.openai.com/signup/"
                  className="underline"
                >
                  signing up
                </a>{' '}
                on the OpenAI website. This is only necessary for preview
                environments so that the open source community can test the app.
                The token will be saved to your browser&apos;s local storage
                under the name <code className="font-mono">ai-token</code>.
              </DialogDescription>
            </DialogHeader>
            <Input
              value={userInput}
              placeholder="OpenAI API key"
              onChange={e => setUserInput(e.target.value)}
            />
            <DialogFooter className="items-center">
              <Button
                onClick={() => {
                  setValue('assistant_api_key', userInput)
                  setIsDialogOpen(false)
                }}
              >
                Save Token
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : (
          <></>
        )}
      </Dialog>
    </>
  )
}
