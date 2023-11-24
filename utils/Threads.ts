import { openai } from '@/config/openai'

export async function createThread() {
  const thread = await openai.beta.threads.create()
  localStorage.setItem('the_math_teacher_thread', JSON.stringify(thread))
  console.log('this is the thread', thread)
  return thread
}

export async function getThreads() {
  const localThreads = localStorage.getItem('the_math_teacher_thread')
  if (localThreads) return await JSON.parse(localThreads)
  else return
}
