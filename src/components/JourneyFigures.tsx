/* Hand-made illustrations for the landing page's "Your fertility journey" cards.
   Each is a standalone figure (no square background) in a soft 3D style: a pastel glow disc behind her, shaded skin,
   glossy hair, detailed eyes, folded dupatta, rim light, a drop shadow and a ground shadow. */

type Kind = 'conceive' | 'miscarriage' | 'preparing' | 'freezing'
type Mood = 'worried' | 'sad' | 'calm' | 'tender'

function Defs({ id, cloth, glow }: { id: string; cloth: [string, string]; glow: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-skin`} cx="0.4" cy="0.32" r="0.78">
        <stop offset="0%" stopColor="#F2C4A6" />
        <stop offset="70%" stopColor="#DFA07E" />
        <stop offset="100%" stopColor="#C68262" />
      </radialGradient>
      <linearGradient id={`${id}-hair`} x1="0.25" y1="0" x2="0.75" y2="1">
        <stop offset="0%" stopColor="#5A3644" />
        <stop offset="55%" stopColor="#2E1B24" />
        <stop offset="100%" stopColor="#1A0F15" />
      </linearGradient>
      <linearGradient id={`${id}-cloth`} x1="0.1" y1="0" x2="0.9" y2="1">
        <stop offset="0%" stopColor={cloth[0]} />
        <stop offset="100%" stopColor={cloth[1]} />
      </linearGradient>
      <radialGradient id={`${id}-sheen`} cx="0.3" cy="0.15" r="0.75">
        <stop offset="0%" stopColor="#fff" stopOpacity=".38" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-iris`} cx="0.4" cy="0.35" r="0.7">
        <stop offset="0%" stopColor="#7A4A3A" />
        <stop offset="100%" stopColor="#2A1510" />
      </radialGradient>
      <radialGradient id={`${id}-glow`} cx="0.5" cy="0.45" r="0.5">
        <stop offset="0%" stopColor={glow} stopOpacity=".55" />
        <stop offset="70%" stopColor={glow} stopOpacity=".25" />
        <stop offset="100%" stopColor={glow} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}-ground`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#4A1554" stopOpacity=".3" />
        <stop offset="100%" stopColor="#4A1554" stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-depth`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#4A1554" floodOpacity=".22" />
      </filter>
    </defs>
  )
}

/* long hair behind the shoulders (drawn before the body) */
function BackHair({ id }: { id: string }) {
  return (
    <path d="M84 98 C80 52 102 33 123 33 C150 33 168 55 162 100 C162 140 170 176 178 206 C170 216 156 218 148 208 L96 208 C88 218 72 216 64 206 C72 176 84 140 84 98 Z"
      fill={`url(#${id}-hair)`} />
  )
}

/* kameez with a V neckline, shaded sides and a dupatta over the left shoulder */
function Body({ id, scarf }: { id: string; scarf: string }) {
  const torso = 'M60 264 C58 214 68 178 98 165 Q120 158 142 165 C172 178 182 214 180 264 Z'
  return (
    <g>
      <path d={torso} fill={`url(#${id}-cloth)`} />
      {/* side shading and a soft top-left sheen for volume */}
      <path d="M60 264 C58 222 64 192 80 176 C74 200 74 236 78 264 Z" fill="#000" opacity=".1" />
      <path d="M180 264 C182 222 176 192 160 176 C166 200 166 236 162 264 Z" fill="#000" opacity=".12" />
      <path d={torso} fill={`url(#${id}-sheen)`} />
      {/* neckline */}
      <path d="M106 162 Q120 190 134 162 Q120 168 106 162 Z" fill={`url(#${id}-skin)`} />
      <path d="M104 161 Q120 194 136 161" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
      {/* dupatta with folds */}
      <path d="M70 180 C98 188 138 222 168 264 L140 264 C116 232 92 210 64 198 Z" fill={scarf} />
      <path d="M76 190 C100 200 128 228 152 264" stroke="#fff" strokeOpacity=".35" strokeWidth="2" fill="none" />
      <path d="M68 196 C92 208 118 234 142 264" stroke="#000" strokeOpacity=".08" strokeWidth="3" fill="none" />
      {/* rim light on the right shoulder */}
      <path d="M146 166 C164 172 176 188 180 208" stroke="#fff" strokeOpacity=".4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </g>
  )
}

