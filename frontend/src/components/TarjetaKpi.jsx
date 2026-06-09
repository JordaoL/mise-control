import { IconoInfo } from './Tooltip'

const ACCENT = {
  neutro:   { line: 'var(--border)',  val: 'var(--t1)'    },
  verde:    { line: 'var(--ok)',      val: 'var(--ok)'    },
  amarillo: { line: 'var(--warn)',    val: 'var(--warn)'  },
  rojo:     { line: 'var(--danger)',  val: 'var(--danger)'},
  terra:    { line: 'var(--terra)',   val: 'var(--terra)' },
}

export default function TarjetaKpi({ etiqueta, valor, tooltip, color = 'neutro' }) {
  const ac = ACCENT[color] ?? ACCENT.neutro
  return (
    <div
      className="card relative overflow-hidden flex flex-col justify-between"
      style={{ padding: '20px 22px 18px' }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: ac.line }} />
      <div className="flex items-center justify-between mb-3">
        <span className="section-label">{etiqueta}</span>
        {tooltip && <IconoInfo texto={tooltip} />}
      </div>
      <p
        className="serif"
        style={{ fontSize: '30px', fontWeight: 700, color: ac.val, lineHeight: 1, letterSpacing: '-0.02em' }}
      >
        {valor}
      </p>
    </div>
  )
}
