import { type UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconEdit, IconStop } from '@/components/ui/icons'

export interface ChatPanelProps
  extends Pick<UseChatHelpers, 'append' | 'isLoading' | 'input' | 'setInput'> {
  id?: string
  onNewConversation: () => void
}

export function ChatPanel({
  id,
  isLoading,
  append,
  input,
  setInput,
  onNewConversation
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4 relative">
        <div className="flex h-10 items-center justify-center gap-3">
          {isLoading && (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => onNewConversation()}
            className="bg-white text-black absolute top-0 right-0"
          >
            <IconEdit className="mr-2" />
            New chat
          </Button>
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={async value => {
              // #TODO: appening the message to the thread
              await append({
                id,
                content: value,
                role: 'user'
              })
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
