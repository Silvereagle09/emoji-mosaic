// ThemePicker.jsx
// Horizontal scrollable theme selector with cute labels and emoji previews

const THEMES = [
  {
    id: 'pastel',
    label: 'Pastel',
    emojis: ['🌸', '🍡', '🎀', '🫧', '🐣'],
    bg: '#FFF0F5',
    border: '#FFB7C5',
    dot: '#FF8FAB',
  },
  {
    id: 'spooky',
    label: 'Spooky',
    emojis: ['👻', '🕷️', '🎃', '🦇', '🖤'],
    bg: '#F5F0FF',
    border: '#C8A2C8',
    dot: '#9B59B6',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    emojis: ['🐠', '🐚', '🌊', '🐋', '🫐'],
    bg: '#F0F8FF',
    border: '#B8E0FF',
    dot: '#4FACFE',
  },
  {
    id: 'y2k',
    label: 'Y2K',
    emojis: ['💿', '⭐', '🔮', '💜', '🌀'],
    bg: '#FFFDE7',
    border: '#FFE566',
    dot: '#F9A825',
  },
]

export default function ThemePicker({ selected, onChange }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {THEMES.map((theme) => {
        const isSelected = selected === theme.id
        return (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer"
            style={{
              backgroundColor: isSelected ? theme.bg : '#FAFAFA',
              borderColor: isSelected ? theme.dot : '#E0D8D8',
              boxShadow: isSelected ? `3px 3px 0px ${theme.dot}` : '3px 3px 0px #E0D8D8',
            }}
          >
            {/* Emoji preview row */}
            <div className="flex gap-0.5 text-lg">
              {theme.emojis.slice(0, 3).map((e, i) => (
                <span key={i}>{e}</span>
              ))}
            </div>

            {/* Label */}
            <span
              className="pixel-font text-[7px] tracking-wide"
              style={{ color: isSelected ? theme.dot : '#B0A8A8' }}
            >
              {theme.label.toUpperCase()}
            </span>

            {/* Selected dot */}
            {isSelected && (
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: theme.dot }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
