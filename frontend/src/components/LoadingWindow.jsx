// LoadingWindow.jsx
// Retro OS-style loading dialog shown while backend processes the image

const LOADING_MESSAGES = [
  'sprinkling emojis...',
  'petting cats...',
  'adding sparkles...',
  'making it cute...',
  'almost done ✨',
]

export default function LoadingWindow({ progress = 0 }) {
  const msgIndex = Math.floor((progress / 100) * (LOADING_MESSAGES.length - 1))
  const message = LOADING_MESSAGES[Math.min(msgIndex, LOADING_MESSAGES.length - 1)]

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255,240,245,0.7)', backdropFilter: 'blur(2px)' }}>
      <div className="w-72 rounded-2xl border-2 border-[#3D2B3D] window-shadow bg-white overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#B8E0FF] border-b-2 border-[#3D2B3D]">
          <div className="flex gap-1.5">
            {['#FF6B6B', '#FFD93D', '#6BCB77'].map((c, i) => (
              <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span className="pixel-font text-[8px] text-[#3D2B3D] ml-1">EMOJIFYING...</span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 items-center">
          {/* Dummy loading cat - replace with actual cat image */}
          <div className="w-16 h-16 rounded-xl bg-[#FFF0F5] border-2 border-[#FFB7C5] flex items-center justify-center">
            <span className="text-3xl sticker-float-fast">🐱</span>
          </div>

          <p className="pixel-font text-[8px] text-[#3D2B3D] text-center leading-5">{message}</p>

          {/* Loading bar */}
          <div className="w-full h-5 rounded-lg border-2 border-[#3D2B3D] overflow-hidden bg-[#FFF0F5]">
            <div
              className="h-full loading-bar transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="pixel-font text-[8px] text-[#FFB7C5]">{progress}%</span>
        </div>
      </div>
    </div>
  )
}
