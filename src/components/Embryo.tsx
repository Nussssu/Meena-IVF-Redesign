import { motion, useReducedMotion } from 'motion/react'

type C = { x: number; y: number; r: number; inner?: boolean }
const ring = (n: number, rad: number, r: number, start = 0): C[] =>
  Array.from({ length: n }, (_, i) => { const a = start + (i / n) * Math.PI * 2; return { x: Math.cos(a) * rad, y: Math.sin(a) * rad, r } })

/** Cell layouts for six stages: 1 → 2 → 4 → 8 cells → morula → blastocyst. */
const STAGES: C[][] = [
  [{ x: 0, y: 0, r: 34 }],
  [{ x: -16, y: 0, r: 19 }, { x: 16, y: 0, r: 19 }],
  ring(4, 15, 14.5, Math.PI / 4),
  [...ring(5, 20, 11, -Math.PI / 2), ...ring(3, 7, 9.5)],
  [...ring(10, 26, 8.2, -Math.PI / 2), ...ring(6, 12, 7.6), { x: 0, y: 0, r: 7 }],
  [...ring(20, 33, 5.2, -Math.PI / 2), ...[{ x: -13, y: -12 }, { x: -4, y: -17 }, { x: -18, y: -3 }, { x: -9, y: -6 }, { x: -2, y: -9 }].map((p) => ({ ...p, r: 6.4, inner: true }))],
]
const MAX = 25
export const EMBRYO_LABELS = ['1 cell', '2 cells', '4 cells', '8 cells', 'Morula', 'Blastocyst']

export function Embryo({ stage, className = '', dark = false }: { stage: number; className?: string; dark?: boolean }) {
  const reduce = useReducedMotion()
  const cells = STAGES[Math.max(0, Math.min(5, stage))]
  const fill = dark ? 'rgba(235,227,244,0.16)' : '#FFFFFF'
  const stroke = dark ? '#EBE3F4' : '#80298F'
  return (
    <svg viewBox="-60 -60 120 120" className={className} role="img" aria-label={`Embryo illustration: ${EMBRYO_LABELS[stage]}`}>
      <defs>
        <radialGradient id={`glow-${dark ? 'd' : 'l'}`} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor={dark ? '#9440A0' : '#EBE3F4'} stopOpacity="0.9" />
          <stop offset="100%" stopColor={dark ? '#2E0D36' : '#FBF7F2'} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r="58" fill={`url(#glow-${dark ? 'd' : 'l'})`} />
      {/* zona pellucida */}
      <circle r="44" fill="none" stroke={stroke} strokeOpacity="0.35" strokeWidth="1" />
      <circle r="47" fill="none" stroke={stroke} strokeOpacity="0.15" strokeWidth="3" />
      {stage === 5 && <motion.circle r="27" fill={dark ? 'rgba(46,13,54,.5)' : '#F3EEF6'} initial={reduce ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.6 }} />}
      {Array.from({ length: MAX }, (_, i) => {
        const c = cells[i]
        return (
          <motion.circle key={i}
            initial={false}
            animate={c ? { cx: c.x, cy: c.y, r: c.r, opacity: 1 } : { cx: 0, cy: 0, r: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (i % 8) * 0.015 }}
            fill={c?.inner ? (dark ? '#B98AC4' : '#EBE3F4') : fill}
            stroke={stroke} strokeWidth="1.1" strokeOpacity="0.9" />
        )
      })}
      {/* nucleus on the single cell */}
      <motion.circle r="5" fill={stroke} animate={{ opacity: stage === 0 ? 0.5 : 0 }} transition={{ duration: 0.3 }} />
    </svg>
  )
}
