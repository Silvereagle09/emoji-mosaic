// useEmojify.js
// Custom hook — handles API call to backend, loading state, result

import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function useEmojify() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null) // 2D emoji grid
  const [error, setError] = useState(null)

  const emojify = async ({ file, theme, resolution, chaos }) => {
    setLoading(true)
    setProgress(0)
    setError(null)
    setResult(null)

    // Fake progress ticks while waiting (real progress needs SSE/websocket)
    const tick = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 85))
    }, 400)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('theme', theme)
      formData.append('resolution', resolution)
      formData.append('chaos', chaos/100)

      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)

      const data = await res.json()
      setProgress(100)
      setResult(data.grid) // expected: { grid: [["🌸","🍡",...], ...] }
    } catch (err) {
      setError(err.message)
    } finally {
      clearInterval(tick)
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
    setProgress(0)
  }

  return { emojify, loading, progress, result, error, reset }
}
