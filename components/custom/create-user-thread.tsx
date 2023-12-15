'use client'

export const ClearThread = () => {
  const clearStorage = () => {
    window.localStorage.removeItem('the_assistant_id')
    window.localStorage.removeItem('the_assistant_thread')
  }
  return (
    <span
      className="m-2 cursor-pointer rounded-md border border-white p-2"
      onClick={() => clearStorage()}
    >
      Delete saved asistant
    </span>
  )
}
