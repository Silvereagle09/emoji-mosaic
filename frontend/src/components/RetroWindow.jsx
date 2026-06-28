// RetroWindow.jsx
// Reusable kawaii OS-style window with title bar, dots, and content slot

const DOT_COLORS = {
  pink: ['#FF6B6B', '#FFB347', '#69D84F'],
  blue: ['#FF6B6B', '#FFD93D', '#6BCB77'],
  purple: ['#FF6B6B', '#FFB7C5', '#C8A2C8'],
  yellow: ['#FF6B6B', '#FFE566', '#90EE90'],
}

export default function RetroWindow({
  title,
  children,
  color = 'pink',
  className = '',
  titleBarColor,
}) {
  const dots = DOT_COLORS[color] || DOT_COLORS.pink
  const barBg = titleBarColor || {
    pink: '#FFB7C5',
    blue: '#B8E0FF',
    purple: '#E8D5FF',
    yellow: '#FFF3B0',
  }[color] || '#FFB7C5'

  return (
    <div
      className={`rounded-2xl border-2 border-[#3D2B3D] window-shadow overflow-hidden bg-white ${className}`}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b-2 border-[#3D2B3D]"
        style={{ backgroundColor: barBg }}
      >
        {/* Traffic light dots */}
        <div className="flex gap-1.5">
          {dots.map((c, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full border border-[#3D2B3D30]"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Title */}
        <span className="pixel-font text-[8px] text-[#3D2B3D] ml-1 tracking-wide uppercase">
          {title}
        </span>
      </div>

      {/* Content */}
      <div className="bg-white">{children}</div>
    </div>
  )
}
