import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat'

export const preferredRegion = 'home'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const chat = await getChat(params.id, process.env.MY_USER_ID as string)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const chat = await getChat(params.id, process.env.MY_USER_ID as string)

  if (!chat) {
    notFound()
  }

  if (chat?.userId !== (process.env.MY_USER_ID as string)) {
    notFound()
  }

  return <Chat id={chat.id} initialMessages={chat.messages} />
}
