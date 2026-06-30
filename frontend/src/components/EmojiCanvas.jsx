import { useEffect, useRef } from 'react'

const EMOJI_SIZE = 14 // px per emoji tile

export default function EmojiCanvas({ grid, width, height }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!grid || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const cols = grid[0]?.length || 0
    const rows = grid.length

    canvas.width = cols * EMOJI_SIZE
    canvas.height = rows * EMOJI_SIZE

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${EMOJI_SIZE}px "Twemoji Mozilla", "Noto Color Emoji", sans-serif`
    ctx.textBaseline = 'top'

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const emoji = grid[row][col]
        ctx.fillText(emoji, col * EMOJI_SIZE, row * EMOJI_SIZE)
      }
    }
  }, [grid])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'emojify-result.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Canvas wrapper with cute border */}
      <div className="rounded-2xl border-2 border-[#FFB7C5] overflow-hidden window-shadow">
        <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%' }} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#3D2B3D] bg-[#FFB7C5] pixel-font text-[8px] text-[#3D2B3D] cursor-pointer transition-all hover:translate-y-[-2px]"
          style={{ boxShadow: '3px 3px 0px #3D2B3D' }}
        >
          SAVE PNG
        </button>

        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#3D2B3D] bg-[#B8E0FF] pixel-font text-[8px] text-[#3D2B3D] cursor-pointer transition-all hover:translate-y-[-2px]"
          style={{ boxShadow: '3px 3px 0px #3D2B3D' }}
        >
          ADD TO COLLAGE
        </button>
      </div>
    </div>
  )
}
