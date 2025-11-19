import { useEffect, useState } from 'react'

export default function ChoreoList({ onSelect, refreshKey }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
        const res = await fetch(`${baseUrl}/api/choreographies`)
        const data = await res.json()
        setItems(data.items || [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [refreshKey])

  return (
    <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
      <div className="text-white font-semibold mb-2">Your Choreographies</div>
      {loading ? (
        <div className="text-blue-200">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-blue-300/80">No choreographies yet</div>
      ) : (
        <div className="space-y-2">
          {items.map((it) => (
            <button
              key={it._id}
              onClick={() => onSelect(it)}
              className="w-full text-left bg-slate-900/60 border border-slate-700 hover:border-blue-500 text-blue-100 rounded p-3"
            >
              <div className="font-medium">{it.title}</div>
              {it.bpm && <div className="text-xs text-blue-300">{it.bpm} bpm</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
