const makeStickers = (name, count, positions) =>
  positions.map((pos, i) => ({
    img: `/stickers/${name} (${(i % count) + 1}).png`,
    ...pos,
  }))

const POSITIONS = [
  { top: '40%', left: '2%',  size: 'w-10 h-10', delay: '1s',   speed: 'sticker-float-slow' },
  { top: '15%', right: '8%', size: 'w-8 h-8',   delay: '0.5s', speed: 'sticker-float' },
  { top: '8%',  left: '5%',  size: 'w-10 h-10', delay: '0s',   speed: 'sticker-float-slow' },
  { top: '60%', right: '3%', size: 'w-8 h-8',   delay: '0.8s', speed: 'sticker-float' },
  { top: '75%', left: '6%',  size: 'w-10 h-10', delay: '0.3s', speed: 'sticker-float-fast' },
  { top: '85%', right: '7%', size: 'w-8 h-8',   delay: '1.2s', speed: 'sticker-float' },
]

const THEME_STICKERS = {
  pastel: makeStickers('pastel', 6, POSITIONS),
  spooky: makeStickers('spooky', 6, POSITIONS),
  ocean:  makeStickers('ocean',  6, POSITIONS),
  y2k:    makeStickers('y2k',    6, POSITIONS),
}

export default function FloatingStickers({ theme = 'pastel' }) {
  const stickers = THEME_STICKERS[theme] || THEME_STICKERS.pastel

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stickers.map((s, i) => (
        <div
          key={`${theme}-${i}`}
          className={`absolute select-none ${s.size} ${s.speed}`}
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            animationDelay: s.delay,
            opacity: theme === 'spooky' ? 0.35 : 0.5,
            transition: 'opacity 0.2s ease',
          }}
        >
          <img
            src={s.img}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
      ))}
    </div>
  )
}