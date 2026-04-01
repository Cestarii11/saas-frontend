import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
    Search, Plus, Package, ArrowUpRight,
    Clock, CheckCircle2, XCircle, Truck,
    LayoutGrid, List,
} from 'lucide-react'

const F = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ORDERS = [
    { id: 'TRK-2841', trackingCode: 'TRK-2841', cliente: 'María González', telefono: '+58 412-111-2233', direccion: 'Av. Francisco de Miranda, Chacao', zona: 'Chacao', status: 'DELIVERED', chofer: 'Luis Ramos', creado: '2026-03-14 08:10', monto: 45.00 },
    { id: 'TRK-2842', trackingCode: 'TRK-2842', cliente: 'Carlos Pérez', telefono: '+58 414-222-3344', direccion: 'Calle Los Mangos, Altamira', zona: 'Altamira', status: 'IN_TRANSIT', chofer: 'Pedro Méndez', creado: '2026-03-14 08:47', monto: 32.50 },
    { id: 'TRK-2843', trackingCode: 'TRK-2843', cliente: 'Ana Martínez', telefono: '+58 416-333-4455', direccion: 'Esq. La Candelaria, Caracas', zona: 'La Candelaria', status: 'ASSIGNED', chofer: 'Luis Ramos', creado: '2026-03-14 09:02', monto: 18.00 },
    { id: 'TRK-2844', trackingCode: 'TRK-2844', cliente: 'José Rodríguez', telefono: '+58 424-444-5566', direccion: 'Urb. El Paraíso, Calle 3', zona: 'El Paraíso', status: 'CREATED', chofer: '—', creado: '2026-03-14 09:15', monto: 60.00 },
    { id: 'TRK-2845', trackingCode: 'TRK-2845', cliente: 'Laura Sánchez', telefono: '+58 426-555-6677', direccion: 'Petare Norte, Sector La Unión', zona: 'Petare', status: 'CANCELLED', chofer: 'Pedro Méndez', creado: '2026-03-14 09:33', monto: 25.00 },
    { id: 'TRK-2846', trackingCode: 'TRK-2846', cliente: 'Miguel Torres', telefono: '+58 412-666-7788', direccion: 'Los Palos Grandes, Av. Principal', zona: 'Los Palos Grandes', status: 'IN_TRANSIT', chofer: 'Carlos Suárez', creado: '2026-03-14 09:44', monto: 88.00 },
    { id: 'TRK-2847', trackingCode: 'TRK-2847', cliente: 'Gabriela Flores', telefono: '+58 414-777-8899', direccion: 'Las Mercedes, Calle París', zona: 'Las Mercedes', status: 'DELIVERED', chofer: 'Luis Ramos', creado: '2026-03-14 10:00', monto: 120.00 },
    { id: 'TRK-2848', trackingCode: 'TRK-2848', cliente: 'Roberto Castillo', telefono: '+58 416-888-9900', direccion: 'El Cafetal, Urb. Colinas de Bello Monte', zona: 'El Cafetal', status: 'CREATED', chofer: '—', creado: '2026-03-14 10:12', monto: 40.00 },
    { id: 'TRK-2849', trackingCode: 'TRK-2849', cliente: 'Patricia Moreno', telefono: '+58 424-999-0011', direccion: 'Sabana Grande, Av. Casanova', zona: 'Sabana Grande', status: 'ASSIGNED', chofer: 'Carlos Suárez', creado: '2026-03-14 10:25', monto: 55.00 },
    { id: 'TRK-2850', trackingCode: 'TRK-2850', cliente: 'Fernando Guzmán', telefono: '+58 426-000-1122', direccion: 'Bello Campo, Calle 2', zona: 'Bello Campo', status: 'IN_TRANSIT', chofer: 'Pedro Méndez', creado: '2026-03-14 10:44', monto: 75.00 },
]

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, {
    label: string; color: string; bg: string;
    icon: React.ReactNode; accent: string
}> = {
    CREATED: { label: 'Creada', color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', icon: <Clock size={13} />, accent: '#3b82f6' },
    ASSIGNED: { label: 'Asignada', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', icon: <Package size={13} />, accent: '#f59e0b' },
    IN_TRANSIT: { label: 'En camino', color: '#EC4899', bg: 'rgba(236,72,153,0.12)', icon: <Truck size={13} />, accent: '#EC4899' },
    DELIVERED: { label: 'Entregada', color: '#34d399', bg: 'rgba(52,211,153,0.12)', icon: <CheckCircle2 size={13} />, accent: '#10b981' },
    CANCELLED: { label: 'Cancelada', color: '#f87171', bg: 'rgba(248,113,113,0.12)', icon: <XCircle size={13} />, accent: '#ef4444' },
}

const ALL_STATUSES = ['CREATED', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function Badge({ status }: { status: string }) {
    const cfg = STATUS_CFG[status] ?? { label: status, color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', icon: null, accent: '#94a3b8' }
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 20,
            backgroundColor: cfg.bg, color: cfg.color,
            fontSize: 13, fontWeight: 600, fontFamily: F,
            border: `1px solid ${cfg.color}30`,
            whiteSpace: 'nowrap',
        }}>
            {cfg.icon}
            {cfg.label}
        </span>
    )
}

// ─── Stat circle ─────────────────────────────────────────────────────────────
function StatPill({ status, count, active, onClick }: {
    status: string; count: number; active: boolean; onClick: () => void
}) {
    const cfg = STATUS_CFG[status]
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 8, padding: '0', border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer', transition: 'all 0.18s',
                flexShrink: 0,
            }}
        >
            <div style={{
                width: 72, height: 72, borderRadius: '50%',
                border: `2.5px solid ${active ? cfg.accent : 'rgba(255,255,255,0.1)'}`,
                backgroundColor: active ? `${cfg.accent}18` : 'rgba(255,255,255,0.03)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.18s',
                boxShadow: active ? `0 0 24px ${cfg.accent}40, inset 0 0 16px ${cfg.accent}10` : 'none',
                position: 'relative',
            }}>
                {active && (
                    <div style={{
                        position: 'absolute', inset: -5, borderRadius: '50%',
                        border: `1px solid ${cfg.accent}30`,
                        animation: 'ring-pulse 2s ease-in-out infinite',
                    }} />
                )}
                <span style={{
                    fontSize: 24, fontWeight: 900, fontFamily: F,
                    color: active ? cfg.color : 'rgba(255,255,255,0.55)',
                    lineHeight: 1,
                }}>
                    {count}
                </span>
            </div>
            <span style={{
                fontSize: 12, fontWeight: 600, fontFamily: F,
                color: active ? cfg.color : 'rgba(255,255,255,0.3)',
                whiteSpace: 'nowrap', transition: 'color 0.18s',
            }}>
                {cfg.label}
            </span>
        </button>
    )
}

