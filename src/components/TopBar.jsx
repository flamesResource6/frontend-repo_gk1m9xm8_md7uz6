import { useState } from 'react'

export default function TopBar({ onCreate }) {
  const [title, setTitle] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [bpm, setBpm] = useState('')

  return (
    <div className="w-full bg-slate-900/70 border-b border-slate-800 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <span className="text-white font-semibold">Dance Builder</span>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Choreography title"
            className="bg-slate-800/80 text-white px-3 py-2 rounded outline-none border border-slate-700 focus:border-blue-500"
          />
          <input
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="Audio URL (mp3/ogg)"
            className="bg-slate-800/80 text-white px-3 py-2 rounded outline-none border border-slate-700 focus:border-blue-500"
          />
          <div className="flex items-center gap-2">
            <input
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
              placeholder="BPM (optional)"
              className="bg-slate-800/80 text-white px-3 py-2 rounded outline-none border border-slate-700 focus:border-blue-500 w-full"
            />
            <button
              onClick={() => onCreate({ title, audio_url: audioUrl || null, bpm: bpm ? Number(bpm) : null })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
