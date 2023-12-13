'use client'
import { useOpenAi } from '@/lib/hooks/useOpenAi'

export default function CreateAssistant() {
  const { assistant } = useOpenAi()
  return (
    <>
      {assistant ? (
        <>
          <span className="cursor-pointer px-4 py-1 text-2xl font-bold">
            {assistant.name} Assistant
          </span>
        </>
      ) : (
        <>No assistant</>
      )}
    </>
  )
}
