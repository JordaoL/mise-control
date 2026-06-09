const TIPO_LABEL = {
  receta_final: { texto: 'Receta final', bg: 'var(--terra-bg)', color: 'var(--terra)' },
  subreceta:    { texto: 'Subreceta',    bg: 'var(--border-l)', color: 'var(--t2)'    },
}

function IconCheck() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '16px', height: '16px', borderRadius: '50%',
      background: 'var(--ok-bg)', flexShrink: 0,
    }}>
      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
        <path d="M1 3.5L3.5 6L8 1" stroke="var(--ok)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )
}

function IconX() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: '16px', height: '16px', borderRadius: '50%',
      background: 'var(--danger-bg)', flexShrink: 0,
    }}>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1 1L7 7M7 1L1 7" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </span>
  )
}

function TarjetaReceta({ receta }) {
  const tipo = TIPO_LABEL[receta.tipo] ?? TIPO_LABEL.subreceta

  return (
    <div style={{
      background: receta.completa ? 'var(--card)' : '#FFFAF8',
      border: `1px solid ${receta.completa ? 'var(--border)' : '#F5C8B8'}`,
      borderRadius: '14px',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>
      {/* Header receta */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span style={{
            fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '2px 7px', borderRadius: '20px',
            background: tipo.bg, color: tipo.color,
          }}>
            {tipo.texto}
          </span>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--t2)' }}>
            €{receta.costo}
            <span style={{ color: 'var(--t3)', fontWeight: 400 }}> / ración</span>
          </span>
        </div>
        <p className="serif" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--t1)', lineHeight: 1.2 }}>
          {receta.nombre}
        </p>
      </div>

      {/* Ingredientes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        <p className="section-label" style={{ marginBottom: '2px' }}>Ingredientes</p>
        {receta.ingredientes.map((ing, i) => (
          <div key={i} className="flex items-center gap-2">
            {ing.tiene_inventario ? <IconCheck /> : <IconX />}
            <div style={{ flex: 1 }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 500,
                color: ing.tiene_inventario ? 'var(--t1)' : 'var(--danger)',
              }}>
                {ing.nombre}
              </span>
              <span className="mono" style={{ fontSize: '11px', color: 'var(--t3)', marginLeft: '6px' }}>
                {ing.cantidad}{ing.unidad}
              </span>
            </div>
            {!ing.tiene_inventario && (
              <span style={{
                fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '1px 6px', borderRadius: '4px',
                background: 'var(--danger-bg)', color: 'var(--danger)',
                border: '1px solid #FECACA',
              }}>
                sin datos
              </span>
            )}
            {ing.tipo === 'subreceta' && ing.tiene_inventario && (
              <span style={{
                fontSize: '9px', color: 'var(--t3)', padding: '1px 6px',
                borderRadius: '4px', background: 'var(--border-l)',
              }}>
                subreceta
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Estado */}
      {!receta.completa && (
        <div style={{
          padding: '8px 10px', borderRadius: '8px',
          background: 'var(--danger-bg)', border: '1px solid #FECACA',
          fontSize: '11px', color: 'var(--danger)', lineHeight: 1.5,
        }}>
          {receta.n_sin_inventario === 1
            ? '1 ingrediente sin seguimiento en GStock'
            : `${receta.n_sin_inventario} ingredientes sin seguimiento en GStock`}
        </div>
      )}
    </div>
  )
}

export default function PanelRecetas({ recetas }) {
  if (!recetas?.length) return null

  const ingredientesFaltantes = recetas
    .flatMap(r => r.ingredientes.filter(i => !i.tiene_inventario))
    .filter((ing, idx, arr) => arr.findIndex(x => x.nombre === ing.nombre) === idx)

  return (
    <div className="card" style={{ padding: '24px 26px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="section-label">Recetas e Ingredientes</span>
        </div>
        {ingredientesFaltantes.length > 0 && (
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
            background: 'var(--danger-bg)', color: 'var(--danger)',
            border: '1px solid #FECACA',
          }}>
            {ingredientesFaltantes.length} ingrediente{ingredientesFaltantes.length > 1 ? 's' : ''} sin seguimiento
          </span>
        )}
      </div>

      {/* Grid de recetas */}
      <div className="grid-recetas">
        {recetas.map(r => <TarjetaReceta key={r.id} receta={r} />)}
      </div>

      {/* Resumen de gaps */}
      {ingredientesFaltantes.length > 0 && (
        <div style={{
          borderTop: '1px solid var(--border-l)', paddingTop: '16px',
          display: 'flex', alignItems: 'flex-start', gap: '12px',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
            background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v5M7 10v.5" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="7" cy="7" r="6" stroke="var(--danger)" strokeWidth="1.2"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--t1)', marginBottom: '3px' }}>
              Ingredientes a dar de alta en GStock
            </p>
            <p style={{ fontSize: '11px', color: 'var(--t2)', lineHeight: 1.6 }}>
              {ingredientesFaltantes.map(i => (
                <span key={i.nombre}>
                  <span style={{ fontWeight: 600, color: 'var(--danger)' }}>{i.nombre}</span>
                  <span style={{ color: 'var(--t3)' }}> ({i.cantidad}{i.unidad})</span>
                  {ingredientesFaltantes.indexOf(i) < ingredientesFaltantes.length - 1 ? '  ·  ' : ''}
                </span>
              ))}
            </p>
            <p style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '4px' }}>
              Sin estos registros no es posible calcular el coste real ni el desvío de estas recetas.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
