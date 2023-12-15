import { openai } from '../hooks/useOpenAi'
import { CustomMessage } from '../types'

export const getValue = async (key: string) => {
  const value = window.localStorage.getItem(key)
  if (!value) return
  const JsonValue = await JSON.parse(JSON.stringify(value))
  return JsonValue
}

export const createThread = async () => {
  const newThread = await openai.beta.threads.create()
  localStorage.setItem('the_assistant_thread', newThread.id)
  return newThread
}

export const getAssistantById = async (assistant_id: string) => {
  try {
    const assistant = await openai.beta.assistants.retrieve(assistant_id)
    if (!assistant) return
    localStorage.setItem('the_assistant_id', assistant.id)
    return assistant
  } catch (err) {
    return
  }
}

export const appendMessage = async (message: any) => {
  const assistant_id = await getValue('the_assistant_id')
  let thread_id = await getValue('the_assistant_thread')
  if (!thread_id) {
    const thread = await createThread()
    if (!thread) return
    thread_id = thread.id
  }

  if (!thread_id || !assistant_id) return
  await openai.beta.threads.messages.create(thread_id, message)

  return
}

// export const loadMessages = async (thread_id: string) => {
//   const { data } = await openai.beta.threads.messages.list(thread_id)
//   const theMessage: CustomMessage[] = []
//   data.forEach(({ content, role, id, created_at }) => {
//     content.forEach((contentItem: any) => {
//       theMessage.push({
//         content: contentItem?.text.value,
//         role,
//         id,
//         createdAt: new Date(created_at * 1000)
//       })
//     })
//   })
// }
