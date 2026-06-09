import { IconoInfo } from './Tooltip'

function colorFlujo(pct) {
  if (pct >= 60) return 'var(--ok-mid)'
  if (pct >= 40) return '#C47000'
  return 'var(--danger)'
}

function BarraPct({ pct, color }) {
  return (
    <div className="flex items-center gap-3">
      <div
        style={{
          flex: 1,
          height: '5px',
          borderRadius: '3px',
          background: 'var(--border-l)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: '3px',
            width: `${pct}%`,
            background: color,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <span
        className="mono"
        style={{ fontSize: '12px', fontWeight: 500, color: 'var(--t2)', width: '34px', textAlign: 'right', flexShrink: 0 }}
      >
        {pct}%
      </span>
    </div>
  )
}

export default function TablaRendimiento({ camareros }) {
  if (!camareros?.length) return null

  return (
    <div className="card" style={{ padding: '24px 26px' }}>
      <div className="flex items-center gap-1.5 mb-5">
        <span className="section-label">Rendimiento por Camarero</span>
        <IconoInfo texto="Métricas calculadas a partir de los tickets cerrados del día. Solo incluye tickets con camarero asignado." />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ textAlign: 'left', paddingBottom: '10px', color: 'var(--t3)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Camarero
              </th>
              <th style={{ textAlign: 'center', paddingBottom: '10px', color: 'var(--t3)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', width: '80px' }}>
                Tickets
              </th>
              <th style={{ paddingBottom: '10px', color: 'var(--t3)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', width: '220px' }}>
                <span className="flex items-center gap-1">
                  Flujo Ideal
                  <IconoInfo texto="% de tickets donde el camarero siguió la secuencia correcta: bebida antes de comida, marcha correcta y oferta de segunda bebida o postre." />
                </span>
              </th>
              <th style={{ paddingBottom: '10px', color: 'var(--t3)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', width: '220px' }}>
                <span className="flex items-center gap-1">
                  2ª Bebida
                  <IconoInfo texto="% de tickets donde el cliente efectivamente pagó una segunda bebida. Indicador de venta activa y atención a la mesa." />
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {camareros.map((c, i) => (
              <tr
                key={i}
                style={{
                  borderBottom: '1px solid var(--border-l)',
                  background: i % 2 === 0 ? 'transparent' : 'var(--card-warm)',
                }}
              >
                <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--t1)' }}>
                  {c.camarero}
                </td>
                <td style={{ padding: '12px 0', textAlign: 'center' }}>
                  <span
                    className="mono"
                    style={{
                      display: 'inline-block',
                      width: '32px',
                      height: '32px',
                      lineHeight: '32px',
                      textAlign: 'center',
                      borderRadius: '8px',
                      background: 'var(--border-l)',
                      color: 'var(--t2)',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {c.tickets}
                  </span>
                </td>
                <td style={{ padding: '12px 16px 12px 0' }}>
                  <BarraPct pct={c.flujo_ideal_pct} color={colorFlujo(c.flujo_ideal_pct)} />
                </td>
                <td style={{ padding: '12px 0' }}>
                  <BarraPct pct={c.segunda_bebida_pct} color="var(--terra)" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-6" style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-l)' }}>
        {[
          { color: 'var(--ok-mid)', label: 'Flujo ≥ 60%' },
          { color: '#C47000',       label: 'Flujo 40–60%' },
          { color: 'var(--danger)', label: 'Flujo < 40%' },
          { color: 'var(--terra)',  label: '2ª Bebida' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5" style={{ fontSize: '10px', color: 'var(--t3)' }}>
            <span style={{ width: '8px', height: '4px', borderRadius: '2px', background: color, display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
