import * as React from 'react'
export const useLocalStorage = (): {
  setValue: (key: string, value: string) => void
  clearAssistant: () => void
  getValue: (key: string) => Promise<string>
  apiKey: string
  assistantId: string
} => {
  const [apiKey, setApiKey] = React.useState('')
  const [assistantId, setAssistantId] = React.useState('')
  const setValue = (key: string, value: string) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  const getValue = async (key: string) => {
    const value = localStorage.getItem(key)
    if (!value) return
    const JsonValue = await JSON.parse(value)
    return JsonValue
  }

  const clearAssistant = () => {
    window.localStorage.setItem('the_assistant_id', '')
    window.localStorage.setItem('assistant_api_key', '')
    window.localStorage.setItem('the_math_teacher_thread', '')
  }

  React.useEffect(() => {
    const thing = async () => {
      const apiKey = await getValue('assistant_api_key')
      const assistantId = await getValue('the_assistant_id')
      setApiKey(apiKey)
      setAssistantId(assistantId)
    }
    thing()
  }, [])
  return { setValue, clearAssistant, getValue, apiKey, assistantId }
}
