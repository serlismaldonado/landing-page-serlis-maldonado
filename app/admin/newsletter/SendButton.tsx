'use client'

import { useState } from 'react'

export function SendButton({ slug, title }: { slug: string; title: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  async function handleSend() {
    if (!confirm(`¿Enviar "${title}" a todos los suscriptores?`)) return

    setStatus('loading')

    const res = await fetch('/api/send-newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    })

    setStatus(res.ok ? 'sent' : 'error')
  }

  if (status === 'sent') {
    return (
      <span className="font-mono text-[11px] text-green-500 shrink-0">
        Enviado ✓
      </span>
    )
  }

  if (status === 'error') {
    return (
      <button
        onClick={handleSend}
        className="font-mono text-[11px] text-red-500 shrink-0 hover:text-red-400"
      >
        Error — reintentar
      </button>
    )
  }

  return (
    <button
      onClick={handleSend}
      disabled={status === 'loading'}
      className="shrink-0 text-[12px] font-medium bg-white text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
    >
      {status === 'loading' ? 'Enviando...' : 'Enviar'}
    </button>
  )
}
