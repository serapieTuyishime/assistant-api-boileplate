export const useLocalStorage = (): {
  setValue: (key: string, value: string) => void
  clearAssistant: () => void
  getValue: (key: string) => string
} => {
  const setValue = (key: string, value: string) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  const getValue = (key: string) => {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : ''
  }
  const clearAssistant = () => {
    window.localStorage.setItem('the_math_teacher_assistant', '')
    window.localStorage.setItem('the_math_teacher_thread', '')
    window.localStorage.setItem('assistant_api_key', '')
  }
  return { setValue, clearAssistant, getValue }
}
