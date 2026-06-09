import { useEffect, useState } from 'react'
import TarjetaKpi from './components/TarjetaKpi'
import PanelDesvios from './components/PanelDesvios'
import PanelStock from './components/PanelStock'
import TablaRendimiento from './components/TablaRendimiento'
import PanelRecetas from './components/PanelRecetas'

const KPI_TOOLTIPS = {
  tickets:      'Total de comandas cerradas durante el día, sumando almuerzo y cena.',
  comensales:   'Número estimado de clientes. Calculado a partir de los platos principales por ticket — no es un campo nativo de Ágora.',
  facturacion:  'Suma total facturada en el día, incluyendo todos los conceptos (comida, bebida, postres).',
  ticketMedio:  'Facturación total dividida entre el número de tickets. Refleja el gasto medio por mesa.',
  flujoIdeal:   '% de tickets donde el camarero completó la secuencia ideal: bebida antes de comida, marcha correcta y oferta de segunda bebida o postre.',
  tiempoCocina: 'Tiempo medio en minutos entre el envío de comanda y el primer plato listo. Reconstruido a partir de eventos de auditoría de Ágora.',
}

function formatearFecha(str) {
  if (!str) return ''
  const d = new Date(str + 'T00:00:00')
  const dias  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  return `${dias[d.getDay()]}, ${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`
}

function Cabecera({ fecha }) {
  return (
    <header>
      <div style={{ height: '4px', background: 'var(--terra)', width: '100%' }} />
      <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-4">
          <img
            src="/logo.jpg"
            alt="MiseControl"
            style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <p style={{ fontSize: '18px', fontWeight: 700, color: 'var(--t1)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>MiseControl</p>
            <p style={{ fontSize: '11px', color: 'var(--t3)', letterSpacing: '0.06em', marginTop: '2px' }}>Inteligencia operacional</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p className="serif" style={{ fontSize: '17px', fontStyle: 'italic', color: 'var(--t1)', lineHeight: 1.2 }}>My Pasta My Art</p>
          <p style={{ fontSize: '12px', color: 'var(--t2)', marginTop: '2px' }}>{formatearFecha(fecha)}</p>
        </div>
      </div>
    </header>
  )
}

function Cargando() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid var(--border)', borderTopColor: 'var(--terra)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ color: 'var(--t3)', fontSize: '13px' }}>Cargando datos operacionales…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

function ErrorConexion({ mensaje }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--danger-bg)', border: '1px solid #FECACA', borderRadius: '14px', padding: '24px 28px', maxWidth: '400px', textAlign: 'center' }}>
        <p style={{ fontWeight: 700, color: 'var(--danger)', marginBottom: '6px', fontSize: '15px' }}>Error al conectar con el backend</p>
        <p className="mono" style={{ fontSize: '12px', color: 'var(--t3)', wordBreak: 'break-all' }}>{mensaje}</p>
        <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--t3)' }}>Asegúrate de que FastAPI está corriendo en el puerto 8000.</p>
      </div>
    </div>
  )
}

function EstadoDemo() {
  const cols = [
    {
      color: 'var(--ok)', colorBg: 'var(--ok-bg)', colorBorder: '#A7F3D0',
      titulo: 'Datos reales',
      items: ['KPIs del día (tickets, facturación, ticket medio)', 'Rendimiento por camarero (flujo ideal, 2ª bebida)', 'Stock de cierre y alertas mínimo/ideal', 'Consumo teórico calculado por receta'],
    },
    {
      color: 'var(--warn)', colorBg: 'var(--warn-bg)', colorBorder: '#FDE68A',
      titulo: 'Simulado para el demo',
      items: ['Stock de apertura (campo stock_apertura_simulado)', 'El JSON solo contiene cierre de día — sin apertura no hay consumo real', 'Los desvíos son correctos en cálculo, pero parten de una apertura estimada'],
    },
    {
      color: '#1D5FA8', colorBg: '#EFF6FF', colorBorder: '#BFDBFE',
      titulo: 'Con acceso a APIs',
      items: ['Apertura real desde GStock (movimientos)', 'Consumo real por servicio, no solo snapshot final', 'Histórico multi-día para análisis de tendencias', 'Comensales como campo nativo de Ágora'],
    },
  ]

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border-l)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-2">
          <span className="section-label">Estado del Demo</span>
          <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: 'var(--border-l)', color: 'var(--t3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>v0.1 · Datos sintéticos</span>
        </div>
        <p className="serif" style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--t3)' }}>Validación de estructura — MPMA Espíritu Santo 16</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {cols.map((col, i) => (
          <div key={i} style={{ padding: '18px 22px', borderRight: i < 2 ? '1px solid var(--border-l)' : 'none', background: col.colorBg }}>
            <div className="flex items-center gap-2 mb-3">
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: col.color, display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: col.color, letterSpacing: '0.04em' }}>{col.titulo}</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {col.items.map((item, j) => (
                <li key={j} style={{ fontSize: '11px', color: 'var(--t2)', paddingLeft: '10px', position: 'relative', lineHeight: 1.6, marginBottom: '3px' }}>
                  <span style={{ position: 'absolute', left: 0, color: col.color, opacity: 0.6 }}>·</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/todo')
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then(d => { setDatos(d); setCargando(false) })
      .catch(e => { setError(e.message); setCargando(false) })
  }, [])

  if (cargando) return <Cargando />
  if (error)    return <ErrorConexion mensaje={error} />

  const { resumen, desvios, alertas_stock, recetas, fecha } = datos

  return (
    <div style={{ minHeight: '100vh' }}>
      <Cabecera fecha={fecha} />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 40px 48px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '28px' }}>
          <TarjetaKpi etiqueta="Tickets"         valor={resumen.n_tickets}                                                    tooltip={KPI_TOOLTIPS.tickets} />
          <TarjetaKpi etiqueta="Comensales"      valor={resumen.comensales}                                                   tooltip={KPI_TOOLTIPS.comensales} />
          <TarjetaKpi etiqueta="Facturación"     valor={`€${resumen.facturacion.toLocaleString('es-ES')}`} color="verde"      tooltip={KPI_TOOLTIPS.facturacion} />
          <TarjetaKpi etiqueta="Ticket Medio"    valor={`€${resumen.ticket_medio}`}                        color="verde"      tooltip={KPI_TOOLTIPS.ticketMedio} />
          <TarjetaKpi
            etiqueta="Flujo Ideal"
            valor={`${resumen.flujo_ideal_pct}%`}
            color={resumen.flujo_ideal_pct >= 60 ? 'verde' : resumen.flujo_ideal_pct >= 40 ? 'amarillo' : 'rojo'}
            tooltip={KPI_TOOLTIPS.flujoIdeal}
          />
          <TarjetaKpi etiqueta="T. Cocina Medio" valor={`${resumen.tiempo_medio_cocina} min`}                                 tooltip={KPI_TOOLTIPS.tiempoCocina} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <PanelDesvios desvios={desvios} />
          <PanelStock   alertas={alertas_stock} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <TablaRendimiento camareros={resumen.rendimiento_camareros} />
        </div>

        <PanelRecetas recetas={recetas} />

        <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '11px', color: 'var(--t3)' }}>
          MiseControl · <span className="mono">mpma_muestra.json</span> · My Pasta My Art — Espíritu Santo 16, Madrid
        </p>
      </main>
    </div>
  )
}
