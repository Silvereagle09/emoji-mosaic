// SliderControl.jsx
// Kawaii styled slider with pixel label and emoji endpoints

export default function SliderControl({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  leftEmoji,
  rightEmoji,
  leftLabel,
  rightLabel,
  color = '#FFB7C5',
}) {
  return (
    <div className="flex flex-col gap-2">
      {/* Label + value */}
      <div className="flex items-center justify-between">
        <span className="pixel-font text-[8px] text-[#3D2B3D] tracking-wide">
          {label.toUpperCase()}
        </span>
        <span
          className="pixel-font text-[8px] px-2 py-0.5 rounded-full border"
          style={{ color, borderColor: color, backgroundColor: `${color}22` }}
        >
          {value}
        </span>
      </div>

      {/* Endpoint labels */}
      <div className="flex items-center gap-2">
        <span className="text-base">{leftEmoji}</span>
        <div className="flex-1 relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="chaos-track w-full appearance-none cursor-pointer"
            style={{ accentColor: color }}
          />
        </div>
        <span className="text-base">{rightEmoji}</span>
      </div>

      {/* Sub-labels */}
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between">
          <span className="text-[10px] text-[#C0A0A0] font-semibold">{leftLabel}</span>
          <span className="text-[10px] text-[#C0A0A0] font-semibold">{rightLabel}</span>
        </div>
      )}
    </div>
  )
}
