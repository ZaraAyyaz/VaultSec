import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast'
import { useToast } from '@/lib/use-toast'
import Overview from '@/pages/Overview'
import Threats from '@/pages/Threats'
import Assets from '@/pages/Assets'
import Logs from '@/pages/Logs'
import Alerts from '@/pages/Alerts'
import Settings from '@/pages/Settings'

export function App() {
  const { toasts, dismiss } = useToast()

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/threats" element={<Threats />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
        <ToastViewport>
          {toasts.map((t) => (
            <Toast key={t.id} open={t.open} onOpenChange={() => dismiss(t.id)} variant={t.variant}>
              <div>
                <ToastTitle>{t.title}</ToastTitle>
                {t.description && <ToastDescription>{t.description}</ToastDescription>}
              </div>
              <ToastClose />
            </Toast>
          ))}
        </ToastViewport>
      </ToastProvider>
    </BrowserRouter>
  )
}
