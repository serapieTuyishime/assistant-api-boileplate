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
