/* Draws the booking confirmation as a clean PNG (no extra libraries) and downloads it.
   Layout: plum clinic header, green tick + thank-you line, a table of the booking details, and a closing note. */

const C = { plum900: '#2E0D36', plum: '#80298F', lilac: '#EBE3F4', ink: '#24122B', ink2: '#4A3A50', muted: '#6B5A70', line: '#E7DDE6', ok: '#2F7D5B', mist: '#F3EEF6' }

type Clinic = { name: string; address: string; hotline: string; email: string }

export async function downloadConfirmation(opts: { firstName: string; phone: string; rows: [string, string][]; clinic: Clinic; fileName: string }) {
  const { firstName, phone, rows, clinic, fileName } = opts
  await (document as Document & { fonts?: FontFaceSet }).fonts?.ready
  const sans = getComputedStyle(document.body).fontFamily || 'system-ui, sans-serif'
  const display = getComputedStyle(document.querySelector('h1, h2') ?? document.body).fontFamily || sans

  const W = 1080, PAD = 72, SCALE = 2
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const font = (size: number, weight = 400, fam = sans) => `${weight} ${size}px ${fam}`

  // wrap text to a width, returns the lines
  const wrap = (text: string, width: number, f: string) => {
    ctx.font = f
    const words = text.split(' '), lines: string[] = []
    let cur = ''
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w
      if (ctx.measureText(next).width > width && cur) { lines.push(cur); cur = w } else cur = next
    }
    if (cur) lines.push(cur)
    return lines
  }

  // measure first so the canvas is exactly as tall as the content
  const ROW_H = 64
  const valueW = W - PAD * 2 - 48 - 260
  const rowLines = rows.map(([, v]) => wrap(v || '—', valueW, font(26, 600)))
  const rowsH = rowLines.reduce((h, l) => h + Math.max(ROW_H, 26 + l.length * 34), 0)
  const intro = wrap(`Your request is with our care team. We will call ${phone} within 24 hours to confirm.`, W - PAD * 2, font(28))
  // the note sits inside a panel with 24px padding on each side
  const note = wrap('Please keep this confirmation and bring a photo ID to your appointment. Our care team will call you to confirm the final time.', W - PAD * 2 - 48, font(24))
  const HEADER = 230
  const H = HEADER + 70 + 96 + 40 + 66 + intro.length * 40 + 40 + rowsH + 50 + note.length * 34 + 60 + 40

  canvas.width = W * SCALE; canvas.height = H * SCALE
  ctx.scale(SCALE, SCALE)
  ctx.textBaseline = 'alphabetic'

  // background + header
  ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H)
  ctx.fillStyle = C.plum900; ctx.fillRect(0, 0, W, HEADER)
  ctx.fillStyle = '#FFFFFF'; ctx.font = font(44, 400, display); ctx.fillText(clinic.name, PAD, 96)
  ctx.fillStyle = 'rgba(255,255,255,.78)'; ctx.font = font(22)
  wrap(clinic.address, W - PAD * 2, font(22)).forEach((l, i) => ctx.fillText(l, PAD, 140 + i * 30))
  ctx.fillText(`Hotline ${clinic.hotline}  ·  ${clinic.email}`, PAD, 140 + wrap(clinic.address, W - PAD * 2, font(22)).length * 30 + 8)

  let y = HEADER + 70
  // label
  ctx.fillStyle = C.plum; ctx.font = font(20, 700); ctx.fillText('APPOINTMENT REQUEST', PAD, y)
  ctx.fillStyle = C.muted; ctx.font = font(20)
  const stamp = `Downloaded ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`
  ctx.fillText(stamp, W - PAD - ctx.measureText(stamp).width, y)
  y += 40

  // green tick
  ctx.fillStyle = C.ok; ctx.beginPath(); ctx.arc(PAD + 48, y + 48, 48, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
  ctx.beginPath(); ctx.moveTo(PAD + 28, y + 50); ctx.lineTo(PAD + 43, y + 65); ctx.lineTo(PAD + 70, y + 34); ctx.stroke()
  y += 96 + 40

  // thank-you + intro
  ctx.fillStyle = C.ink; ctx.font = font(52, 400, display); ctx.fillText(`Thank you, ${firstName}.`, PAD, y + 26)
  y += 66
  ctx.fillStyle = C.ink2; ctx.font = font(28)
  intro.forEach((l, i) => ctx.fillText(l, PAD, y + i * 40 + 10))
  y += intro.length * 40 + 40

  // details table
  const tx = PAD, tw = W - PAD * 2
  ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = C.line; ctx.lineWidth = 2
  ctx.beginPath(); ctx.roundRect(tx, y, tw, rowsH, 20); ctx.fill(); ctx.stroke()
  let ry = y
  rows.forEach(([k], i) => {
    const lines = rowLines[i]
    const h = Math.max(ROW_H, 26 + lines.length * 34)
    if (i) { ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx, ry); ctx.lineTo(tx + tw, ry); ctx.stroke() }
    ctx.fillStyle = C.muted; ctx.font = font(24); ctx.fillText(k, tx + 24, ry + 41)
    ctx.fillStyle = C.ink; ctx.font = font(26, 600)
    lines.forEach((l, j) => ctx.fillText(l, tx + tw - 24 - ctx.measureText(l).width, ry + 42 + j * 34))
    ry += h
  })
  y += rowsH + 50

  // closing note on a soft panel
  const noteH = note.length * 34 + 36
  ctx.fillStyle = C.mist; ctx.beginPath(); ctx.roundRect(PAD, y - 6, W - PAD * 2, noteH, 16); ctx.fill()
  ctx.fillStyle = C.ink2; ctx.font = font(24)
  note.forEach((l, i) => ctx.fillText(l, PAD + 24, y + 28 + i * 34))

  const blob: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/png'))
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = fileName
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
