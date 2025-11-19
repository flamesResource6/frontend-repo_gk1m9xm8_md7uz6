import { useEffect, useRef, useState } from 'react'

export default function Player({ src, markers, onAddMarker, onSeek }) {
  const audioRef = useRef(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [label, setLabel] = useState('')
  const [count, setCount] = useState('')

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const timeHandler = () => setCurrentTime(audio.currentTime)
    const loaded = () => setDuration(audio.duration || 0)

    audio.addEventListener('timeupdate', timeHandler)
    audio.addEventListener('loadedmetadata', loaded)
    return () => {
      audio.removeEventListener('timeupdate', timeHandler)
      audio.removeEventListener('loadedmetadata', loaded)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play()
    else audio.pause()
  }

  const format = (s) => {
    if (!isFinite(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60).toString().padStart(2, '0')
    return `${m}:${sec}`
  }

  const handleAdd = () => {
    if (!audioRef.current) return
    onAddMarker({ time: Number(currentTime.toFixed(2)), label: label || null, count: count ? Number(count) : null })
    setLabel('')
    setCount('')
  }

  return (
    <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
      <audio ref={audioRef} src={src || ''} preload="metadata" />

      <div className="flex items-center gap-3 mb-3">
        <button onClick={togglePlay} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
          Play/Pause
        </button>
        <div className="text-blue-200">{format(currentTime)} / {format(duration)}</div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.01}
          value={currentTime}
          onChange={(e) => {
            const t = Number(e.target.value)
            audioRef.current.currentTime = t
            setCurrentTime(t)
            onSeek?.(t)
          }}
          className="w-full accent-blue-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (Verse, Chorus, Kick)"
          className="bg-slate-900 text-white px-3 py-2 rounded border border-slate-700 focus:border-blue-500 w-full"
        />
        <input
          value={count}
          onChange={(e) => setCount(e.target.value)}
          placeholder="8-count"
          className="bg-slate-900 text-white px-3 py-2 rounded border border-slate-700 focus:border-blue-500 w-28"
        />
        <button onClick={handleAdd} className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded">
          Add Marker
        </button>
      </div>

      {markers?.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
          {markers.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between bg-slate-900/60 border border-slate-700 rounded p-2">
              <div className="text-blue-100 text-sm">
                <span className="font-mono text-blue-300 mr-2">{m.time.toFixed(2)}s</span>
                {m.label && <span className="mr-2">{m.label}</span>}
                {m.count && <span className="text-blue-400">#{m.count}</span>}
              </div>
              <button
                onClick={() => {
                  if (!audioRef.current) return
                  audioRef.current.currentTime = m.time
                  setCurrentTime(m.time)
                  onSeek?.(m.time)
                }}
                className="text-xs text-white/80 hover:text-white underline"
              >
                Jump
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
