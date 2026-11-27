import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { scrollToTarget } from '../lib/smooth'

/* Brand palette (mirrors tailwind.config.js) */
const P = '#80298F', P9 = '#2E0D36', LAV = '#7B6BB0', LIL = '#EBE3F4', BL = '#F7E6E0', W = '#FFFFFF', HON = '#D9A441', ICE = '#9BC7E6'

/** SVG transforms scale/rotate around each shape's own centre */
const C = { transformBox: 'fill-box' as const, originX: 0.5, originY: 0.5 }

const loop = (duration: number, delay = 0, extra: object = {}) => ({ duration, delay, repeat: Infinity, ease: 'easeInOut' as const, ...extra })

/* ---------- reusable pieces ---------- */
const Egg = ({ x, y, r = 34, glow = false }: { x: number; y: number; r?: number; glow?: boolean }) => (
  <g>
    {glow && <motion.circle cx={x} cy={y} r={r + 10} fill={P} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.18, 0] }} transition={loop(2.4, 1.6)} />}
    <circle cx={x} cy={y} r={r} fill={BL} stroke={P} strokeWidth="3" />
    <circle cx={x} cy={y} r={r * 0.72} fill={W} stroke={LAV} strokeWidth="1.5" strokeDasharray="3 4" />
    <circle cx={x + r * 0.15} cy={y - r * 0.1} r={r * 0.22} fill={LIL} stroke={P} strokeWidth="1.5" />
  </g>
)
const Sperm = ({ s = 1 }: { s?: number }) => (
  <g transform={`scale(${s})`}>
    <ellipse cx="0" cy="0" rx="7" ry="5" fill={P} />
    <motion.path d="M-7 0 C -14 -5, -20 5, -28 0 S -40 -4, -46 0" fill="none" stroke={P} strokeWidth="2" strokeLinecap="round"
      animate={{ d: ['M-7 0 C -14 -5, -20 5, -28 0 S -40 -4, -46 0', 'M-7 0 C -14 5, -20 -5, -28 0 S -40 4, -46 0', 'M-7 0 C -14 -5, -20 5, -28 0 S -40 -4, -46 0'] }} transition={loop(0.6)} />
  </g>
)
const Uterus = () => (
  <g>
    <path d="M120 70 Q 200 40 280 70 Q 300 78 312 64 Q 330 50 340 70 Q 330 86 300 92 Q 270 98 262 120 Q 250 160 222 176 L 222 206 L 178 206 L 178 176 Q 150 160 138 120 Q 130 98 100 92 Q 70 86 60 70 Q 70 50 88 64 Q 100 78 120 70 Z" fill={BL} stroke={P} strokeWidth="3" strokeLinejoin="round" />
    <path d="M160 92 Q 200 80 240 92 Q 236 140 200 160 Q 164 140 160 92 Z" fill={W} stroke={LAV} strokeWidth="1.5" />
  </g>
)
const Syringe = ({ x, y, rot = 0 }: { x: number; y: number; rot?: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x="-10" y="-46" width="20" height="56" rx="4" fill={W} stroke={P9} strokeWidth="2.5" />
    <motion.rect x="-8" y="-20" width="16" height="28" rx="2" fill={LAV} animate={{ height: [28, 8, 28], y: [-20, 0, -20] }} transition={loop(2.6)} />
    <rect x="-16" y="-52" width="32" height="6" rx="3" fill={P9} />
    <line x1="0" y1="10" x2="0" y2="34" stroke={P9} strokeWidth="2.5" strokeLinecap="round" />
  </g>
)
const Monitor = ({ children }: { children: ReactNode }) => (
  <g>
    <rect x="90" y="30" width="220" height="150" rx="14" fill={P9} />
    <rect x="102" y="42" width="196" height="126" rx="8" fill="#1B0721" />
    {children}
    <rect x="180" y="180" width="40" height="16" fill={P9} />
    <rect x="150" y="196" width="100" height="8" rx="4" fill={P9} />
  </g>
)
const Tick = ({ x, y, delay }: { x: number; y: number; delay: number }) => (
  <motion.path d={`M${x} ${y} l7 7 l13 -15`} fill="none" stroke={P} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
    initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1, 0] }} transition={loop(3.6, delay, { times: [0, 0.2, 0.9, 1] })} />
)
const Snowflake = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => (
  <motion.g style={C} animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
    {[0, 60, 120].map((a) => (
      <g key={a} transform={`rotate(${a} ${x} ${y})`}>
        <line x1={x} y1={y - 26 * s} x2={x} y2={y + 26 * s} stroke={ICE} strokeWidth="3" strokeLinecap="round" />
        <path d={`M${x - 7 * s} ${y - 20 * s} L${x} ${y - 13 * s} L${x + 7 * s} ${y - 20 * s} M${x - 7 * s} ${y + 20 * s} L${x} ${y + 13 * s} L${x + 7 * s} ${y + 20 * s}`} fill="none" stroke={ICE} strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ))}
  </motion.g>
)

