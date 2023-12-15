import * as React from 'react'
export const useLocalStorage = (): {
  setValue: (key: string, value: string) => void
  clearAssistant: () => void
  getValue: (key: string) => Promise<string>
  thread: string
  assistantId: string
} => {
  const [thread, setThread] = React.useState('')
  const [assistantId, setAssistantId] = React.useState('')
  const setValue = React.useCallback((key: string, value: string) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [])

  const getValue = async (key: string) => {
    const value = window.localStorage.getItem(key)
    if (!value) return
    const JsonValue = await JSON.parse(JSON.stringify(value))
    return JsonValue
  }

  const clearAssistant = () => {
    window.localStorage.removeItem('the_assistant_id')
    window.localStorage.removeItem('the_assistant_thread')
  }

  React.useEffect(() => {
    const thing = async () => {
      const assistantId = await getValue('the_assistant_id')
      const thread = await await getValue('the_assistant_thread')
      setThread(thread)
      setAssistantId(assistantId)
    }
    thing()
  }, [setValue])

  return { setValue, clearAssistant, getValue, assistantId, thread }
}
