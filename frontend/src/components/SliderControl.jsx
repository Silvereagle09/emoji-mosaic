// SliderControl.jsx
// Drop your images in public/sliders/ and update leftImg/rightImg props in App.jsx

export default function SliderControl({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  leftImg,
  rightImg,
  leftLabel,
  rightLabel,
  color = '#fff7b7',
}) {
  return (
    <div className="flex flex-col gap-2">
      {/* Label + value badge */}
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

      {/* Slider row */}
      <div className="flex items-center gap-3">
        <img
          src={leftImg || '/sliders/placeholder.png'}
          alt={leftLabel || 'left'}
          className="w-14 h-14 object-contain flex-shrink-0"
        />

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 cursor-pointer appearance-none h-2 rounded-full border-2 border-[#3D2B3D]"
          style={{
            accentColor: color,
            backgroundColor: '#FFF0F5',
            '--thumb-color': color,
          }}
        />

        <img
          src={rightImg || '/sliders/placeholder.png'}
          alt={rightLabel || 'right'}
          className="w-14 h-14 object-contain flex-shrink-0"
        />
      </div>

      {/* Sub-labels — aligned under track, not under images */}
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between" style={{ paddingLeft: '7px', paddingRight: '15px' }}>
          <span className="text-[10px] text-[#C0A0A0] font-semibold">{leftLabel}</span>
          <span className="text-[10px] text-[#C0A0A0] font-semibold">{rightLabel}</span>
        </div>
      )}
    </div>
  )
}