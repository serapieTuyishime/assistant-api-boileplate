'use client'

import { getAssistantById, getValue } from '@/lib/utils/assistant'
import { Assistant } from 'openai/resources/beta/assistants/assistants'
import { useCallback, useEffect, useState } from 'react'

export default function CreateAssistant() {
  const [assistant, setAssistant] = useState<Assistant | null>(null)
  const loadAssistant = useCallback(async () => {
    try {
      const assistantId = await getValue('the_assistant_id')
      console.log('the found assitant from the locals torage', assistantId)
      if (assistantId) {
        const assistant = await getAssistantById(assistantId)
        if (!assistant) return
        setAssistant(assistant)
      }
    } catch (err) {
      console.log('error in fetching the assitant')
    }
  }, [])

  useEffect(() => {
    if (!assistant) loadAssistant()
  }, [assistant, loadAssistant])
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