// ─── Fila desktop (≥ sm) ──────────────────────────────────────────────────────
function OrderRow({ order }: { order: typeof MOCK_ORDERS[0] }) {
    const cfg = STATUS_CFG[order.status]
    return (
        <Link to={`/app/orders/${order.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1.8fr 1.2fr 1fr 140px 40px',
                    alignItems: 'center',
                    gap: 16,
                    padding: '16px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'background-color 0.15s',
                    cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, backgroundColor: cfg.accent, boxShadow: `0 0 6px ${cfg.accent}` }} />
                    <div>
                        <p style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: '#EC4899', margin: 0 }}>{order.trackingCode}</p>
                        <p style={{ fontFamily: F, fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{order.creado.split(' ')[1]}</p>
                    </div>
                </div>
                <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.85)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.cliente}</p>
                    <p style={{ fontFamily: F, fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.direccion}</p>
                </div>
                <div>
                    {order.chofer === '—' ? (
                        <span style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>Sin asignar</span>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: 'white', flexShrink: 0 }}>
                                {order.chofer.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span style={{ fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {order.chofer.split(' ')[0]}
                            </span>
                        </div>
                    )}
                </div>
                <div>
                    <p style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>${order.monto.toFixed(2)}</p>
                </div>
                <Badge status={order.status} />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ArrowUpRight size={16} color="rgba(255,255,255,0.2)" />
                </div>
            </div>
        </Link>
    )
}

// ─── Card compacta móvil (< sm, modo lista) ───────────────────────────────────
function OrderMobileRow({ order }: { order: typeof MOCK_ORDERS[0] }) {
    const cfg = STATUS_CFG[order.status]
    return (
        <Link to={`/app/orders/${order.id}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div
                style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer', transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
                {/* Dot */}
                <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, backgroundColor: cfg.accent, boxShadow: `0 0 6px ${cfg.accent}`, marginTop: 2 }} />
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        <p style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: '#EC4899', margin: 0, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.trackingCode}</p>
                        <div style={{ flexShrink: 0 }}><Badge status={order.status} /></div>
                    </div>
                    <p style={{ fontFamily: F, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.cliente}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontFamily: F, fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{order.zona} · {order.creado.split(' ')[1]}</p>
                        <p style={{ fontFamily: F, fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.9)', margin: 0 }}>${order.monto.toFixed(2)}</p>
                    </div>
                </div>
                <ArrowUpRight size={14} color="rgba(255,255,255,0.15)" style={{ flexShrink: 0 }} />
            </div>
        </Link>
    )
}

