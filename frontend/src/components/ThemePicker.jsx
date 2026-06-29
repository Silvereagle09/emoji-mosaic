// ThemePicker.jsx
// Stamp-style theme cards — scalloped border, full image bg, text overlay

const THEMES = [
  {
    id: 'pastel',
    label: 'Pastel',
    dot: '#ffa2b9',
    img: '/themes/pastel.jpeg',
    fallbackEmoji: '🌸',
    value: '1¢',
  },
  {
    id: 'spooky',
    label: 'Spooky',
    dot: '#b166cf',
    img: '/themes/spooky.png',
    fallbackEmoji: '👻',
    value: '2¢',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    dot: '#64b6fe',
    img: '/themes/ocean.png',
    fallbackEmoji: '🌊',
    value: '3¢',
  },
  {
    id: 'y2k',
    label: 'Y2K',
    dot: '#ff5151',
    img: '/themes/y2k.png',
    fallbackEmoji: '💿',
    value: '4¢',
  },
]

// Scalloped border via radial-gradient mask
const scallop = `radial-gradient(circle at 50% 0%,   transparent 8px, white 8px) top,
radial-gradient(circle at 50% 100%, transparent 8px, white 8px) bottom,
radial-gradient(circle at 0% 50%,   transparent 8px, white 8px) left,
radial-gradient(circle at 100% 50%, transparent 8px, white 8px) right`

export default function ThemePicker({ selected, onChange }) {
  return (
    <div className="flex gap-5 justify-center flex-wrap py-2">
      {THEMES.map((theme) => {
        const isSelected = selected === theme.id

        return (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className="flex-shrink-0 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 relative"
            style={{
              width: '90px',
              transform: isSelected ? 'translateY(-5px) rotate(-1deg)' : 'rotate(1deg)',
              filter: isSelected
                ? `drop-shadow(4px 4px 0px ${theme.dot})`
                : 'drop-shadow(3px 3px 0px #ccc)',
            }}
          >
            {/* Stamp outer — white scalloped frame */}
            <div
              style={{
                backgroundColor: 'white',
                padding: '8px',
                maskImage: scallop,
                maskRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
                maskSize: '16px 16px, 16px 16px, 16px 16px, 16px 16px',
                WebkitMaskImage: scallop,
                WebkitMaskRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
                WebkitMaskSize: '16px 16px, 16px 16px, 16px 16px, 16px 16px',
                borderRadius: '4px',
              }}
            >
              {/* Inner image area */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: '74px',
                  height: '90px',
                  borderRadius: '3px',
                  border: isSelected ? `2px solid ${theme.dot}` : '2px solid #e0d8d8',
                }}
              >
                {/* Full bg image */}
                <img
                  src={theme.img}
                  alt={theme.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />

                {/* Fallback */}
                <div
                  className="absolute inset-0 items-center justify-center text-4xl hidden"
                  style={{ backgroundColor: '#F5F0F0' }}
                >
                  {theme.fallbackEmoji}
                </div>

                {/* Dark gradient overlay at bottom */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)',
                  }}
                />

                {/* Theme label overlay */}
                <div className="absolute bottom-0 left-0 right-0 pb-1.5 flex flex-col items-center gap-0.5">
                  <span
                    className="pixel-font text-white leading-none"
                    style={{
                      fontSize: '7px',
                      letterSpacing: '0.15em',
                      textShadow: `0 0 6px ${theme.dot}, 0 1px 2px rgba(0,0,0,0.8)`,
                    }}
                  >
                    {theme.label.toUpperCase()}
                  </span>
                  <span
                    className="pixel-font leading-none"
                    style={{
                      fontSize: '6px',
                      color: theme.dot,
                      textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                    }}
                  >
                    {theme.value}
                  </span>
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}