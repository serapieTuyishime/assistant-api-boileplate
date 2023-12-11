'use client'
import { useOpenAi } from '@/lib/hooks/useOpenAi'

export default function CreateAssistant() {
  const { assistant, getAssistant } = useOpenAi()

  return (
    <>
      {assistant ? (
        <>
          <span className="font-bold text-2xl px-4 py-1 cursor-pointer">
            {assistant.name} Assistant
          </span>
        </>
      ) : (
        <>
          <span
            className="bg-lime-400 px-4 py-1 cursor-pointer"
            onClick={() => getAssistant()}
          >
            Create assistant
          </span>
        </>
      )}
    </>
  )
}