function Eye({ id, x, mood }: { id: string; x: number; mood: Mood }) {
  const y = 96
  if (mood === 'sad') {
    // closed, drooping eyelid with lashes
    return (
      <g stroke="#3A2028" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d={`M${x - 6} ${y - 1} Q${x} ${y + 4} ${x + 6} ${y - 1}`} />
        <path d={`M${x - 3} ${y + 2.5} l-1 2.5 M${x + 1} ${y + 3} l0 2.6 M${x + 4.5} ${y + 1.8} l1 2.4`} strokeWidth="1.3" />
      </g>
    )
  }
  if (mood === 'tender') {
    // happy closed eyes
    return <path d={`M${x - 6} ${y + 1} Q${x} ${y - 5} ${x + 6} ${y + 1}`} stroke="#3A2028" strokeWidth="2.3" strokeLinecap="round" fill="none" />
  }
  const down = mood === 'worried' ? 1.6 : 0
  return (
    <g>
      <ellipse cx={x} cy={y} rx="6.2" ry="5" fill="#fff" />
      <circle cx={x} cy={y + down} r="4" fill={`url(#${id}-iris)`} />
      <circle cx={x} cy={y + down} r="1.8" fill="#120808" />
      <circle cx={x + 1.4} cy={y - 1.2 + down} r="1.3" fill="#fff" />
      {/* upper lid + lash flick; heavier when worried */}
      <path d={`M${x - 6.8} ${y + (mood === 'worried' ? -0.5 : 0.5)} Q${x} ${y - (mood === 'worried' ? 5 : 7)} ${x + 6.8} ${y + (mood === 'worried' ? -0.5 : 0.5)}`} stroke="#2A161E" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d={`M${x + (x < 120 ? -6.5 : 6.5)} ${y - 0.5} l${x < 120 ? -2.4 : 2.4} -2`} stroke="#2A161E" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  )
}

/* face and front hair; the expression follows the mood */
function Head({ id, mood }: { id: string; mood: Mood }) {
  const brows = {
    worried: ['M99 86 Q105 81 112 81', 'M141 86 Q135 81 128 81'],
    sad: ['M99 85 Q105 81 112 82', 'M141 85 Q135 81 128 82'],
    calm: ['M99 84 Q106 79 112 81', 'M141 84 Q134 79 128 81'],
    tender: ['M99 84 Q106 79 112 81', 'M141 84 Q134 79 128 81'],
  }[mood]
  return (
    <g>
      {/* neck with a shadow under the chin */}
      <path d="M109 120 L131 120 L133 162 Q120 168 107 162 Z" fill={`url(#${id}-skin)`} />
      <path d="M109 128 Q120 140 131 128 L131 138 Q120 146 109 138 Z" fill="#A85F44" opacity=".35" />
      {/* ears */}
      <ellipse cx="88" cy="99" rx="5" ry="8" fill="#D4906E" />
      <ellipse cx="152" cy="99" rx="5" ry="8" fill="#D4906E" />
      {/* face */}
      <path d="M88 92 C88 66 102 56 120 56 C138 56 152 66 152 92 C152 116 138 132 120 132 C102 132 88 116 88 92 Z" fill={`url(#${id}-skin)`} />
      <ellipse cx="103" cy="110" rx="7" ry="4.5" fill="#E8767A" opacity=".3" />
      <ellipse cx="137" cy="110" rx="7" ry="4.5" fill="#E8767A" opacity=".3" />
      {/* brows, eyes, nose */}
      <g stroke="#3A2028" strokeWidth="2.4" strokeLinecap="round" fill="none">{brows.map((d) => <path key={d} d={d} />)}</g>
      <Eye id={id} x={106} mood={mood} />
      <Eye id={id} x={134} mood={mood} />
      <path d="M120 101 Q117 109 121.5 110" stroke="#B06A50" strokeWidth="1.7" strokeLinecap="round" fill="none" />
      {/* mouth */}
      {mood === 'worried' && <path d="M113 121 Q120 117 127 121" stroke="#B84A5E" strokeWidth="2.4" strokeLinecap="round" fill="none" />}
      {mood === 'sad' && <path d="M113 122 Q120 118.5 127 122" stroke="#B84A5E" strokeWidth="2.4" strokeLinecap="round" fill="none" />}
      {mood === 'calm' && <path d="M112 118 Q120 124 128 118 Q120 121 112 118 Z" fill="#C24E66" stroke="#C24E66" strokeWidth="1.5" strokeLinejoin="round" />}
      {mood === 'tender' && <path d="M111 117 Q120 127 129 117 Q120 121 111 117 Z" fill="#C24E66" stroke="#C24E66" strokeWidth="1.5" strokeLinejoin="round" />}
      {/* side-parted fringe and hair strands over the shoulders */}
      <path d="M86 102 C82 62 104 42 126 44 C150 46 162 66 156 102 C152 82 144 70 132 64 C120 76 102 82 86 102 Z" fill={`url(#${id}-hair)`} />
      <path d="M86 100 C82 130 86 160 80 194 C88 198 96 196 99 188 C96 160 94 128 92 108 Z" fill={`url(#${id}-hair)`} />
      <path d="M154 100 C158 130 154 160 160 194 C152 198 144 196 141 188 C144 160 146 128 148 108 Z" fill={`url(#${id}-hair)`} />
      {/* glossy highlights */}
      <path d="M104 54 C114 47 132 46 144 54" stroke="#fff" strokeOpacity=".28" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M90 120 C89 140 89 160 86 180" stroke="#fff" strokeOpacity=".14" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* earrings */}
      <circle cx="88" cy="110" r="2.8" fill="#E8C060" /><circle cx="152" cy="110" r="2.8" fill="#E8C060" />
    </g>
  )
}

