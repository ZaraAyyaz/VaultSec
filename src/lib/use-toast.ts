import { useState, useCallback } from 'react'
import type { ToastProps } from '@/components/ui/toast'

type ToastParams = {
  title: string
  description?: string
  variant?: ToastProps['variant']
}

type Toast = ToastParams & { id: string; open: boolean }

let count = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((params: ToastParams) => {
    const id = String(++count)
    setToasts((prev) => [...prev, { ...params, id, open: true }])
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, open: false } : t)))
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    }, 4000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, open: false } : t)))
  }, [])

  return { toasts, toast, dismiss }
}

export type { Toast, ToastParams }
