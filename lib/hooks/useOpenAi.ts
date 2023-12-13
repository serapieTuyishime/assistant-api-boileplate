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
  const { setValue, assistantId, clearAssistant } = useLocalStorage()

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
    setLoading(true)
    try {
      const run = await openai.beta.threads.runs.create(thread_id, {
        assistant_id: assistantId,
        instructions:
          'Please address the user as Jane Doe. The user has a premium account.'
      })

      return run.id
    } catch (Err) {
      console.error('error within run')
    } finally {
      setLoading(false)
    }
  }

  const retrieveMessagesByThread = async () => {
    const threadMessages = await openai.beta.threads.messages.list(thread_id)
    return threadMessages
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
    console.log('message loaded')
  }

  const fetchAssistant = useCallback(async (id: string) => {
    console.log('being called heer')
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
    const { data } = await openai.beta.threads.runs.steps.list(
      thread_id,
      run_id
    )
    // wait 3 seconds and check the run status again
    const completedSteps = data.find(step => step.status === 'completed')

    if (completedSteps) {
      await loadMessages()
    } else {
      setTimeout(() => {
        checkRunStatus(run_id)
      }, 3000)
    }
  }

  const appendMessage = async (message: any) => {
    setMessages(prev => [...prev, message])
    await openai.beta.threads.messages.create(thread_id, message)
    return
  }

  const onFormSubmit = async () => {
    if (loading) {
      console.log('there is still a run in progress')
      return
    }
    const run_id = await createRun()

    // TODO: check the reason why the run is not returning anything
    if (run_id) await checkRunStatus(run_id as string)
  }

  const createThread = async () => {
    const thread = await openai.beta.threads.create()
    setValue('the_math_teacher_thread', JSON.stringify(thread))
    return thread
  }

  const clearAll = useCallback(() => {
    setAssistant(null)
    clearAssistant()
  }, [])

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
