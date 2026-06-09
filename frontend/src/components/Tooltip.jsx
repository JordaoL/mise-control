import { useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

function TooltipPopup({ texto, anchor }) {
  const below = anchor.top < 220
  const left  = Math.max(8, Math.min(anchor.left + anchor.width / 2 - 120, window.innerWidth - 248))
  const arrowLeft = Math.round(anchor.left + anchor.width / 2 - left - 5)

  return createPortal(
    <span style={{
      position: 'fixed',
      zIndex: 99999,
      left,
      top: below ? anchor.bottom + 8 : anchor.top - 8,
      transform: below ? 'none' : 'translateY(-100%)',
      width: '240px',
      background: '#1A1009',
      borderRadius: '10px',
      padding: '10px 13px',
      fontSize: '12px',
      lineHeight: 1.55,
      color: '#F7F3EE',
      boxShadow: '0 8px 24px rgba(26,16,9,0.28)',
      pointerEvents: 'none',
    }}>
      {texto}
      <span style={{
        position: 'absolute',
        left: `${arrowLeft}px`,
        ...(below
          ? { bottom: '100%', borderBottom: '5px solid #1A1009', borderTop: 'none' }
          : { top:    '100%', borderTop:    '5px solid #1A1009', borderBottom: 'none' }),
        borderLeft:  '5px solid transparent',
        borderRight: '5px solid transparent',
      }} />
    </span>,
    document.body
  )
}

export default function Tooltip({ texto, children }) {
  const [anchor, setAnchor] = useState(null)
  const ref = useRef(null)

  const show = useCallback(() => {
    if (!ref.current) return
    setAnchor(ref.current.getBoundingClientRect())
  }, [])

  const hide = useCallback(() => setAnchor(null), [])

  return (
    <span ref={ref} className="relative inline-flex items-center" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {anchor && <TooltipPopup texto={texto} anchor={anchor} />}
    </span>
  )
}

export function IconoInfo({ texto }) {
  return (
    <Tooltip texto={texto}>
      <span
        className="ml-1.5 inline-flex items-center justify-center cursor-help transition-opacity hover:opacity-70"
        style={{
          width: '15px', height: '15px', borderRadius: '50%',
          border: '1px solid var(--border)', background: 'var(--card-warm)',
          color: 'var(--t3)', fontSize: '9px', fontWeight: 600,
          fontFamily: 'inherit', flexShrink: 0,
        }}
      >
        i
      </span>
    </Tooltip>
  )
}
