import React, { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

let toastId = 0

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const iconMap = {
  success: <CheckCircle size={18} className="text-emerald-600 mt-0.5 shrink-0" />,
  error:   <AlertCircle size={18} className="text-red-500 mt-0.5 shrink-0" />,
  info:    <Info size={18} className="text-amber-600 mt-0.5 shrink-0" />,
}

const borderMap = {
  success: 'border-l-emerald-500',
  error:   'border-l-red-500',
  info:    'border-l-amber-500',
}

const Toast = ({ toast, onRemove }) => (
  <div
    className={`toast-item ${borderMap[toast.type] || 'border-l-amber-500'}`}
    style={{ borderLeftColor: undefined }}
  >
    {iconMap[toast.type] || iconMap.info}
    <p className="flex-1 text-sm font-medium text-stone-800 leading-5">{toast.message}</p>
    <button
      onClick={() => onRemove(toast.id)}
      className="shrink-0 text-stone-400 hover:text-stone-700 transition-colors mt-0.5"
      aria-label="Dismiss notification"
    >
      <X size={15} />
    </button>
  </div>
)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx.addToast
}

export default ToastProvider
