import { IconoInfo } from './Tooltip'

const ESTADO = {
  ok:      { label: 'Óptimo',    bg: 'var(--ok-bg)',     color: 'var(--ok)',     border: '#A7F3D0', bar: 'var(--ok-mid)' },
  atencao: { label: 'Atención',  bg: 'var(--warn-bg)',   color: 'var(--warn)',   border: '#FDE68A', bar: '#C47000'       },
  critico: { label: 'Crítico',   bg: 'var(--danger-bg)', color: 'var(--danger)', border: '#FECACA', bar: 'var(--danger)' },
}

function BarraStock({ actual, minimo, ideal }) {
  const escala = ideal * 1.4
  const pctActual = Math.min((actual / escala) * 100, 100)
  const pctMin    = (minimo / escala) * 100
  const pctIdeal  = (ideal  / escala) * 100
  const colorBarra = actual <= minimo ? 'var(--danger)' : actual < ideal ? '#C47000' : 'var(--ok-mid)'

  return (
    <div style={{ position: 'relative', height: '6px', borderRadius: '3px', background: 'var(--border-l)', margin: '8px 0 4px' }}>
      {/* fill */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        height: '100%', borderRadius: '3px',
        width: `${pctActual}%`,
        background: colorBarra,
        transition: 'width 0.7s ease',
      }} />
      {/* marcador mínimo */}
      <div style={{
        position: 'absolute', top: '-3px',
        left: `${pctMin}%`,
        width: '2px', height: '12px',
        background: 'var(--danger)',
        opacity: 0.6,
        borderRadius: '1px',
      }} />
      {/* marcador ideal */}
      <div style={{
        position: 'absolute', top: '-3px',
        left: `${pctIdeal}%`,
        width: '2px', height: '12px',
        background: 'var(--ok)',
        opacity: 0.6,
        borderRadius: '1px',
      }} />
    </div>
  )
}

export default function PanelStock({ alertas }) {
  if (!alertas?.length) {
    return (
      <div className="card" style={{ padding: '24px' }}>
        <p style={{ color: 'var(--t3)' }}>Sin alertas de stock.</p>
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: '24px 26px' }}>
      <div className="flex items-center gap-1.5 mb-5">
        <span className="section-label">Alertas de Stock</span>
        <IconoInfo texto="Compara el stock actual (GStock, cierre de día) con las reglas de mínimo e ideal. Crítico: por debajo del mínimo. Atención: entre mínimo e ideal. Óptimo: por encima del ideal." />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {alertas.map((a, i) => {
          const cfg = ESTADO[a.estado] ?? ESTADO.ok
          return (
            <div
              key={i}
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: '12px',
                padding: '14px 16px',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--t1)', marginBottom: '1px' }}>
                    {a.nombre}
                  </p>
                  <p className="mono" style={{ fontSize: '11px', color: 'var(--t2)' }}>
                    {a.actual_kg}{a.unidad} actual
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="serif"
                    style={{ fontSize: '22px', fontWeight: 700, color: cfg.color, lineHeight: 1 }}
                  >
                    {a.actual_kg}
                    <span style={{ fontSize: '13px', fontWeight: 400 }}>{a.unidad}</span>
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      borderRadius: '20px',
                      background: cfg.color,
                      color: '#fff',
                    }}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>

              <BarraStock actual={a.actual_kg} minimo={a.minimo_kg} ideal={a.ideal_kg} />

              <div className="flex justify-between" style={{ fontSize: '10px', color: 'var(--t3)' }}>
                <span>
                  <span style={{ color: 'var(--danger)', opacity: 0.7, marginRight: '2px' }}>|</span>
                  mín {a.minimo_kg}{a.unidad}
                </span>
                <span>
                  ideal {a.ideal_kg}{a.unidad}
                  <span style={{ color: 'var(--ok)', opacity: 0.7, marginLeft: '2px' }}>|</span>
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-5" style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-l)' }}>
        {[
          { color: 'var(--ok-mid)',  label: 'Óptimo: ≥ ideal' },
          { color: '#C47000',        label: 'Atención: entre mín e ideal' },
          { color: 'var(--danger)',  label: 'Crítico: ≤ mínimo' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5" style={{ fontSize: '10px', color: 'var(--t3)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: color, display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
