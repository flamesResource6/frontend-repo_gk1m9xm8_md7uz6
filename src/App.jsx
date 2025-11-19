import { useCallback, useState } from 'react'
import TopBar from './components/TopBar'
import Player from './components/Player'
import ChoreoList from './components/ChoreoList'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [current, setCurrent] = useState(null)
  const [markers, setMarkers] = useState([])

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const handleCreate = async (payload) => {
    if (!payload.title) return alert('Please add a title')
    try {
      const res = await fetch(`${baseUrl}/api/choreographies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Failed to create')
      const data = await res.json()
      setRefreshKey((k) => k + 1)
      // Auto select new item
      setCurrent({ _id: data.id, ...payload, markers: [] })
      setMarkers([])
    } catch (e) {
      alert(e.message)
    }
  }

  const onSelect = useCallback((item) => {
    setCurrent(item)
    setMarkers(item.markers || [])
  }, [])

  const addMarker = (m) => {
    const updated = [...markers, m].sort((a, b) => a.time - b.time)
    setMarkers(updated)
    if (current?._id) {
      // persist markers
      fetch(`${baseUrl}/api/choreographies/${current._id}/markers`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markers: updated })
      }).catch(console.error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <TopBar onCreate={handleCreate} />

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="text-xl font-semibold">{current ? current.title : 'Create or select a choreography'}</div>
          <Player
            src={current?.audio_url}
            markers={markers}
            onAddMarker={addMarker}
          />
        </div>
        <div>
          <ChoreoList onSelect={onSelect} refreshKey={refreshKey} />
          <div className="mt-4 text-xs text-blue-300/70">
            Tip: Paste a direct audio URL (mp3/ogg). You can add labeled markers while listening, then jump to them instantly.
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
