import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RTooltip, ReferenceLine, ResponsiveContainer, Cell,
} from 'recharts'
import { IconoInfo } from './Tooltip'

function colorBarra(d) {
  if (d.desvio_pct === null) return '#C9BFB0'
  if (d.alerta) return d.desvio_pct > 0 ? '#C4441A' : '#965200'
  if (Math.abs(d.desvio_pct) >= 4.5) return '#C47000'
  return '#3A9060'
}

function badgeDesvio(d) {
  if (d.desvio_pct === null) return { txt: '—', bg: '#F4EFE8', color: '#A8998A', border: '#DDD5C8' }
  const v = d.desvio_pct
  const fmt = (v > 0 ? '+' : '') + v + '%'
  if (d.alerta) return { txt: fmt, bg: '#FFF5F5', color: '#B91C1C', border: '#FECACA' }
  if (Math.abs(v) >= 4.5) return { txt: fmt, bg: '#FFF8EC', color: '#965200', border: '#FDE68A' }
  return { txt: fmt, bg: '#EDF7F1', color: '#1F6B3C', border: '#A7F3D0' }
}

const TooltipGrafico = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '12px 14px',
        boxShadow: 'var(--shadow)',
        fontSize: '12px',
        color: 'var(--t1)',
        maxWidth: '220px',
      }}
    >
      <p className="serif" style={{ fontWeight: 600, marginBottom: '6px', fontSize: '13px' }}>
        {d.ingrediente}
      </p>
      {d.apertura_kg !== null ? (
        <>
          <p style={{ color: 'var(--t2)' }}>
            Apertura: <span className="mono" style={{ color: 'var(--t1)' }}>{d.apertura_kg} kg</span>
            <span style={{ color: 'var(--t3)', fontSize: '11px' }}> (sim.)</span>
          </p>
          <p style={{ color: 'var(--t2)' }}>
            Cierre: <span className="mono" style={{ color: 'var(--t1)' }}>{d.fecho_kg} kg</span>
            <span style={{ color: 'var(--t3)', fontSize: '11px' }}> (GStock)</span>
          </p>
          <div style={{ borderTop: '1px solid var(--border-l)', margin: '8px 0 6px' }} />
          <p style={{ color: 'var(--t2)' }}>
            Consumo real: <span className="mono" style={{ color: 'var(--t1)', fontWeight: 500 }}>{d.real_kg} kg</span>
          </p>
          <p style={{ color: 'var(--t2)' }}>
            Consumo teórico: <span className="mono" style={{ color: 'var(--t1)' }}>{d.teorico_kg} kg</span>
          </p>
          <p
            className="mono"
            style={{
              fontWeight: 700,
              marginTop: '4px',
              color: d.alerta ? 'var(--danger)' : Math.abs(d.desvio_pct) >= 4.5 ? 'var(--warn)' : 'var(--ok)',
            }}
          >
            Desvío: {d.desvio_pct > 0 ? '+' : ''}{d.desvio_pct}%
          </p>
        </>
      ) : (
        <p style={{ color: 'var(--t3)' }}>Sin stock de apertura</p>
      )}
    </div>
  )
}

export default function PanelDesvios({ desvios }) {
  if (!desvios?.length) {
    return (
      <div className="card" style={{ padding: '24px' }}>
        <p style={{ color: 'var(--t3)' }}>Sin datos de cruce disponibles.</p>
      </div>
    )
  }

  const haySimulados = desvios.some(d => d.es_simulado)

  return (
    <div className="card" style={{ padding: '24px 26px' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="section-label">Desvío Mise en Place</span>
          <IconoInfo texto="Compara el consumo real (apertura − cierre de stock) con el consumo teórico según receta. Un desvío positivo indica que se usó más de lo previsto. Alerta si supera el ±5%." />
        </div>
        {haySimulados && (
          <span
            style={{
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '2px 8px',
              borderRadius: '20px',
              background: 'var(--warn-bg)',
              color: 'var(--warn)',
              border: '1px solid #FDE68A',
            }}
          >
            Apertura simulada
          </span>
        )}
      </div>

      {haySimulados && (
        <p style={{ fontSize: '11px', color: 'var(--t3)', marginBottom: '16px', lineHeight: 1.5 }}>
          El JSON actual solo registra stock de cierre. Los valores de apertura son estimados para ilustrar el cálculo.
        </p>
      )}

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={desvios} margin={{ top: 4, right: 4, left: -20, bottom: 4 }} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-l)" vertical={false} />
          <XAxis
            dataKey="ingrediente"
            tick={{ fill: 'var(--t3)', fontSize: 11, fontFamily: 'DM Sans' }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--t3)', fontSize: 11, fontFamily: 'DM Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}%`}
          />
          <RTooltip content={<TooltipGrafico />} cursor={{ fill: 'rgba(196,68,26,0.04)' }} />
          <ReferenceLine y={5}  stroke="#B91C1C" strokeDasharray="4 3" strokeOpacity={0.4} />
          <ReferenceLine y={-5} stroke="#B91C1C" strokeDasharray="4 3" strokeOpacity={0.4} />
          <Bar dataKey="desvio_pct" radius={[5, 5, 0, 0]}>
            {desvios.map((d, i) => <Cell key={i} fill={colorBarra(d)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Tabla detalle */}
      <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-l)', paddingTop: '16px' }}>
        {desvios.map((d, i) => {
          const badge = badgeDesvio(d)
          const pctAbs = d.desvio_pct !== null ? Math.abs(d.desvio_pct) : 0
          return (
            <div
              key={i}
              style={{
                marginBottom: i < desvios.length - 1 ? '14px' : 0,
              }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                <div>
                  <span style={{ fontWeight: 500, color: 'var(--t1)', fontSize: '13px' }}>
                    {d.ingrediente}
                  </span>
                  {d.apertura_kg !== null && (
                    <span
                      className="mono"
                      style={{ fontSize: '11px', color: 'var(--t3)', marginLeft: '8px' }}
                    >
                      {d.apertura_kg}→{d.fecho_kg} kg · real <strong style={{ color: 'var(--t2)' }}>{d.real_kg}</strong> vs teo. <strong style={{ color: 'var(--t2)' }}>{d.teorico_kg}</strong>
                    </span>
                  )}
                </div>
                <span
                  className="mono"
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: badge.bg,
                    color: badge.color,
                    border: `1px solid ${badge.border}`,
                  }}
                >
                  {badge.txt}
                </span>
              </div>
              <div
                style={{
                  height: '4px',
                  borderRadius: '2px',
                  background: 'var(--border-l)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: '2px',
                    width: `${Math.min(pctAbs * 2.5, 100)}%`,
                    background: colorBarra(d),
                    transition: 'width 0.6s ease',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-5" style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-l)' }}>
        {[
          { color: 'var(--danger)', label: '> +5% exceso' },
          { color: 'var(--warn)', label: '> 5% déficit' },
          { color: '#C47000', label: '~5% límite' },
          { color: 'var(--ok-mid)', label: 'Normal' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5" style={{ fontSize: '10px', color: 'var(--t3)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: color, display: 'inline-block', flexShrink: 0 }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
