// WebcamCapture.jsx
// Live webcam modal — shows stream, snap button, sends frame to parent

import { useEffect, useRef, useState } from 'react'

export default function WebcamCapture({ onCapture, onClose }) {
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    let stream
    navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
      stream = s
      if (videoRef.current) {
        videoRef.current.srcObject = s
        videoRef.current.play()
        setReady(true)
      }
    }).catch(() => {
      alert('Camera access denied')
      onClose()
    })

    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [onClose])

  const handleSnap = () => {
    let count = 3
    setCountdown(count)
    const interval = setInterval(() => {
      count--
      if (count === 0) {
        clearInterval(interval)
        setCountdown(null)
        captureFrame()
      } else {
        setCountdown(count)
      }
    }, 1000)
  }

  const captureFrame = () => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      onCapture(url, blob)
    }, 'image/jpeg', 0.9)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(255,240,245,0.8)', backdropFilter: 'blur(4px)' }}>
      <div className="w-80 rounded-2xl border-2 border-[#3D2B3D] window-shadow bg-white overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-[#C8F0C8] border-b-2 border-[#3D2B3D]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {['#FF6B6B', '#FFD93D', '#6BCB77'].map((c, i) => (
                <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span className="pixel-font text-[8px] text-[#3D2B3D]">WEBCAM.EXE</span>
          </div>
          <button onClick={onClose} className="pixel-font text-[8px] text-[#3D2B3D] cursor-pointer hover:text-red-500">✕</button>
        </div>

        {/* Video stream */}
        <div className="relative m-3 rounded-xl overflow-hidden border-2 border-[#FFB7C5] bg-[#FFF0F5]">
          <video
            ref={videoRef}
            className="w-full rounded-xl"
            muted
            playsInline
          />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="pixel-font text-[8px] text-[#FFB7C5]">LOADING CAMERA...</span>
            </div>
          )}
          {/* Countdown overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <span className="pixel-font text-6xl text-white" style={{ textShadow: '3px 3px 0px #FFB7C5' }}>
                {countdown}
              </span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 px-3 pb-4">
          <button
            onClick={handleSnap}
            disabled={!ready || countdown !== null}
            className="flex-1 py-2.5 rounded-xl border-2 border-[#3D2B3D] bg-[#FFB7C5] pixel-font text-[8px] text-[#3D2B3D] cursor-pointer disabled:opacity-50 transition-all hover:translate-y-[-1px]"
            style={{ boxShadow: '3px 3px 0px #3D2B3D' }}
          >
            📸 SNAP!
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border-2 border-[#E0D0D0] bg-[#FAFAFA] pixel-font text-[8px] text-[#B0A0A0] cursor-pointer"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  )
}
