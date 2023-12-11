'use client'
import { useOpenAi } from '@/lib/hooks/useOpenAi'

export default function CreateAssistant() {
  const { assistantId } = useOpenAi()

  return (
    <>
      {assistantId ? (
        <>
          <span className="font-bold text-2xl px-4 py-1 cursor-pointer">
            {assistantId} Assistant
          </span>
        </>
      ) : (
        <>No assistant</>
      )}
    </>
  )
}
