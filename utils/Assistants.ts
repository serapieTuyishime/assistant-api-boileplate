import { openai } from '@/config/openai'

export async function createAssistant() {
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
  console.log(myAssistant)
}

export async function getAssistant() {
  try {
    const assistantFromLocalStorage = localStorage.getItem(
      'the_math_teacher_assistant'
    )
    if (assistantFromLocalStorage) {
      const localObject = await JSON.parse(assistantFromLocalStorage)
      return localObject
    }
    if (!assistantFromLocalStorage) {
      const myAssistant = await openai.beta.assistants.retrieve(
        'asst_3Jol7xISnUlSRV1sFe5NFnuL'
      )
      return myAssistant
    }
  } catch (err) {
    console.log('error within retrieving the assistant')
    return
  }
}
