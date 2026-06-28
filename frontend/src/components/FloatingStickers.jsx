// FloatingStickers.jsx
// Ambient floating stickers — swap set based on active theme

const THEME_STICKERS = {
  pastel: [
    { emoji: '🌸', top: '8%',  left: '5%',   size: 'text-2xl', delay: '0s',   speed: 'sticker-float-slow' },
    { emoji: '✨', top: '15%', right: '8%',   size: 'text-xl',  delay: '0.5s', speed: 'sticker-float' },
    { emoji: '🎀', top: '40%', left: '2%',    size: 'text-2xl', delay: '1s',   speed: 'sticker-float-slow' },
    { emoji: '🍡', top: '60%', right: '3%',   size: 'text-xl',  delay: '0.8s', speed: 'sticker-float' },
    { emoji: '🐱', top: '75%', left: '6%',    size: 'text-2xl', delay: '0.3s', speed: 'sticker-float-fast' },
    { emoji: '💕', top: '85%', right: '7%',   size: 'text-xl',  delay: '1.2s', speed: 'sticker-float' },
    { emoji: '🫧', top: '5%',  left: '45%',   size: 'text-lg',  delay: '0.6s', speed: 'sticker-float-slow' },
  ],
  spooky: [
    { emoji: '👻', top: '8%',  left: '5%',   size: 'text-2xl', delay: '0s',   speed: 'sticker-float-slow' },
    { emoji: '🕷️', top: '15%', right: '8%',  size: 'text-xl',  delay: '0.5s', speed: 'sticker-float' },
    { emoji: '🎃', top: '40%', left: '2%',   size: 'text-2xl', delay: '1s',   speed: 'sticker-float-slow' },
    { emoji: '🦇', top: '60%', right: '3%',  size: 'text-xl',  delay: '0.8s', speed: 'sticker-float' },
    { emoji: '🖤', top: '75%', left: '6%',   size: 'text-2xl', delay: '0.3s', speed: 'sticker-float-fast' },
    { emoji: '🕸️', top: '85%', right: '7%',  size: 'text-xl',  delay: '1.2s', speed: 'sticker-float' },
    { emoji: '💀', top: '5%',  left: '45%',  size: 'text-lg',  delay: '0.6s', speed: 'sticker-float-slow' },
  ],
  ocean: [
    { emoji: '🐠', top: '8%',  left: '5%',   size: 'text-2xl', delay: '0s',   speed: 'sticker-float-slow' },
    { emoji: '🌊', top: '15%', right: '8%',  size: 'text-xl',  delay: '0.5s', speed: 'sticker-float' },
    { emoji: '🐚', top: '40%', left: '2%',   size: 'text-2xl', delay: '1s',   speed: 'sticker-float-slow' },
    { emoji: '🐋', top: '60%', right: '3%',  size: 'text-xl',  delay: '0.8s', speed: 'sticker-float' },
    { emoji: '🫐', top: '75%', left: '6%',   size: 'text-2xl', delay: '0.3s', speed: 'sticker-float-fast' },
    { emoji: '🐙', top: '85%', right: '7%',  size: 'text-xl',  delay: '1.2s', speed: 'sticker-float' },
    { emoji: '🦀', top: '5%',  left: '45%',  size: 'text-lg',  delay: '0.6s', speed: 'sticker-float-slow' },
  ],
  y2k: [
    { emoji: '💿', top: '8%',  left: '5%',   size: 'text-2xl', delay: '0s',   speed: 'sticker-float-slow' },
    { emoji: '⭐', top: '15%', right: '8%',  size: 'text-xl',  delay: '0.5s', speed: 'sticker-float' },
    { emoji: '🔮', top: '40%', left: '2%',   size: 'text-2xl', delay: '1s',   speed: 'sticker-float-slow' },
    { emoji: '💜', top: '60%', right: '3%',  size: 'text-xl',  delay: '0.8s', speed: 'sticker-float' },
    { emoji: '🌀', top: '75%', left: '6%',   size: 'text-2xl', delay: '0.3s', speed: 'sticker-float-fast' },
    { emoji: '✴️', top: '85%', right: '7%',  size: 'text-xl',  delay: '1.2s', speed: 'sticker-float' },
    { emoji: '🎧', top: '5%',  left: '45%',  size: 'text-lg',  delay: '0.6s', speed: 'sticker-float-slow' },
  ],
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
            transition: 'opacity 0.4s ease',
          }}
        >
          {s.emoji}
        </div>
      ))}
    </div>
  )
}
