import OpenAI from 'openai'
import { CustomMessage } from '../types'

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  dangerouslyAllowBrowser: true
})

export const assistant_id = process.env.NEXT_PUBLIC_ASSISTANT_ID

export const getValue = async (key: string): Promise<string> => {
  const value = window.localStorage.getItem(key)
  if (!value) return ''
  const JsonValue = await JSON.parse(JSON.stringify(value))
  return JsonValue
}
export const fetchAssistant = async (id: string): Promise<boolean> => {
  try {
    const assistant = await openai.beta.assistants.retrieve(id)
    return Boolean(assistant)
  } catch (err) {
    return false
  }
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
    return assistant
  } catch (err) {
    return
  }
}

export const appendMessage = async (message: any) => {
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

export const createRun = async () => {
  const thread_id = await getValue('the_assistant_thread')
  try {
    if (!assistant_id) {
      console.log('No assistant found')
      return
    }
    const run = await openai.beta.threads.runs.create(thread_id, {
      assistant_id
    })
    return run.id
  } catch (Err) {
    console.error('error within run')
  }
}

export const loadMessages = async () => {
  // retrieve messgages by the thread passed
  let thread_id = await getValue('the_assistant_thread')
  if (!thread_id) {
    thread_id = await (await createThread()).id
  }
  const { data } = await openai.beta.threads.messages.list(thread_id)
  const theMessage: CustomMessage[] = []
  data.forEach(({ content, role, id, created_at }) => {
    content.forEach((contentItem: any) => {
      theMessage.push({
        content: contentItem?.text.value,
        role,
        id,
        createdAt: new Date(created_at * 1000)
      })
    })
  })

  // order the messages:

  theMessage.sort((a, b) => {
    const dateA = Math.floor(a?.createdAt.getTime() / 1000)
    const dateB = Math.floor(b?.createdAt.getTime() / 1000)
    return dateA - dateB
  })

  return theMessage
}

export const checkRunStatus = async (run_id: string): Promise<boolean> => {
  let thread_id = await getValue('the_assistant_thread')
  let foundRun

  try {
    foundRun = await openai.beta.threads.runs.retrieve(thread_id, run_id)
  } catch (err) {
    console.warn('Error within retrieving the run', err)
    return false
  }

  if (foundRun.status === 'completed') {
    return true
  } else {
    await new Promise(resolve => setTimeout(resolve, 4000))
    return await checkRunStatus(run_id)
  }
}
