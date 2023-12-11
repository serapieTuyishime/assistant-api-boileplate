import { openai } from '@/config/openai'
import { Message } from 'ai'
import { Assistant } from 'openai/resources/beta/assistants/assistants'
import { useEffect, useState } from 'react'
import { useLocalStorage } from './use-local-storage'

export type CustomMessage = Message & {
  createdAt: Date
}
const thread_id = 'thread_eznxPsCmoTeOKfALK8YgJHG8'
const assistant_id = 'asst_3Jol7xISnUlSRV1sFe5NFnuL'
export function useOpenAi() {
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<CustomMessage[]>([])
  const [assistant, setAssistant] = useState<Assistant>()
  const [assistantId, setAssistantID] = useState<string>('')
  const { getValue } = useLocalStorage()
  const createRun = async () => {
    setLoading(true)
    try {
      const run = await openai.beta.threads.runs.create(thread_id, {
        assistant_id: assistant_id,
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

  const sanitizeRunData = async () => {
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

  async function getAssistant() {
    try {
      //this will store the assistant id
      const assistantFromLocalStorage = getValue('the_math_teacher_assistant')
      return assistantFromLocalStorage
    } catch (err) {
      return
    }
  }

  async function createAssistant() {
    const myAssistant = await openai.beta.assistants.create({
      instructions:
        'You are a personal math tutor. When asked a question, write and run Python code to answer the question.',
      name: 'Math Tutor',
      tools: [{ type: 'code_interpreter' }],
      model: 'gpt-4'
    })
    localStorage.setItem(
      'the_math_teacher_assistant',
      JSON.stringify(myAssistant)
    )
    return myAssistant
  }

  let count = 0
  const checkRunStatus = async (run_id: string) => {
    const { data } = await openai.beta.threads.runs.steps.list(
      thread_id,
      run_id
    )
    // wait 3 seconds and check the run status again
    const completedSteps = data.find(step => step.status === 'completed')
    count++

    if (completedSteps) {
      console.log('called this many times before results', count)
      await sanitizeRunData()
    } else {
      setTimeout(() => {
        checkRunStatus(run_id)
      }, 3000)
    }
  }
  const getThreads = async () => {
    const localThreads = localStorage.getItem('the_math_teacher_thread')
    if (localThreads) return await JSON.parse(localThreads)
    else return createThread()
  }

  const appendMessage = async (message: any) => {
    let thread = await getThreads()
    await openai.beta.threads.messages.create(thread.id, message)
    return
  }

  const retrieveMessagesByThread = async () => {
    let thread = await getThreads()
    const threadMessages = await openai.beta.threads.messages.list(thread.id)
    return threadMessages
  }

  const onFormSubmit = async () => {
    if (loading) {
      console.log('there is still a run in progress')
      return
    }
    const run_id = await createRun()
    await checkRunStatus(run_id as string)
  }

  const createThread = async () => {
    const thread = await openai.beta.threads.create()
    localStorage.setItem('the_math_teacher_thread', JSON.stringify(thread))
    return thread
  }

  useEffect(() => {
    getAssistant()
    sanitizeRunData()
  }, [])

  return {
    loading,
    onFormSubmit,
    messages,
    getAssistant,
    createAssistant,
    appendMessage,
    getThreads,
    assistant,
    assistantId,
    retrieveMessagesByThread
  }
}
