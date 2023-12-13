'use client'
import { useOpenAi } from '@/lib/hooks/useOpenAi'

export default function CreateAssistant() {
  const { assistant } = useOpenAi()
  return (
    <>
      {assistant ? (
        <>
          <span className="font-bold text-2xl px-4 py-1 cursor-pointer">
            {assistant.name} Assistant
          </span>
        </>
      ) : (
        <>No assistant</>
      )}
    </>
  )
}