/* a sleeve (tapered, shaded) ending in a hand */
function Arm({ id, d, hand, rot = 0 }: { id: string; d: string; hand: [number, number]; rot?: number }) {
  return (
    <g>
      <path d={d} stroke={`url(#${id}-cloth)`} strokeWidth="21" strokeLinecap="round" fill="none" />
      <g transform={`rotate(${rot} ${hand[0]} ${hand[1]})`}>
        <ellipse cx={hand[0]} cy={hand[1]} rx="11" ry="9" fill={`url(#${id}-skin)`} />
        <ellipse cx={hand[0] - 8} cy={hand[1] - 3} rx="4" ry="6" transform={`rotate(-25 ${hand[0] - 8} ${hand[1] - 3})`} fill={`url(#${id}-skin)`} />
      </g>
    </g>
  )
}

export function JourneyFigure({ kind, className = '' }: { kind: Kind; className?: string }) {
  const id = `jf-${kind}`
  const look = {
    conceive: { cloth: ['#C29AE0', '#80298F'] as [string, string], scarf: '#F0B7F4', glow: '#E7A6F0', mood: 'worried' as const, label: 'A worried woman looking down at a pregnancy test' },
    miscarriage: { cloth: ['#D2C2EC', '#7B6BB0'] as [string, string], scarf: '#F6C6B7', glow: '#C9B6E4', mood: 'sad' as const, label: 'A woman holding herself gently after a loss' },
    preparing: { cloth: ['#F6C2B0', '#C9705E'] as [string, string], scarf: '#C7A1E2', glow: '#F2B8A6', mood: 'calm' as const, label: 'A smiling woman holding her treatment plan, ready to begin' },
    freezing: { cloth: ['#B8D3F0', '#5B6FB0'] as [string, string], scarf: '#EFB2F2', glow: '#A9C7EA', mood: 'tender' as const, label: 'A happy woman holding a glowing, frozen egg for the future' },
  }[kind]

  return (
    <svg viewBox="0 0 240 280" role="img" aria-label={look.label} className={className}>
      <Defs id={id} cloth={look.cloth} glow={look.glow} />
      {/* pastel glow disc behind her and a ground shadow */}
      <circle cx="120" cy="150" r="112" fill={`url(#${id}-glow)`} />
      <ellipse cx="120" cy="268" rx="88" ry="10" fill={`url(#${id}-ground)`} />
      <g filter={`url(#${id}-depth)`}>
        <BackHair id={id} />
        <Body id={id} scarf={look.scarf} />
        <Head id={id} mood={look.mood} />

        {kind === 'conceive' && (
          <g>
            {/* one hand resting on her temple, the other holding the test */}
            <Arm id={id} d="M170 232 C178 192 172 140 156 104" hand={[152, 96]} rot={-35} />
            <Arm id={id} d="M70 236 C80 222 92 214 104 212" hand={[108, 208]} rot={10} />
            <g transform="rotate(-24 118 200)">
              <rect x="104" y="193" width="44" height="12" rx="6" fill="#fff" stroke="#EADCF2" strokeWidth="1" />
              <rect x="134" y="193" width="18" height="12" rx="6" fill="#E86A9A" />
              <rect x="116" y="196" width="12" height="6" rx="2" fill="#F4E9F7" />
              <rect x="121" y="196.5" width="2" height="5" fill="#E86A9A" />
            </g>
            <ellipse cx="108" cy="208" rx="11" ry="9" fill={`url(#${id}-skin)`} />
            {/* worry marks */}
            <g stroke="#B25FBF" strokeWidth="2.2" strokeLinecap="round"><path d="M70 66 l-8 -6" /><path d="M66 80 l-10 -1" /></g>
          </g>
        )}

        {kind === 'miscarriage' && (
          <g>
            <Arm id={id} d="M66 214 C82 236 116 240 148 226" hand={[152, 224]} rot={-10} />
            <Arm id={id} d="M174 214 C160 236 126 244 94 232" hand={[90, 230]} rot={190} />
            {/* a tear */}
            <path d="M104 101 C101.5 107 101.5 110 104 111.5 C106.5 110 106.5 107 104 101 Z" fill="#A9D6F5" />
            {/* a softly cracked heart floating beside her */}
            <g transform="translate(172 52)">
              <path d="M0 9 C0 -2 15 -4 17 7 C19 -4 34 -2 34 9 C34 22 17 30 17 35 C17 30 0 22 0 9 Z" fill="#E7A6F0" />
              <path d="M5 6 C7 2 11 1 13 3" stroke="#fff" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M17 7 L14 15 L19 19 L16 28" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          </g>
        )}

        {kind === 'preparing' && (
          <g>
            {/* clipboard with a ticked plan */}
            <g transform="rotate(-6 120 214)">
              <rect x="86" y="178" width="68" height="80" rx="9" fill="#fff" />
              <rect x="86" y="178" width="68" height="80" rx="9" fill="none" stroke="#E2D4EC" strokeWidth="2" />
              <rect x="106" y="172" width="28" height="12" rx="4" fill="#80298F" />
              {[198, 216, 234].map((y) => (
                <g key={y}>
                  <circle cx="100" cy={y} r="6" fill="#F3E6F8" />
                  <path d={`M97 ${y} l2.4 2.6 l4.4 -5`} stroke="#80298F" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <rect x="112" y={y - 2.5} width="32" height="5" rx="2.5" fill="#E7D3EE" />
                </g>
              ))}
            </g>
            <Arm id={id} d="M66 236 C72 228 78 224 84 222" hand={[86, 222]} rot={20} />
            <Arm id={id} d="M174 236 C168 226 162 220 156 216" hand={[155, 214]} rot={160} />
            {/* calendar badge */}
            <g transform="translate(168 44)">
              <rect width="40" height="38" rx="9" fill="#fff" />
              <rect width="40" height="12" rx="6" fill="#B25FBF" />
              <rect y="6" width="40" height="6" fill="#B25FBF" />
              <circle cx="13" cy="24" r="3.4" fill="#E7A6F0" /><circle cx="27" cy="24" r="3.4" fill="#80298F" />
            </g>
          </g>
        )}

        {kind === 'freezing' && (
          <g>
            <defs>
              <radialGradient id={`${id}-orb`} cx="0.38" cy="0.32" r="0.72">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="55%" stopColor="#DCEEFF" />
                <stop offset="100%" stopColor="#8AB4EC" />
              </radialGradient>
              <radialGradient id={`${id}-halo`} cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#D2E8FF" stopOpacity=".95" />
                <stop offset="100%" stopColor="#D2E8FF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="120" cy="204" r="46" fill={`url(#${id}-halo)`} />
            <circle cx="120" cy="202" r="24" fill={`url(#${id}-orb)`} />
            <g stroke="#5B8FD6" strokeWidth="2.2" strokeLinecap="round">
              <path d="M120 190 V214" /><path d="M109.6 196 L130.4 208" /><path d="M109.6 208 L130.4 196" />
            </g>
            <Arm id={id} d="M68 232 C76 228 84 226 90 226" hand={[92, 224]} rot={20} />
            <Arm id={id} d="M172 232 C164 228 156 226 150 226" hand={[148, 224]} rot={160} />
            {[[176, 66], [62, 122], [186, 150]].map(([x, y]) => (
              <path key={x} d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2} Z`} fill="#8FB4E6" />
            ))}
          </g>
        )}
      </g>
    </svg>
  )
}
