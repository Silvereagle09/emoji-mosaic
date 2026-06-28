// App.jsx
// Root component — layout, tab navigation, state wiring

import { useState } from 'react'
import FloatingStickers from './components/FloatingStickers.jsx'
import RetroWindow from './components/RetroWindow.jsx'
import ThemePicker from './components/ThemePicker.jsx'
import UploadZone from './components/UploadZone.jsx'
import SliderControl from './components/SliderControl.jsx'
import EmojiCanvas from './components/EmojiCanvas.jsx'
import LoadingWindow from './components/LoadingWindow.jsx'
import WebcamCapture from './components/WebcamCapture.jsx'
import PolaroidCollage from './components/PolaroidCollage.jsx'
import { useEmojify } from './hooks/useEmojify.js'

const TABS = [
  { id: 'emojify', label: 'EMOJIFY', emoji: '✨' },
  { id: 'collage', label: 'COLLAGE', emoji: '🎀' },
]

const THEME_BG = {
  pastel: { bg: '#FFF5EE', line: '#F5E0D8' },
  spooky: { bg: '#1A1025', line: '#2D1F3D' },
  ocean:  { bg: '#EFF8FF', line: '#C8E8FF' },
  y2k:    { bg: '#FFFCE8', line: '#F0E880' },
}

// Demo grid — remove when backend is connected
const DEMO_GRID = Array.from({ length: 30 }, (_, row) =>
  Array.from({ length: 25 }, (_, col) => {
    const opts = ['🌸', '🍡', '🎀', '🫧', '🐣', '🌷', '🍓', '🐱', '✨', '💕']
    return opts[Math.floor(Math.random() * opts.length)]
  })
)