// ─── Card de orden (modo grid) ────────────────────────────────────────────────
function OrderCard({ order }: { order: typeof MOCK_ORDERS[0] }) {
    const cfg = STATUS_CFG[order.status]
    return (
        <Link to={`/app/orders/${order.id}`} style={{ textDecoration: 'none' }}>
            <div
                style={{
                    backgroundColor: '#2d1122',
                    border: `1px solid rgba(255,255,255,0.07)`,
                    borderRadius: 16, padding: '18px',
                    cursor: 'pointer', transition: 'all 0.18s',
                    borderTop: `3px solid ${cfg.accent}`,
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px ${cfg.accent}30`
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 8 }}>
                    <p style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: '#EC4899', margin: 0, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{order.trackingCode}</p>
                    <div style={{ flexShrink: 0 }}><Badge status={order.status} /></div>
                </div>
                <p style={{ fontFamily: F, fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.85)', margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.cliente}
                </p>
                <p style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: '0 0 14px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.zona}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{order.creado.split(' ')[1]}</span>
                    <span style={{ fontFamily: F, fontSize: 17, fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>${order.monto.toFixed(2)}</span>
                </div>
            </div>
        </Link>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function OrdersListPage() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatus] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
    const [searchFocus, setSearchFocus] = useState(false)

    const counts = useMemo(() => {
        const c: Record<string, number> = {}
        ALL_STATUSES.forEach(s => { c[s] = MOCK_ORDERS.filter(o => o.status === s).length })
        return c
    }, [])

    const filtered = useMemo(() => {
        return MOCK_ORDERS.filter(o => {
            const matchStatus = !statusFilter || o.status === statusFilter
            const q = search.toLowerCase()
            const matchSearch = !q
                || o.trackingCode.toLowerCase().includes(q)
                || o.cliente.toLowerCase().includes(q)
                || o.zona.toLowerCase().includes(q)
                || o.chofer.toLowerCase().includes(q)
            return matchStatus && matchSearch
        })
    }, [search, statusFilter])

    return (
        <div style={{ fontFamily: F, display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* ── Header ── */}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                    <p style={{
                        fontSize: 13, fontWeight: 700, margin: '0 0 3px 0', fontFamily: F,
                        background: 'linear-gradient(135deg, #EC4899, #D8B4FE)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>
                        Centro de operaciones
                    </p>
                    <h1 style={{ fontFamily: F, fontSize: 32, fontWeight: 900, color: 'rgba(255,255,255,0.92)', margin: 0, letterSpacing: '-0.02em' }}>
                        Órdenes
                    </h1>
                </div>
                <Link
                    to="/app/orders/new"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 7,
                        padding: '11px 20px', borderRadius: 12,
                        backgroundColor: '#EC4899', color: 'white',
                        fontFamily: F, fontSize: 15, fontWeight: 600,
                        textDecoration: 'none', flexShrink: 0,
                        transition: 'transform 0.18s, box-shadow 0.18s',
                        boxShadow: '0 4px 16px rgba(236,72,153,0.35)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(236,72,153,0.5)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(236,72,153,0.35)' }}
                >
                    <Plus size={16} />
                    Nueva orden
                </Link>
            </div>

            {/* ── Stat circles — filtros visuales ── */}

            {/* Mobile: grid 3×2 para ver todos los círculos */}
            <div className="sm:hidden" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 8px', marginBottom: 20, paddingTop: 4 }}>
                {/* Todas */}
                <button
                    onClick={() => setStatus(null)}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 6, border: 'none', backgroundColor: 'transparent',
                        cursor: 'pointer', transition: 'all 0.18s',
                    }}
                >
                    <div style={{
                        width: 60, height: 60, borderRadius: '50%',
                        border: `2.5px solid ${!statusFilter ? '#D8B4FE' : 'rgba(255,255,255,0.1)'}`,
                        backgroundColor: !statusFilter ? 'rgba(216,180,254,0.15)' : 'rgba(255,255,255,0.03)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.18s', position: 'relative',
                        boxShadow: !statusFilter ? '0 0 20px rgba(216,180,254,0.4)' : 'none',
                    }}>
                        {!statusFilter && (
                            <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '1px solid rgba(216,180,254,0.3)', animation: 'ring-pulse 2s ease-in-out infinite' }} />
                        )}
                        <span style={{ fontSize: 20, fontWeight: 900, fontFamily: F, color: !statusFilter ? '#D8B4FE' : 'rgba(255,255,255,0.55)', lineHeight: 1 }}>{MOCK_ORDERS.length}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, fontFamily: F, color: !statusFilter ? '#D8B4FE' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>Todas</span>
                </button>

                {/* Status pills */}
                {ALL_STATUSES.map(s => {
                    const cfg = STATUS_CFG[s]
                    const isActive = statusFilter === s
                    return (
                        <button key={s} onClick={() => setStatus(statusFilter === s ? null : s)}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                gap: 6, border: 'none', backgroundColor: 'transparent',
                                cursor: 'pointer', transition: 'all 0.18s',
                            }}
                        >
                            <div style={{
                                width: 60, height: 60, borderRadius: '50%',
                                border: `2.5px solid ${isActive ? cfg.accent : 'rgba(255,255,255,0.1)'}`,
                                backgroundColor: isActive ? `${cfg.accent}18` : 'rgba(255,255,255,0.03)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.18s', position: 'relative',
                                boxShadow: isActive ? `0 0 20px ${cfg.accent}40` : 'none',
                            }}>
                                {isActive && (
                                    <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `1px solid ${cfg.accent}30`, animation: 'ring-pulse 2s ease-in-out infinite' }} />
                                )}
                                <span style={{ fontSize: 20, fontWeight: 900, fontFamily: F, color: isActive ? cfg.color : 'rgba(255,255,255,0.55)', lineHeight: 1 }}>{counts[s]}</span>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 600, fontFamily: F, color: isActive ? cfg.color : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{cfg.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Desktop: fila horizontal con scroll */}
            <div className="hidden sm:flex" style={{ gap: 20, marginBottom: 24, overflowX: 'auto', paddingBottom: 8, paddingTop: 4, alignItems: 'flex-start' }}>
                <button
                    onClick={() => setStatus(null)}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        gap: 8, border: 'none', backgroundColor: 'transparent',
                        cursor: 'pointer', transition: 'all 0.18s', flexShrink: 0,
                    }}
                >
                    <div style={{
                        width: 72, height: 72, borderRadius: '50%',
                        border: `2.5px solid ${!statusFilter ? '#D8B4FE' : 'rgba(255,255,255,0.1)'}`,
                        backgroundColor: !statusFilter ? 'rgba(216,180,254,0.15)' : 'rgba(255,255,255,0.03)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.18s', position: 'relative',
                        boxShadow: !statusFilter ? '0 0 24px rgba(216,180,254,0.4), inset 0 0 16px rgba(216,180,254,0.1)' : 'none',
                    }}>
                        {!statusFilter && (
                            <div style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: '1px solid rgba(216,180,254,0.3)', animation: 'ring-pulse 2s ease-in-out infinite' }} />
                        )}
                        <span style={{ fontSize: 24, fontWeight: 900, fontFamily: F, color: !statusFilter ? '#D8B4FE' : 'rgba(255,255,255,0.55)', lineHeight: 1 }}>{MOCK_ORDERS.length}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, fontFamily: F, color: !statusFilter ? '#D8B4FE' : 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>Todas</span>
                </button>

                <div style={{ width: 1, height: 72, backgroundColor: 'rgba(255,255,255,0.07)', flexShrink: 0, alignSelf: 'flex-start' }} />

                {ALL_STATUSES.map(s => (
                    <StatPill
                        key={s}
                        status={s}
                        count={counts[s]}
                        active={statusFilter === s}
                        onClick={() => setStatus(statusFilter === s ? null : s)}
                    />
                ))}
            </div>

            {/* ── Barra de búsqueda + controles ── */}
            <div style={{
                backgroundColor: '#2d1122', borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
                overflow: 'hidden',
            }}>
                {/* Toolbar */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    flexWrap: 'wrap',
                }}>
                    {/* Búsqueda */}
                    <div style={{
                        flex: 1, minWidth: 0,
                        display: 'flex', alignItems: 'center', gap: 10,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: `1.5px solid ${searchFocus ? '#EC4899' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 12, padding: '9px 14px',
                        transition: 'all 0.15s',
                        boxShadow: searchFocus ? '0 0 0 3px rgba(236,72,153,0.12)' : 'none',
                    }}>
                        <Search size={16} color={searchFocus ? '#EC4899' : 'rgba(255,255,255,0.3)'} style={{ flexShrink: 0 }} />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value.slice(0, 30))}
                            onFocus={() => setSearchFocus(true)}
                            onBlur={() => setSearchFocus(false)}
                            placeholder="Buscar por código, cliente, zona o chofer..."
                            maxLength={30}
                            style={{
                                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                                fontFamily: F, fontSize: 15, color: 'rgba(255,255,255,0.85)',
                                minWidth: 0,
                            }}
                        />
                        {search && (
                            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Vista lista/grid */}
                    <div style={{
                        display: 'flex', gap: 2,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: 10, padding: 3, flexShrink: 0,
                    }}>
                        {(['list', 'grid'] as const).map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                style={{
                                    padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                    backgroundColor: viewMode === mode ? 'rgba(236,72,153,0.2)' : 'transparent',
                                    color: viewMode === mode ? '#EC4899' : 'rgba(255,255,255,0.3)',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {mode === 'list' ? <List size={16} /> : <LayoutGrid size={16} />}
                            </button>
                        ))}
                    </div>

                    {/* Contador */}
                    <span style={{ fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                        {filtered.length} orden{filtered.length !== 1 ? 'es' : ''}
                    </span>
                </div>

                {/* Cabecera tabla (solo desktop, modo lista) */}
                {viewMode === 'list' && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1.8fr 1.2fr 1fr 140px 40px',
                        gap: 16, padding: '10px 20px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }} className="hidden sm:grid">
                        {['Código', 'Cliente / Dirección', 'Chofer', 'Monto', 'Estado', ''].map(h => (
                            <span key={h} style={{ fontFamily: F, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                {h}
                            </span>
                        ))}
                    </div>
                )}

                {/* Contenido */}
                {viewMode === 'list' ? (
                    <div>
                        {filtered.length === 0 ? (
                            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                                <p style={{ fontFamily: F, fontSize: 16, color: 'rgba(255,255,255,0.3)', margin: 0 }}>No hay órdenes que coincidan</p>
                            </div>
                        ) : (
                            <>
                                {/* Mobile: card compacta */}
                                <div className="sm:hidden">
                                    {filtered.map(o => <OrderMobileRow key={o.id} order={o} />)}
                                </div>
                                {/* Desktop: fila de tabla */}
                                <div className="hidden sm:block">
                                    {filtered.map(o => <OrderRow key={o.id} order={o} />)}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                        {filtered.length === 0 ? (
                            <p style={{ fontFamily: F, fontSize: 16, color: 'rgba(255,255,255,0.3)', gridColumn: '1/-1', textAlign: 'center', padding: '40px 0' }}>
                                No hay órdenes que coincidan
                            </p>
                        ) : (
                            filtered.map(o => <OrderCard key={o.id} order={o} />)
                        )}
                    </div>
                )}
            </div>

            <style>{`.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}.scrollbar-hide::-webkit-scrollbar{display:none}@keyframes ring-pulse{0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:0.2;transform:scale(1.08)}}`}</style>
        </div>
    )
}