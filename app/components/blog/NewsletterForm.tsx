'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="border border-zinc-800 rounded-xl p-6 mt-16">
      <p className="font-mono text-[11px] text-zinc-600 uppercase tracking-wide mb-2">
        Newsletter
      </p>
      <h3 className="text-[18px] font-semibold text-white tracking-tight mb-1">
        Recibe los próximos posts
      </h3>
      <p className="text-[14px] text-zinc-500 mb-5">
        Sin spam. Solo cuando publique algo nuevo.
      </p>

      {status === 'success' ? (
        <p className="text-[14px] text-green-500">
          Suscrito correctamente.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-[14px] text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-white text-zinc-900 text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 whitespace-nowrap sm:w-auto w-full"
          >
            {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-[13px] text-red-500 mt-2">
          Algo salió mal. Intenta de nuevo.
        </p>
      )}
    </div>
  )
}
