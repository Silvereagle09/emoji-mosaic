// UploadZone.jsx
// Drag-and-drop upload area with kawaii styling and webcam option

import { useRef, useState } from 'react'

export default function UploadZone({ onImageSelect, onWebcam }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    onImageSelect(url, file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  const handleChange = (e) => {
    handleFile(e.target.files[0])
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        className="relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all"
        style={{
          borderColor: dragging ? '#FF8FAB' : '#FFB7C5',
          backgroundColor: dragging ? '#FFF0F5' : '#FFFAFA',
        }}
      >
        <div className="w-30 h-30 rounded-2xl border-2 border-[#FFB7C5] bg-[#FFF0F5] flex items-center justify-center overflow-hidden">
          <img src="upload_cat.png" alt="upload cat" />
        </div>

        <div className="text-center">
          <p className="pixel-font text-[8px] text-[#3D2B3D] mb-1">DROP PHOTO HERE</p>
          <p className="text-xs text-[#B0A0A0] font-semibold">or click to browse</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-[#F0E0E0]" />
        <span className="pixel-font text-[7px] text-[#C0A0A0]">OR</span>
        <div className="flex-1 h-px bg-[#F0E0E0]" />
      </div>

      {/* Webcam button */}
      <button
        onClick={onWebcam}
        className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 border-[#B8E0FF] bg-[#F0F8FF] btn-shadow transition-all hover:translate-y-[-2px] active:translate-y-[1px] active:shadow-none cursor-pointer"
        style={{ boxShadow: '3px 3px 0px #B8E0FF' }}
      >
        <span className="pixel-font text-[8px] text-[#3D2B3D]">SNAP PHOTO</span>
      </button>
    </div>
  )
}