/* ---------- scenes (viewBox 400 x 240) ---------- */
const scenes: Record<string, () => ReactNode> = {
  // ovaries grow several follicles under hormone medication
  hormone: () => (
    <g>
      <ellipse cx="230" cy="130" rx="110" ry="74" fill={BL} stroke={P} strokeWidth="3" />
      {[[190, 110, 0], [240, 96, 0.3], [280, 130, 0.6], [215, 156, 0.9], [262, 168, 1.2]].map(([x, y, d]) => (
        <motion.circle key={`${x}${y}`} cx={x} cy={y} r="18" fill={W} stroke={LAV} strokeWidth="2.5" style={C}
          animate={{ scale: [0.3, 1, 1, 0.3] }} transition={loop(4, d, { times: [0, 0.45, 0.85, 1] })} />
      ))}
      <motion.g animate={{ y: [0, 8, 0] }} transition={loop(2.6)}><Syringe x={70} y={110} rot={-20} /></motion.g>
      {[0, 0.5, 1].map((d) => <motion.circle key={d} cx="96" cy="150" r="4" fill={LAV} animate={{ cx: [96, 150], cy: [150, 140], opacity: [0, 1, 0] }} transition={loop(1.8, d)} />)}
    </g>
  ),
  follicles: () => (
    <Monitor>
      <motion.path d="M200 160 L120 60 A 110 110 0 0 1 280 60 Z" fill={LAV} opacity="0.18" />
      {[[170, 100, 0], [210, 86, 0.4], [236, 118, 0.8], [190, 132, 1.2]].map(([x, y, d]) => (
        <motion.circle key={`${x}${y}`} cx={x} cy={y} fill="#0E0412" stroke={ICE} strokeWidth="2" animate={{ r: [4, 16, 16, 4] }} transition={loop(4.2, d, { times: [0, 0.5, 0.85, 1] })} />
      ))}
      <motion.text x="114" y="160" fill={ICE} fontSize="11" fontFamily="'Plus Jakarta Sans', sans-serif" animate={{ opacity: [0.4, 1, 0.4] }} transition={loop(1.6)}>FOLLICLE 18 mm</motion.text>
    </Monitor>
  ),
  ultrasound: () => (
    <Monitor>
      <path d="M200 160 L120 60 A 110 110 0 0 1 280 60 Z" fill={LAV} opacity="0.15" />
      <motion.line x1="200" y1="160" x2="120" y2="60" stroke={ICE} strokeWidth="2" style={C} animate={{ rotate: [0, 77, 0] }} transition={loop(3)} />
      <motion.ellipse cx="200" cy="100" rx="42" ry="26" fill="none" stroke={ICE} strokeWidth="2" animate={{ opacity: [0.2, 1, 0.2] }} transition={loop(3)} />
      <motion.circle cx="186" cy="98" r="8" fill="none" stroke={ICE} strokeWidth="2" animate={{ opacity: [0, 1, 0] }} transition={loop(3, 0.6)} />
      <motion.circle cx="216" cy="104" r="6" fill="none" stroke={ICE} strokeWidth="2" animate={{ opacity: [0, 1, 0] }} transition={loop(3, 1)} />
    </Monitor>
  ),
  // needle collects mature eggs
  retrieval: () => (
    <g>
      <ellipse cx="150" cy="130" rx="90" ry="64" fill={BL} stroke={P} strokeWidth="3" />
      {[[120, 110], [170, 102], [150, 156]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="16" fill={W} stroke={LAV} strokeWidth="2.5" />)}
      <motion.g animate={{ x: [60, 0, 0, 60] }} transition={loop(3.6, 0, { times: [0, 0.35, 0.7, 1] })}>
        <line x1="180" y1="110" x2="370" y2="60" stroke={P9} strokeWidth="3" strokeLinecap="round" />
        <rect x="330" y="40" width="54" height="30" rx="6" fill={W} stroke={P9} strokeWidth="2.5" transform="rotate(-15 357 55)" />
      </motion.g>
      <motion.circle r="7" fill={BL} stroke={P} strokeWidth="2" animate={{ cx: [170, 170, 350], cy: [102, 102, 55], opacity: [0, 1, 1] }} transition={loop(3.6, 0, { times: [0, 0.4, 0.8] })} />
      <rect x="300" y="160" width="70" height="40" rx="8" fill={LIL} stroke={P} strokeWidth="2" />
      <text x="335" y="185" textAnchor="middle" fontSize="12" fill={P} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">EGGS</text>
    </g>
  ),
  fertilize: () => (
    <g>
      <Egg x={250} y={120} r={52} glow />
      {[[0, 70], [0.5, 120], [1, 170]].map(([d, y]) => (
        <motion.g key={d} animate={{ x: [20, 186], y: [y, 120 + (y - 120) * 0.25], opacity: [0, 1, 1, 0] }} transition={loop(3, d, { times: [0, 0.1, 0.85, 1] })}>
          <Sperm />
        </motion.g>
      ))}
    </g>
  ),
  // embryo divides 1 -> 2 -> 4 -> blastocyst
  embryo: () => {
    const stages = [[[0, 0, 30]], [[-15, 0, 18], [15, 0, 18]], [[-13, -13, 14], [13, -13, 14], [-13, 13, 14], [13, 13, 14]]]
    return (
      <g>
        <circle cx="200" cy="120" r="70" fill={BL} stroke={P} strokeWidth="3" />
        {stages.map((cells, si) => (
          <motion.g key={si} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={loop(4, si, { times: [0, 0.04, 0.22, 0.25] })}>
            {cells.map(([dx, dy, r], i) => <circle key={i} cx={200 + dx * 1.6} cy={120 + dy * 1.6} r={r * 1.5} fill={W} stroke={LAV} strokeWidth="2" />)}
          </motion.g>
        ))}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1, 1, 0] }} transition={loop(4, 0, { times: [0, 0.74, 0.77, 0.97, 1] })}>
          <circle cx="200" cy="120" r="58" fill={W} stroke={LAV} strokeWidth="2" />
          <circle cx="178" cy="104" r="22" fill={LIL} stroke={P} strokeWidth="2" />
          {Array.from({ length: 14 }).map((_, i) => { const a = (i / 14) * Math.PI * 2; return <circle key={i} cx={200 + Math.cos(a) * 52} cy={120 + Math.sin(a) * 52} r="6" fill={LIL} stroke={LAV} strokeWidth="1.5" /> })}
        </motion.g>
        <text x="200" y="222" textAnchor="middle" fontSize="12" fill={P} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">DAY 1 → DAY 5</text>
      </g>
    )
  },
  transfer: () => (
    <g>
      <Uterus />
      <motion.g animate={{ y: [60, 0, 0, 60] }} transition={loop(4, 0, { times: [0, 0.35, 0.75, 1] })}>
        <line x1="200" y1="130" x2="200" y2="238" stroke={P9} strokeWidth="4" strokeLinecap="round" />
      </motion.g>
      <motion.circle cx="200" r="7" fill={HON} stroke={P} strokeWidth="2" animate={{ cy: [190, 130, 118, 118], opacity: [0, 1, 1, 1] }} transition={loop(4, 0, { times: [0, 0.35, 0.55, 1] })} />
      <motion.circle cx="200" cy="118" r="16" fill="none" stroke={HON} strokeWidth="2" animate={{ scale: [0.5, 1.6], opacity: [0, 0.8, 0] }} style={C} transition={loop(2, 1.6)} />
    </g>
  ),
  inseminate: () => (
    <g>
      <Uterus />
      <line x1="200" y1="150" x2="200" y2="238" stroke={P9} strokeWidth="4" strokeLinecap="round" />
      {[0, 0.4, 0.8, 1.2].map((d, i) => (
        <motion.g key={d} animate={{ x: [200, 200 + (i % 2 ? 1 : -1) * (40 + i * 10)], y: [150, 92 - i * 4], opacity: [0, 1, 0] }} transition={loop(2.4, d)}>
          <g transform="rotate(-90) scale(0.6)"><Sperm /></g>
        </motion.g>
      ))}
    </g>
  ),
  test: () => (
    <g>
      <rect x="110" y="96" width="200" height="56" rx="28" fill={W} stroke={P9} strokeWidth="3" />
      <rect x="190" y="110" width="76" height="28" rx="6" fill={LIL} stroke={LAV} strokeWidth="1.5" />
      <motion.line x1="212" y1="114" x2="212" y2="134" stroke={P} strokeWidth="4" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={loop(4, 0.4, { times: [0, 0.2, 0.9, 1] })} />
      <motion.line x1="242" y1="114" x2="242" y2="134" stroke={P} strokeWidth="4" initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1, 1, 0] }} transition={loop(4, 0.4, { times: [0, 0.35, 0.5, 0.9, 1] })} />
      <motion.path d="M200 64 C 200 52, 184 50, 184 62 C 184 72, 200 80, 200 84 C 200 80, 216 72, 216 62 C 216 50, 200 52, 200 64 Z" fill={P}
        style={C} animate={{ scale: [0, 0, 1.15, 1, 0] }} transition={loop(4, 0.4, { times: [0, 0.5, 0.6, 0.9, 1] })} />
      <text x="200" y="190" textAnchor="middle" fontSize="13" fill={P} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">10–14 DAYS</text>
    </g>
  ),
  'select-sperm': () => (
    <g>
      <circle cx="200" cy="120" r="96" fill={LIL} stroke={P} strokeWidth="3" />
      {[[140, 90, 0], [250, 80, 0.3], [150, 160, 0.6], [260, 160, 0.9]].map(([x, y, d]) => (
        <motion.g key={`${x}${y}`} animate={{ x: [x, x + 14, x], y: [y, y - 6, y] }} transition={loop(2.2, d)} opacity="0.45"><Sperm s={0.8} /></motion.g>
      ))}
      <motion.g animate={{ x: [190, 214, 190], y: [124, 118, 124] }} transition={loop(2)}><Sperm /></motion.g>
      <motion.circle cx="200" cy="121" r="26" fill="none" stroke={HON} strokeWidth="3" strokeDasharray="6 5" animate={{ rotate: 360 }} style={C} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }} />
    </g>
  ),
  inject: () => (
    <g>
      <Egg x={180} y={120} r={60} />
      <rect x="40" y="108" width="70" height="24" rx="12" fill={W} stroke={P9} strokeWidth="2.5" />
      <motion.g animate={{ x: [60, 0, 0, 60] }} transition={loop(3.6, 0, { times: [0, 0.35, 0.7, 1] })}>
        <path d="M200 120 L 300 114 L 380 114 L 380 126 L 300 126 Z" fill={W} stroke={P9} strokeWidth="2.5" />
        <motion.circle cx="290" cy="120" r="4" fill={P} animate={{ cx: [290, 290, 196, 196], opacity: [1, 1, 1, 0] }} transition={loop(3.6, 0, { times: [0, 0.35, 0.6, 1] })} />
      </motion.g>
    </g>
  ),
  'sperm-prep': () => (
    <g>
      <path d="M170 40 L170 180 Q 170 210 200 210 Q 230 210 230 180 L230 40" fill={W} stroke={P9} strokeWidth="3" />
      <rect x="160" y="34" width="80" height="10" rx="5" fill={P9} />
      <motion.rect x="173" width="54" rx="4" fill={LIL} animate={{ y: [90, 70, 90], height: [117, 137, 117] }} transition={loop(3)} />
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.circle key={i} cx={180 + (i % 3) * 20} r="4" fill={P} animate={{ cy: [195 - Math.floor(i / 3) * 8, 100 + Math.floor(i / 3) * 10], opacity: [0.3, 1] }} transition={loop(2.6, i * 0.12, { repeatType: 'reverse' })} />
      ))}
      <motion.g animate={{ rotate: [0, 360] }} style={C} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
        <circle cx="300" cy="120" r="34" fill="none" stroke={LAV} strokeWidth="3" strokeDasharray="12 8" />
      </motion.g>
      <text x="300" y="124" textAnchor="middle" fontSize="10" fill={LAV} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">SPIN</text>
    </g>
  ),
  freeze: () => (
    <g>
      <rect x="150" y="60" width="44" height="130" rx="10" fill={W} stroke={P9} strokeWidth="3" />
      <rect x="146" y="48" width="52" height="18" rx="5" fill={P} />
      <motion.rect x="154" width="36" rx="6" fill={LIL} animate={{ fill: [LIL, ICE, LIL] }} transition={loop(4)} y="120" height="64" />
      <Snowflake x={280} y={110} s={1.4} />
      {[0, 0.6, 1.2, 1.8].map((d, i) => <motion.circle key={d} cx={230 + i * 22} r="3" fill={ICE} animate={{ cy: [40, 210], opacity: [0, 1, 0] }} transition={{ duration: 2.4, delay: d, repeat: Infinity, ease: 'linear' }} />)}
      <text x="172" y="222" textAnchor="middle" fontSize="12" fill={P} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">−196 °C</text>
    </g>
  ),
  storage: () => (
    <g>
      <rect x="140" y="80" width="120" height="130" rx="20" fill={LIL} stroke={P9} strokeWidth="3" />
      <rect x="170" y="56" width="60" height="30" rx="8" fill={W} stroke={P9} strokeWidth="3" />
      {[0, 0.8, 1.6].map((d, i) => (
        <motion.path key={d} d={`M${185 + i * 15} 54 q -8 -12 0 -24 q 8 -12 0 -24`} fill="none" stroke={ICE} strokeWidth="3" strokeLinecap="round" animate={{ opacity: [0, 0.9, 0], y: [6, -10] }} transition={loop(2.4, d)} />
      ))}
      <motion.g animate={{ y: [-70, 40, 40, -70] }} transition={loop(4, 0, { times: [0, 0.4, 0.8, 1] })}>
        <rect x="192" y="40" width="16" height="44" rx="4" fill={W} stroke={P} strokeWidth="2.5" />
      </motion.g>
      <rect x="160" y="150" width="80" height="6" rx="3" fill={LAV} opacity="0.5" />
      <rect x="160" y="170" width="80" height="6" rx="3" fill={LAV} opacity="0.5" />
      <motion.circle cx="244" cy="98" r="5" fill="#2F7D5B" animate={{ opacity: [1, 0.3, 1] }} transition={loop(1.4)} />
    </g>
  ),
  evaluate: () => (
    <g>
      <rect x="130" y="34" width="140" height="180" rx="12" fill={W} stroke={P9} strokeWidth="3" />
      <rect x="172" y="24" width="56" height="20" rx="6" fill={P} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="150" y={70 + i * 34} width="22" height="22" rx="5" fill={LIL} stroke={LAV} strokeWidth="1.5" />
          <Tick x={153} y={82 + i * 34} delay={i * 0.5} />
          <motion.rect x="184" y={77 + i * 34} height="8" rx="4" fill={LAV} opacity="0.5" animate={{ width: [0, 66, 66, 0] }} transition={loop(3.6, i * 0.5, { times: [0, 0.2, 0.9, 1] })} />
        </g>
      ))}
    </g>
  ),
  calendar: () => (
    <g>
      <rect x="110" y="44" width="180" height="160" rx="14" fill={W} stroke={P9} strokeWidth="3" />
      <rect x="110" y="44" width="180" height="34" rx="14" fill={P} />
      <rect x="110" y="64" width="180" height="14" fill={P} />
      {Array.from({ length: 15 }).map((_, i) => {
        const x = 128 + (i % 5) * 32, y = 92 + Math.floor(i / 5) * 34
        return <motion.rect key={i} x={x} y={y} width="24" height="24" rx="6" fill={LIL} animate={{ fill: [LIL, LAV, LIL] }} transition={{ duration: 0.5, delay: i * 0.22, repeat: Infinity, repeatDelay: 15 * 0.22 - 0.5 + 0.8 }} />
      })}
      <motion.circle cx="236" cy="138" r="18" fill="none" stroke={HON} strokeWidth="3" animate={{ scale: [0.6, 1.15, 1], opacity: [0, 1, 1] }} style={C} transition={loop(2.4)} />
    </g>
  ),
  collect: () => (
    <g>
      <path d="M150 90 L160 200 Q 162 210 172 210 L 228 210 Q 238 210 240 200 L250 90 Z" fill={W} stroke={P9} strokeWidth="3" />
      <rect x="140" y="74" width="120" height="20" rx="6" fill={P} />
      <motion.rect x="160" width="80" rx="4" fill={LIL} animate={{ y: [200, 150], height: [6, 54] }} transition={loop(3, 0, { repeatType: 'reverse' })} />
      <text x="200" y="134" textAnchor="middle" fontSize="11" fill={P} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">STERILE</text>
      <motion.path d="M310 60 l 10 14 a 12 12 0 1 1 -20 0 Z" fill="#2F7D5B" animate={{ scale: [0.9, 1.05, 0.9] }} style={C} transition={loop(2)} />
    </g>
  ),
  scope: () => (
    <g>
      <path d="M40 170 Q 200 70 360 170" fill="none" stroke={P} strokeWidth="4" strokeLinecap="round" />
      <path d="M40 170 Q 200 70 360 170 L360 220 L40 220 Z" fill={BL} />
      {[140, 200, 260].map((x, i) => <motion.circle key={x} cx={x} cy={x === 200 ? 120 : 129} r="6" fill={W} stroke={P9} strokeWidth="2.5" animate={{ scale: [1, 1.3, 1] }} style={C} transition={loop(2, i * 0.3)} />)}
      <motion.g animate={{ y: [-30, 0, -30] }} transition={loop(3.4)}>
        <line x1="200" y1="20" x2="200" y2="150" stroke={P9} strokeWidth="5" strokeLinecap="round" />
        <motion.path d="M200 150 L176 200 L224 200 Z" fill={HON} animate={{ opacity: [0.15, 0.5, 0.15] }} transition={loop(1.4)} />
      </motion.g>
      <text x="320" y="70" textAnchor="middle" fontSize="11" fill={P} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">5–10 mm</text>
    </g>
  ),
  hysteroscope: () => (
    <g>
      <Uterus />
      <motion.g animate={{ y: [50, 0, 0, 50] }} transition={loop(4, 0, { times: [0, 0.35, 0.8, 1] })}>
        <line x1="200" y1="140" x2="200" y2="238" stroke={P9} strokeWidth="5" strokeLinecap="round" />
        <motion.path d="M200 140 L168 96 L232 96 Z" fill={HON} animate={{ opacity: [0.1, 0.55, 0.1] }} transition={loop(1.4)} />
      </motion.g>
    </g>
  ),
  remove: () => (
    <g>
      <Uterus />
      <motion.circle cx="226" cy="104" fill="#C98A9B" stroke={P} strokeWidth="2" animate={{ r: [14, 14, 0, 0, 14], opacity: [1, 1, 0, 0, 1] }} transition={loop(4.4, 0, { times: [0, 0.3, 0.55, 0.9, 1] })} />
      {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([dx, dy], i) => (
        <motion.circle key={i} r="3" fill={HON} animate={{ cx: [226, 226 + dx * 24], cy: [104, 104 + dy * 24], opacity: [0, 0, 1, 0] }} transition={loop(4.4, 0, { times: [0, 0.45, 0.6, 0.8] })} />
      ))}
      <motion.path d="M176 112 l 12 12 l 22 -26" fill="none" stroke="#2F7D5B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" animate={{ pathLength: [0, 0, 1, 1, 0] }} transition={loop(4.4, 0, { times: [0, 0.6, 0.75, 0.9, 1] })} />
    </g>
  ),
  recovery: () => (
    <g>
      <rect x="60" y="70" width="280" height="110" rx="16" fill={W} stroke={P9} strokeWidth="3" />
      <motion.path d="M80 126 L150 126 L165 96 L182 156 L198 108 L212 126 L320 126" fill="none" stroke={P} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
        animate={{ pathLength: [0, 1], opacity: [1, 1, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', times: [0, 0.8, 1] }} />
      <motion.path d="M200 214 C 200 202, 184 200, 184 212 C 184 222, 200 230, 200 234 C 200 230, 216 222, 216 212 C 216 200, 200 202, 200 214 Z" fill={P}
        style={C} animate={{ scale: [1, 1.2, 1] }} transition={loop(1.2)} />
      <text x="200" y="56" textAnchor="middle" fontSize="12" fill={P} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600">QUICK RECOVERY</text>
    </g>
  ),
  anaesthesia: () => (
    <g>
      <circle cx="230" cy="130" r="60" fill={BL} stroke={P} strokeWidth="3" />
      {[0, 0.6, 1.2].map((d) => (
        <motion.circle key={d} cx="230" cy="130" r="30" fill="none" stroke={ICE} strokeWidth="3" style={C} animate={{ scale: [0.4, 1.8], opacity: [0.9, 0] }} transition={{ duration: 1.8, delay: d, repeat: Infinity, ease: 'easeOut' }} />
      ))}
      <motion.g animate={{ x: [0, 14, 0] }} transition={loop(2.4)}><Syringe x={110} y={120} rot={-70} /></motion.g>
    </g>
  ),
  aspirate: () => (
    <g>
      <ellipse cx="150" cy="130" rx="70" ry="52" fill={BL} stroke={P} strokeWidth="3" />
      <path d="M110 120 q 20 -20 40 0 t 40 0" fill="none" stroke={LAV} strokeWidth="2" />
      <path d="M110 140 q 20 -20 40 0 t 40 0" fill="none" stroke={LAV} strokeWidth="2" />
      <line x1="172" y1="128" x2="292" y2="96" stroke={P9} strokeWidth="2.5" />
      <rect x="290" y="70" width="80" height="34" rx="6" fill={W} stroke={P9} strokeWidth="2.5" transform="rotate(-15 330 87)" />
      {[0, 0.5, 1, 1.5].map((d) => <motion.circle key={d} r="3.5" fill={P} animate={{ cx: [172, 310], cy: [128, 90], opacity: [0, 1, 1, 0] }} transition={{ duration: 2, delay: d, repeat: Infinity, ease: 'linear', times: [0, 0.1, 0.9, 1] }} />)}
    </g>
  ),
  microscope: () => (
    <g>
      <path d="M90 200 L170 200 M120 200 L120 170 L150 170 L150 80 L120 60 M100 120 L160 120" fill="none" stroke={P9} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="108" y="40" width="30" height="20" rx="4" fill={P} transform="rotate(-30 123 50)" />
      <motion.line x1="160" y1="110" x2="214" y2="110" stroke={LAV} strokeWidth="2" strokeDasharray="4 4" animate={{ strokeDashoffset: [0, -16] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
      <circle cx="285" cy="110" r="72" fill={LIL} stroke={P} strokeWidth="3" />
      <clipPath id="mscope"><circle cx="285" cy="110" r="70" /></clipPath>
      <g clipPath="url(#mscope)">
        {[[250, 80, 0], [300, 140, 0.5], [320, 80, 1]].map(([x, y, d]) => (
          <motion.g key={`${x}`} animate={{ x: [x - 20, x + 20, x - 20], y: [y, y + 6, y] }} transition={loop(2.6, d)}><Sperm s={0.8} /></motion.g>
        ))}
      </g>
      <motion.circle cx="285" cy="110" r="72" fill="none" stroke={HON} strokeWidth="3" animate={{ opacity: [0, 1, 0] }} transition={loop(2)} />
    </g>
  ),
  saline: () => (
    <g>
      <Uterus />
      <motion.path d="M160 92 Q 200 80 240 92 Q 236 140 200 160 Q 164 140 160 92 Z" fill={ICE} animate={{ opacity: [0, 0.75, 0.75, 0] }} transition={loop(4, 0, { times: [0, 0.4, 0.85, 1] })} />
      <motion.path d="M262 76 Q 300 82 330 66" fill="none" stroke={ICE} strokeWidth="6" strokeLinecap="round" animate={{ pathLength: [0, 0, 1, 1, 0] }} transition={loop(4, 0, { times: [0, 0.4, 0.6, 0.85, 1] })} />
      <motion.path d="M138 76 Q 100 82 70 66" fill="none" stroke={ICE} strokeWidth="6" strokeLinecap="round" animate={{ pathLength: [0, 0, 1, 1, 0] }} transition={loop(4, 0, { times: [0, 0.4, 0.6, 0.85, 1] })} />
      <line x1="200" y1="160" x2="200" y2="238" stroke={P9} strokeWidth="4" strokeLinecap="round" />
      {[0, 0.4, 0.8].map((d) => <motion.circle key={d} cx="200" r="4" fill={ICE} animate={{ cy: [236, 160], opacity: [0, 1, 0] }} transition={{ duration: 1.2, delay: d, repeat: Infinity, ease: 'linear' }} />)}
    </g>
  ),
  talk: () => (
    <g>
      <motion.g animate={{ y: [6, 0, 6] }} transition={loop(3)}>
        <path d="M70 60 h150 a14 14 0 0 1 14 14 v50 a14 14 0 0 1 -14 14 h-110 l-24 20 v-20 h-16 a14 14 0 0 1 -14 -14 v-50 a14 14 0 0 1 14 -14 Z" fill={LIL} stroke={P} strokeWidth="2.5" />
        {[110, 145, 180].map((x, i) => <motion.circle key={x} cx={x} cy="99" r="7" fill={P} animate={{ opacity: [0.25, 1, 0.25] }} transition={loop(1.2, i * 0.2)} />)}
      </motion.g>
      <motion.g animate={{ y: [0, 6, 0] }} transition={loop(3)}>
        <path d="M330 120 h-130 a14 14 0 0 0 -14 14 v40 a14 14 0 0 0 14 14 h90 l24 18 v-18 h16 a14 14 0 0 0 14 -14 v-40 a14 14 0 0 0 -14 -14 Z" fill={W} stroke={P9} strokeWidth="2.5" />
        <rect x="210" y="146" width="96" height="8" rx="4" fill={LAV} opacity="0.6" />
        <rect x="210" y="162" width="64" height="8" rx="4" fill={LAV} opacity="0.6" />
      </motion.g>
    </g>
  ),
  support: () => (
    <g>
      <motion.path d="M200 186 C 120 140, 100 90, 140 66 C 168 50, 192 66, 200 86 C 208 66, 232 50, 260 66 C 300 90, 280 140, 200 186 Z" fill={P}
        style={C} animate={{ scale: [1, 1.08, 1] }} transition={loop(1.6)} />
      {[0, 0.8].map((d) => (
        <motion.path key={d} d="M200 186 C 120 140, 100 90, 140 66 C 168 50, 192 66, 200 86 C 208 66, 232 50, 260 66 C 300 90, 280 140, 200 186 Z" fill="none" stroke={LAV} strokeWidth="3"
          style={C} animate={{ scale: [1, 1.5], opacity: [0.7, 0] }} transition={{ duration: 1.6, delay: d, repeat: Infinity, ease: 'easeOut' }} />
      ))}
    </g>
  ),
  plan: () => (
    <g>
      <line x1="70" y1="190" x2="330" y2="190" stroke={P9} strokeWidth="3" strokeLinecap="round" />
      {[0, 1, 2, 3].map((i) => (
        <motion.rect key={i} x={95 + i * 60} width="36" rx="6" fill={i === 3 ? P : LAV} animate={{ height: [0, 40 + i * 30, 40 + i * 30, 0], y: [190, 150 - i * 30, 150 - i * 30, 190] }} transition={loop(4, i * 0.25, { times: [0, 0.3, 0.85, 1] })} />
      ))}
      <motion.path d="M113 140 L173 110 L233 80 L293 46" fill="none" stroke={HON} strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" animate={{ pathLength: [0, 0, 1, 1, 0] }} transition={loop(4, 0, { times: [0, 0.3, 0.6, 0.85, 1] })} />
    </g>
  ),
  money: () => (
    <g>
      <rect x="80" y="54" width="150" height="140" rx="14" fill={W} stroke={P9} strokeWidth="3" />
      <rect x="80" y="54" width="150" height="34" rx="14" fill={P} /><rect x="80" y="74" width="150" height="14" fill={P} />
      <text x="155" y="76" textAnchor="middle" fontSize="12" fill={W} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700">PACKAGE</text>
      {[0, 1, 2].map((i) => (
        <g key={i}><Tick x={96} y={114 + i * 28} delay={i * 0.4} /><rect x="124" y={108 + i * 28} width="88" height="8" rx="4" fill={LAV} opacity="0.5" /></g>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <motion.g key={i} animate={{ y: [-60, 0], opacity: [0, 1, 1, 0] }} transition={loop(3.2, i * 0.35, { times: [0, 0.3, 0.85, 1] })}>
          <ellipse cx="290" cy={190 - i * 14} rx="34" ry="10" fill={HON} stroke="#A87A24" strokeWidth="2" />
        </motion.g>
      ))}
    </g>
  ),
  lifestyle: () => (
    <g>
      <circle cx="200" cy="120" r="80" fill={LIL} />
      <motion.path d="M200 160 C 150 130, 140 100, 160 84 C 176 72, 194 82, 200 96 C 206 82, 224 72, 240 84 C 260 100, 250 130, 200 160 Z" fill={P}
        style={C} animate={{ scale: [1, 1.12, 1] }} transition={loop(1.4)} />
      {[[110, 70], [300, 80], [120, 180], [290, 176]].map(([x, y], i) => (
        <motion.g key={i} animate={{ y: [0, -8, 0] }} transition={loop(2.4, i * 0.3)}>
          <circle cx={x} cy={y} r="18" fill={W} stroke={LAV} strokeWidth="2" />
          <path d={i % 2 ? `M${x - 8} ${y} h16 M${x} ${y - 8} v16` : `M${x - 7} ${y + 4} q7 -16 14 0`} fill="none" stroke="#2F7D5B" strokeWidth="3" strokeLinecap="round" />
        </motion.g>
      ))}
    </g>
  ),
}

/* Which scene illustrates each step, per treatment (order matches `steps` in data/treatments.ts) */
const sceneMap: Record<string, string[]> = {
  ivf: ['hormone', 'retrieval', 'fertilize', 'embryo', 'transfer', 'test'],
  icsi: ['retrieval', 'select-sperm', 'inject', 'transfer'],
  iui: ['follicles', 'sperm-prep', 'inseminate', 'test'],
  'egg-freezing': ['ultrasound', 'hormone', 'retrieval', 'freeze'],
  'semen-freezing': ['collect', 'sperm-prep', 'freeze', 'storage'],
  'embryo-freezing': ['embryo', 'microscope', 'freeze', 'storage'],
  folliculometry: ['calendar', 'ultrasound', 'follicles', 'plan'],
  tvs: ['talk', 'ultrasound', 'evaluate'],
  'ssg-sis': ['saline', 'ultrasound', 'talk'],
  laparoscopy: ['evaluate', 'scope', 'recovery'],
  hysteroscopy: ['hysteroscope', 'ultrasound', 'remove'],
  'laparoscopic-myomectomy': ['ultrasound', 'remove', 'recovery'],
  tesa: ['anaesthesia', 'aspirate', 'microscope'],
  'trial-tesa': ['aspirate', 'microscope', 'freeze'],
  pesa: ['anaesthesia', 'aspirate', 'sperm-prep'],
  'psychological-counseling': ['talk', 'support', 'calendar'],
  'financial-counseling': ['evaluate', 'money', 'plan'],
  'medical-history-evaluation': ['evaluate', 'lifestyle', 'plan'],
}

const STEP_VH = 55 // scroll distance per step while pinned
const PIN_TOP = 88 // pinned position, just under the header

/** "How it works": the section pins to the screen while you scroll through it. Each stretch of
 *  scroll moves the marker to the next step name and plays that step's animation in place. */
export function StepAnimation({ slug, steps }: { slug: string; steps: { title: string; text: string }[] }) {
  const [active, setActive] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const keys = sceneMap[slug] ?? []
  const n = steps.length

  // While pinned, every step gets STEP_VH of scroll
  const range = () => (window.innerHeight * STEP_VH * n) / 100
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', () => {
    const el = ref.current
    if (!el) return
    const v = (PIN_TOP - el.getBoundingClientRect().top) / range()
    setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n))))
  })
  useEffect(() => { setActive(0) }, [slug])

  const Scene = scenes[keys[active]] ?? scenes.evaluate
  // jump to the middle of a step's stretch of scroll
  const go = (i: number) => {
    const el = ref.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - PIN_TOP
    scrollToTarget(Math.round(top + ((i + 0.5) / n) * range()))
  }

  return (
    <div ref={ref} className="relative">
      {/* On larger screens the pinned panel fills the screen under the header */}
      <div className="sticky md:h-[calc(100svh-88px)]" style={{ top: PIN_TOP }}>
        <div className="container-x flex h-full w-full flex-col pb-6 md:pb-10">
          <h2 className="h2 text-balance">Your journey, <em className="text-plum">step by step</em></h2>
          <div className="mt-4 grid flex-1 items-center gap-4 md:mt-6 md:grid-cols-[1.1fr_.9fr] md:gap-14">
            {/* Animation: no box, it simply appears for the current step, on a soft glow */}
            <div className="relative mx-auto aspect-[5/3] w-full max-w-[46rem] max-h-[22svh] md:max-h-[62svh]">
              {/* phones: no sideways spread, so the glow doesn't poke past the screen edge */}
              <div aria-hidden className="pointer-events-none absolute inset-x-0 inset-y-[-8%] rounded-full md:inset-[-8%] bg-[radial-gradient(closest-side,rgba(123,107,176,.16),rgba(235,227,244,.5)_55%,transparent)]" />
              <AnimatePresence mode="wait">
                <motion.span key={active} aria-hidden className="pointer-events-none absolute -left-2 -top-6 select-none font-display text-[7rem] leading-none text-plum/[.07] md:-top-10 md:text-[11rem]"
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45 }}>{String(active + 1).padStart(2, '0')}</motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.svg key={active} viewBox="0 0 400 240" className="absolute inset-0 h-full w-full" role="img" aria-label={`Step ${active + 1}: ${steps[active].title}`}
                  initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -24, scale: 0.97 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                  {Scene()}
                </motion.svg>
              </AnimatePresence>
            </div>

            {/* Step names stay put; the marker moves from one to the next */}
            <div className="w-full max-w-[34rem]">
              <p className="text-eyebrow font-semibold uppercase text-plum">Step {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</p>
              <ol className="relative mt-3 md:mt-[clamp(0.5rem,2.2vh,1.5rem)]">
                <span aria-hidden className="absolute bottom-4 left-[15px] top-4 w-px bg-line" />
                {steps.map((s, i) => (
                  <li key={s.title} className="relative">
                    <button type="button" onClick={() => go(i)} className="group flex w-full items-start gap-4 py-1 text-left md:py-[clamp(0.2rem,1.3vh,0.875rem)]">
                      <span className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border font-display text-sm transition duration-300 ${i === active ? 'border-plum bg-plum text-white' : i < active ? 'border-plum bg-lilac text-plum' : 'border-line bg-paper text-muted'}`}>
                        {i === active && <motion.span layoutId={`how-marker-${slug}`} className="absolute -inset-1.5 rounded-full ring-4 ring-lilac" transition={{ type: 'spring', stiffness: 320, damping: 30 }} />}
                        <span className="relative">{i + 1}</span>
                      </span>
                      <span className="min-w-0 pt-1">
                        <span className={`block font-sans font-semibold tracking-normal transition-all duration-300 ${i === active ? 'text-lg text-plum md:text-[clamp(1.125rem,2.6vh,1.5rem)]' : 'text-[0.9375rem] text-ink-2/60 group-hover:text-ink-2 md:text-[clamp(0.9375rem,2vh,1.125rem)]'}`}>{s.title}</span>
                        <AnimatePresence initial={false}>
                          {i === active && (
                            <motion.span key="d" className="block overflow-hidden text-ink-2" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                              <span className="block text-pretty pt-1 text-[0.9375rem] leading-relaxed max-md:text-justify max-md:[hyphens:auto] md:pt-[clamp(0.25rem,0.8vh,0.5rem)] md:text-[clamp(0.9375rem,2vh,1.125rem)]">{s.text}</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      {/* scroll room while the panel above stays pinned (sticky needs content, not padding) */}
      <div aria-hidden style={{ height: `${n * STEP_VH}vh` }} />
    </div>
  )
}
