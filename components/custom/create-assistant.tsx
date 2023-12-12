'use client'
import { useOpenAi } from '@/lib/hooks/useOpenAi'
import { useEffect } from 'react'

export default function CreateAssistant() {
  const { assistant } = useOpenAi()
  useEffect(() => {
    console.log('the assistant is changing in the component', assistant)
  }, [assistant])
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
