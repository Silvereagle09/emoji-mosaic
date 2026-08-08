// PolaroidCollage.jsx
// Polaroid-style collage builder — queued emoji photos with captions
import { toPng } from 'html-to-image'

import { useRef, useState } from 'react'

const ROTATIONS = [-4, 2, -2, 5, -3, 3]
const BG_COLORS = ['#FFF0F5', '#F0F8FF', '#FFFDE7', '#F5F0FF']

export default function PolaroidCollage({ photos, onRemove }) {
  const [captions, setCaptions] = useState({})
  const collageRef = useRef(null)

  const handleCaption = (id, val) => {
    setCaptions((prev) => ({ ...prev, [id]: val }))
  }

  const handleExport = async () => {
    if (!collageRef.current || !photos || photos.length === 0) return

    try {
      const dataUrl = await toPng(collageRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#FFF5EE',
        filter: (node) => {
          if (
            node instanceof HTMLElement &&
            node.dataset?.exportIgnore === 'true'
          ) {
            return false
          }

          return true
        },
      })

      const link = document.createElement('a')
      link.download = 'emosaic-collage.png'
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to export collage:', error)
    }
  }

  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        {/* Dummy placeholder - replace with actual cat image */}
        <img src="disappointed.png" className="w-30 h-30"/>
        <p className="pixel-font text-[8px] text-[#C0A0A0] leading-5">
          NO PHOTOS YET!<br />EMOJIFY SOME FIRST
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Collage preview */}
      <div
        ref={collageRef}
        className="relative grid-bg rounded-2xl border-2 border-[#FFB7C5] p-6 min-h-48"
      >
        <div className="flex flex-wrap gap-4 justify-center">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className="relative flex flex-col items-center"
              style={{
                transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)`,
              }}
            >
              {/* Polaroid frame */}
              <div
                className="rounded-sm border-2 border-[#3D2B3D] window-shadow"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                {/* Photo area */}
                <div
                  className="w-28 h-28 m-3 mb-1 rounded-sm overflow-hidden border border-[#E0D0D0]"
                  style={{ backgroundColor: BG_COLORS[i % BG_COLORS.length] }}
                >
                  {photo.previewUrl ? (
                    <img src={photo.previewUrl} alt="emoji result" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {/* Dummy cat - replace with emoji canvas snapshot */}
                      🐱
                    </div>
                  )}
                </div>

                {/* Caption */}
                <input
                  value={captions[photo.id] || ''}
                  onChange={(e) => handleCaption(photo.id, e.target.value)}
                  placeholder="add caption..."
                  maxLength={20}
                  className="w-full px-2 pb-2 text-center text-[10px] font-bold text-[#3D2B3D] bg-transparent outline-none placeholder:text-[#C0B0B0] font-[Nunito]"
                />
              </div>

              {/* Remove button */}
              <button
                data-export-ignore="true"
                onClick={() => onRemove(photo.id)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#FF6B6B] border border-[#3D2B3D] text-white text-xs flex items-center justify-center cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Export button */}
      <button
        onClick={handleExport}
        className="w-full py-3 rounded-2xl border-2 border-[#3D2B3D] bg-[#FFB7C5] pixel-font text-[8px] text-[#3D2B3D] cursor-pointer transition-all hover:translate-y-[-2px]"
        style={{ boxShadow: '3px 3px 0px #3D2B3D' }}
      >
        DOWNLOAD COLLAGE
      </button>
    </div>
  )
}