export default function SpiralBinding({ width = 420 }) {
  const svgH    = 50
  const cy      = 32          // ring centre Y
  const ry      = 12          // ring vertical radius
  const paddingX = 6          // tight left/right margin
  const ringCount = Math.max(Math.floor((width - paddingX * 2) / 10.5), 10)
  const spacing = (width - paddingX * 2) / ringCount
  const rx      = spacing * 0.46   // nearly touching

  // Horizontal page-edge band that the coils thread through
  const pageTop = cy - 4
  const pageH   = 8

  const rings = Array.from({ length: ringCount + 1 }, (_, i) => ({
    cx: paddingX + i * spacing,
  }))

  const nailX = width / 2

  return (
    <svg
      width={width}
      height={svgH}
      viewBox={`0 0 ${width} ${svgH}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        {/* Top half — above page strip */}
        <clipPath id="topClip">
          <rect x="0" y="0" width={width} height={pageTop + 1} />
        </clipPath>
        {/* Bottom half — below page strip */}
        <clipPath id="botClip">
          <rect x="0" y={pageTop + pageH - 1} width={width} height={svgH} />
        </clipPath>
      </defs>

      {/*  Back arcs — dark but faint behind the card edge  */}
      <g clipPath="url(#botClip)" opacity="0.30">
        {rings.map(({ cx }, i) => (
          <ellipse
            key={i}
            cx={cx} cy={cy}
            rx={rx} ry={ry}
            fill="none"
            stroke="#111"
            strokeWidth="2.2"
          />
        ))}
      </g>

      {/*  Page strip — white card-edge band  */}
      <rect x="0" y={pageTop} width={width} height={pageH} fill="#fff" />

      {/*  Front arcs — dark metal coils  */}
      <g clipPath="url(#topClip)">
        {rings.map(({ cx }, i) => (
          <ellipse
            key={i}
            cx={cx} cy={cy}
            rx={rx} ry={ry}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2.4"
          />
        ))}
      </g>

      {/*  Nail — thin wire with tiny head  */}
      {/* Vertical shaft */}
      <line
        x1={nailX} y1={0}
        x2={nailX} y2={cy - ry - 2}
        stroke="#555"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* U-arch looping through the binding */}
      <path
        d={`M ${nailX - 8} ${pageTop + pageH / 2 + 1}
            C ${nailX - 8} ${cy - ry - 7}, ${nailX + 8} ${cy - ry - 7}, ${nailX + 8} ${pageTop + pageH / 2 + 1}`}
        fill="none"
        stroke="#555"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Tiny nail head */}
      <circle cx={nailX} cy="2.5" r="2.8" fill="#555" />
      {/* Subtle highlight on head */}
      <circle cx={nailX - 0.8} cy="1.5" r="1.1" fill="#888" opacity="0.6" />
    </svg>
  )
}
