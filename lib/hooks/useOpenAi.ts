'use client'
import { Message } from 'ai'
import { Assistant } from 'openai/resources/beta/assistants/assistants'
import { useCallback, useEffect, useState } from 'react'
import { useLocalStorage } from './use-local-storage'
import OpenAI from 'openai'

export type CustomMessage = Message & {
  createdAt: Date
}

const thread_id = 'thread_eznxPsCmoTeOKfALK8YgJHG8'
const apiKey = '------YOUR OPENAI KEY HERE---------'

export function useOpenAi() {
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<CustomMessage[]>([])
  const [assistant, setAssistant] = useState<Assistant | null>()
  const [run, setRun] = useState<string>('')
  const { setValue, assistantId, clearAssistant, thread } = useLocalStorage()

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    dangerouslyAllowBrowser: true
  })

  const testApiKey = async (apiKey: string) => {
    const url = 'https://api.openai.com/v1/chat/completions'
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
    const data = {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      messages: [
        { role: 'user', content: "Translate 'Hello, world!' into French." }
      ]
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      })

      if (response.ok) {
        const responseData = await response.json()
        // ApiKey in localStorage.
        setValue('assistant_api_key', apiKey)
      } else {
        console.log('Failed to connect. Status Code:', response.status)
      }
    } catch (error) {
      console.log('An error occurred:', error)
    }
  }

  const createRun = async () => {
    const current_id = await getCurrentThread()
    setLoading(true)
    try {
      if (!assistant) {
        console.log('No assistant found')
        return
      }
      const run = await openai.beta.threads.runs.create(current_id, {
        assistant_id: assistant.id,
        instructions:
          'Please address the user as Jane Doe. The user has a premium account.'
      })
      localStorage.setItem('run_id', run.id)
      // setRun(run.id)
      return run.id
    } catch (Err) {
      console.error('error within run')
    } finally {
      setLoading(false)
    }
  }

  const getRunId = async () => {
    if (!localStorage.getItem('run_id')) {
      await createRun()
    }
    const run_id = localStorage.getItem('run_id')
    return run_id
  }

  const retrieveMessagesByThread = async () => {
    const threadMessages = await openai.beta.threads.messages.list(thread_id)
    return threadMessages
  }

  const createThread = async () => {
    const newThread = await openai.beta.threads.create()
    console.log(newThread.id, 'thread')
    localStorage.setItem('the_assistant_thread', newThread.id)
    // if (newThread) {
    //   setCurrentThread(newThread.id as string)
    //   setValue('the_assistant_thread', newThread.id as string)
    //   console.log('thread created', currentThread)

    //   return newThread
    // } else {
    //   console.log('thread not created')

    //   return
    // }

    return newThread
  }

  const getCurrentThread = async () => {
    if (!localStorage.getItem('the_assistant_thread')) {
      await createThread()
    }
    const id = localStorage.getItem('the_assistant_thread')
    return id as string
  }

  const loadMessages = async () => {
    const { data } = await retrieveMessagesByThread()
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

    setMessages(theMessage)
  }

  const fetchAssistant = useCallback(async (id: string) => {
    try {
      const assistant = await openai.beta.assistants.retrieve(id)
      if (!assistant) return
      // store the assistant on the state and its id on local storage
      setAssistant(() => assistant)
      setValue('the_assistant_id', assistant.id)
    } catch (err) {
      return
    }
  }, [])

  const checkRunStatus = async (run_id: string) => {
    const current_id = await getCurrentThread()
    let foundRun
    try {
      foundRun = await openai.beta.threads.runs.retrieve(current_id, run_id)
    } catch (err) {
      console.warn('Error within retrieving the run', err)
      return
    }

    if (foundRun.status === 'completed') {
      await loadMessages()
    } else {
      setTimeout(() => {
        checkRunStatus(run_id)
      }, 4000)
    }
  }

  const appendMessage = async (message: any) => {
    // setMessages(prev => [...prev, message])
    let thread_id = await getCurrentThread()
    if (!thread_id) {
      const thread = await createThread()
      if (!thread) return
      thread_id = thread.id
    }

    console.log('appending the message', {
      message,
      assistant,
      thread_id
    })

    if (!thread_id || !assistant) return
    const data = await openai.beta.threads.messages.create(thread_id, message)
    console.log('data returdedn from appening the messages, data', data)
    return
  }

  const onFormSubmit = async () => {
    if (!assistant) {
      console.log('there is no assistant', assistant)
      return
    }

    if (loading) {
      console.log('there is still a run in progress')
      return
    }

    const run_id = await createRun()
    // TODO: check the reason why the run is not returning anything
    if (run_id) await checkRunStatus(run_id as string)
  }

  const clearAll = useCallback(() => {
    setAssistant(null)
    clearAssistant()
  }, [])

  const loadAssistant = async () => {
    await loadMessages()
    await fetchAssistant(assistantId)
  }

  useEffect(() => {
    if (assistantId && !assistant) loadAssistant()
  }, [assistantId, assistant])
  return {
    loading,
    onFormSubmit,
    messages,
    assistant,
    loadMessages,
    appendMessage,
    fetchAssistant,
    retrieveMessagesByThread,
    testApiKey,
    createThread,
    clearAll
  }
}