export default function App() {
  const [tab, setTab] = useState('emojify')
  const [theme, setTheme] = useState('pastel')
  const [resolution, setResolution] = useState(40)
  const [chaos, setChaos] = useState(30)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [showWebcam, setShowWebcam] = useState(false)
  const [collagePhotos, setCollagePhotos] = useState([])
  const [showDemo, setShowDemo] = useState(false)

  const { emojify, loading, progress, result, error, reset } = useEmojify()

  const handleImageSelect = (url, file) => {
    setImagePreview(url)
    setImageFile(file)
    reset()
    setShowDemo(false)
  }

  const handleWebcamCapture = (url, blob) => {
    setShowWebcam(false)
    const file = new File([blob], 'webcam.jpg', { type: 'image/jpeg' })
    handleImageSelect(url, file)
  }

  const handleEmojify = () => {
    if (!imageFile) return
    emojify({ file: imageFile, theme, resolution, chaos })
  }

  const handleDemo = () => {
    setShowDemo(true)
    reset()
  }

  const handleAddToCollage = () => {
    if (!imagePreview) return
    const id = Date.now().toString()
    setCollagePhotos((prev) => [...prev.slice(-3), { id, previewUrl: imagePreview }])
    setTab('collage')
  }

  const activeGrid = result || (showDemo ? DEMO_GRID : null)

  const themeBg = THEME_BG[theme] || THEME_BG.pastel
  const bgStyle = {
    backgroundColor: themeBg.bg,
    backgroundImage: `linear-gradient(${themeBg.line} 1px, transparent 1px), linear-gradient(90deg, ${themeBg.line} 1px, transparent 1px)`,
    backgroundSize: '32px 32px',
    transition: 'background-color 0.5s ease',
  }

  const isDark = theme === 'spooky'
  const titleColor = isDark ? '#F0D0FF' : '#3D2B3D'
  const subtitleColor = isDark ? '#9B7AB0' : '#B0A0A0'

  return (
    <div className="min-h-screen relative" style={bgStyle}>
      <FloatingStickers theme={theme} />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-6 flex flex-col gap-5">

        {/* Header */}
        <div className="text-center flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            {/* Replace with <img src="/cats/logo-cat.png" className="w-10 h-10" /> */}
            <span className="text-4xl sticker-float">🐱</span>
            <h1 className="pixel-font text-xl leading-none" style={{ color: titleColor }}>
              EMOJIFY
            </h1>
            <span className="text-4xl sticker-float-slow" style={{ animationDelay: '0.5s' }}>✨</span>
          </div>
          <p className="text-sm font-semibold" style={{ color: subtitleColor }}>
            turn your photos into cute emoji mosaics
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 p-1 rounded-2xl border-2 border-[#FFB7C5] bg-white window-shadow">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl pixel-font text-[8px] transition-all cursor-pointer"
              style={{
                backgroundColor: tab === t.id ? '#FFB7C5' : 'transparent',
                color: tab === t.id ? '#3D2B3D' : '#C0A0A0',
                boxShadow: tab === t.id ? '2px 2px 0px #3D2B3D' : 'none',
              }}
            >
              <span className="text-sm">{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Emojify tab */}
        {tab === 'emojify' && (
          <div className="flex flex-col gap-4">

            {/* Theme picker window */}
            <RetroWindow title="THEME.EXE" color="yellow">
              <div className="p-3">
                <ThemePicker selected={theme} onChange={setTheme} />
              </div>
            </RetroWindow>

            {/* Upload window */}
            <RetroWindow title="UPLOAD.EXE" color="pink">
              <div className="p-3">
                {imagePreview ? (
                  <div className="flex flex-col gap-3">
                    {/* Preview */}
                    <div className="relative rounded-xl overflow-hidden border-2 border-[#FFB7C5] bg-[#FFF0F5]">
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-full h-44 object-cover"
                      />
                      <button
                        onClick={() => { setImagePreview(null); setImageFile(null); reset(); setShowDemo(false) }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#FF6B6B] border border-[#3D2B3D] text-white text-xs flex items-center justify-center cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                    <p className="pixel-font text-[7px] text-[#C0A0A0] text-center">PHOTO READY ✓</p>
                  </div>
                ) : (
                  <UploadZone
                    onImageSelect={handleImageSelect}
                    onWebcam={() => setShowWebcam(true)}
                  />
                )}
              </div>
            </RetroWindow>

            {/* Controls window */}
            <RetroWindow title="SETTINGS.EXE" color="blue">
              <div className="p-4 flex flex-col gap-5">
                <SliderControl
                  label="Resolution"
                  value={resolution}
                  min={10}
                  max={80}
                  onChange={setResolution}
                  leftEmoji="🔲"
                  rightEmoji="🔳"
                  leftLabel="chunky"
                  rightLabel="detailed"
                  color="#4FACFE"
                />
                <SliderControl
                  label="Chaos"
                  value={chaos}
                  min={0}
                  max={100}
                  onChange={setChaos}
                  leftEmoji="😌"
                  rightEmoji="🤪"
                  leftLabel="accurate"
                  rightLabel="chaotic"
                  color="#FF8FAB"
                />
              </div>
            </RetroWindow>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleEmojify}
                disabled={!imageFile || loading}
                className="flex-1 py-3 rounded-2xl border-2 border-[#3D2B3D] bg-[#FFB7C5] pixel-font text-[9px] text-[#3D2B3D] cursor-pointer disabled:opacity-40 transition-all hover:translate-y-[-2px]"
                style={{ boxShadow: '4px 4px 0px #3D2B3D' }}
              >
                ✨ EMOJIFY!
              </button>
              <button
                onClick={handleDemo}
                className="px-4 py-3 rounded-2xl border-2 border-[#E0D0D0] bg-white pixel-font text-[9px] text-[#B0A0A0] cursor-pointer transition-all hover:translate-y-[-1px]"
                style={{ boxShadow: '3px 3px 0px #E0D0D0' }}
              >
                DEMO
              </button>
            </div>

            {/* Error */}
            {error && (
              <RetroWindow title="ERROR.EXE" color="pink">
                <div className="p-4 text-center">
                  <p className="pixel-font text-[8px] text-red-400 leading-5">{error}</p>
                </div>
              </RetroWindow>
            )}

            {/* Result */}
            {activeGrid && (
              <RetroWindow title="RESULT.EXE" color="purple">
                <div className="p-4">
                  <EmojiCanvas grid={activeGrid} />
                </div>
              </RetroWindow>
            )}

          </div>
        )}

        {/* Collage tab */}
        {tab === 'collage' && (
          <RetroWindow title="COLLAGE.EXE" color="purple">
            <div className="p-4">
              <PolaroidCollage
                photos={collagePhotos}
                onRemove={(id) => setCollagePhotos((prev) => prev.filter((p) => p.id !== id))}
              />
            </div>
          </RetroWindow>
        )}

      </div>

      {/* Modals */}
      {loading && <LoadingWindow progress={Math.round(progress)} />}
      {showWebcam && (
        <WebcamCapture
          onCapture={handleWebcamCapture}
          onClose={() => setShowWebcam(false)}
        />
      )}
    </div>
  )
}
