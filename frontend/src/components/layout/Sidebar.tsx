import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, Package, Map, Truck, Users, CreditCard,
    Home, ClipboardList, Globe, Wallet, Building2,
    Zap, LogOut, X, Settings,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { Role } from '@/types/enums'

interface Props {
    onClose?: () => void
    collapsed?: boolean
}

const navByRole: Record<string, { label: string; icon: React.ReactNode; to: string }[]> = {
    [Role.ADMIN_PYME]: [
        { label: 'Dashboard', icon: <LayoutDashboard size={19} />, to: '/app/dashboard' },
        { label: 'Órdenes', icon: <Package size={19} />, to: '/app/orders' },
        { label: 'Rutas', icon: <Map size={19} />, to: '/app/routes' },
        { label: 'Flota', icon: <Truck size={19} />, to: '/app/fleet' },
        { label: 'Usuarios', icon: <Users size={19} />, to: '/app/users' },
        { label: 'Facturación', icon: <CreditCard size={19} />, to: '/app/billing' },
        { label: 'Configuración', icon: <Settings size={19} />, to: '/app/settings' },
    ],
    [Role.DESPACHADOR]: [
        { label: 'Dashboard', icon: <LayoutDashboard size={19} />, to: '/app/dashboard' },
        { label: 'Órdenes', icon: <Package size={19} />, to: '/app/orders' },
        { label: 'Rutas', icon: <Map size={19} />, to: '/app/routes' },
        { label: 'Flota', icon: <Truck size={19} />, to: '/app/fleet' },
        { label: 'Configuración', icon: <Settings size={19} />, to: '/app/settings' },
    ],
    [Role.CHOFER]: [
        { label: 'Inicio', icon: <Home size={19} />, to: '/app/driver' },
        { label: 'Mis Entregas', icon: <ClipboardList size={19} />, to: '/app/driver/stops' },
        { label: 'Configuración', icon: <Settings size={19} />, to: '/app/settings' },
    ],
    [Role.SUPER_ADMIN]: [
        { label: 'Dashboard Global', icon: <Globe size={19} />, to: '/app/superadmin' },
        { label: 'Cola de Pagos', icon: <Wallet size={19} />, to: '/app/superadmin/payments' },
        { label: 'Tenants', icon: <Building2 size={19} />, to: '/app/superadmin/tenants' },
    ],
}

const roleLabels: Record<string, string> = {
    [Role.ADMIN_PYME]: 'Admin PYME',
    [Role.DESPACHADOR]: 'Despachador',
    [Role.CHOFER]: 'Chofer',
    [Role.SUPER_ADMIN]: 'Super Admin',
}

export default function Sidebar({ onClose, collapsed = false }: Props) {
    const { user, clearAuth } = useAuthStore()
    const navigate = useNavigate()
    const items = navByRole[user?.role ?? ''] ?? []

    const handleLogout = () => {
        clearAuth()
        navigate('/login')
    }

    const initials = user
        ? `${user.nombre?.[0] ?? ''}${user.apellido?.[0] ?? ''}`.toUpperCase()
        : '?'

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: '#1a0a14',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Orb decorativo */}
            <div style={{
                position: 'absolute', top: -40, left: -40,
                width: 180, height: 180, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(236,72,153,0.12), transparent 70%)',
                filter: 'blur(30px)', pointerEvents: 'none',
            }} />

            {/* ── Logo ── */}
            <div style={{
                height: 64, display: 'flex', alignItems: 'center',
                justifyContent: 'center',
                padding: collapsed ? '0' : '0 16px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                flexShrink: 0, position: 'relative', zIndex: 1,
            }}>
                {collapsed ? (
                    // Solo logo icon cuando está colapsado
                    <div style={{
                        width: 34, height: 34, borderRadius: 10,
                        backgroundColor: '#EC4899',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(236,72,153,0.35)',
                    }}>
                        <Zap size={16} color="white" fill="white" />
                    </div>
                ) : (
                    // Logo + nombre cuando expandido
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: 10,
                            backgroundColor: '#EC4899',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, boxShadow: '0 4px 14px rgba(236,72,153,0.35)',
                        }}>
                            <Zap size={16} color="white" fill="white" />
                        </div>
                        <span style={{
                            color: 'white', fontWeight: 800, fontSize: 17,
                            letterSpacing: '-0.02em', whiteSpace: 'nowrap',
                        }}>
                            LogiPyme
                        </span>
                        {/* Botón cerrar solo en mobile */}
                        <button
                            onClick={onClose}
                            className="lg:hidden ml-auto"
                            style={{ color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* ── Nav ── */}
            <nav style={{
                flex: 1, padding: '10px 8px',
                overflowY: 'auto', overflowX: 'hidden',
                position: 'relative', zIndex: 1,
            }}>
                {items.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onClose}
                        end
                        style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}
                    >
                        {({ isActive }) => (
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    gap: collapsed ? 0 : 12,
                                    padding: collapsed ? '11px 0' : '10px 12px',
                                    borderRadius: 12,
                                    cursor: 'pointer',
                                    position: 'relative',
                                    backgroundColor: isActive ? 'rgba(236,72,153,0.13)' : 'transparent',
                                    transition: 'background-color 0.15s',
                                }}
                                onMouseEnter={e => {
                                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                                }}
                                onMouseLeave={e => {
                                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                                }}
                            >
                                {/* Barra activa izquierda — solo cuando expandido */}
                                {isActive && !collapsed && (
                                    <span style={{
                                        position: 'absolute', left: 0, top: '50%',
                                        transform: 'translateY(-50%)',
                                        width: 3, height: 20, borderRadius: 2,
                                        backgroundColor: '#EC4899',
                                    }} />
                                )}

                                {/* Ícono */}
                                <span style={{
                                    color: isActive ? '#EC4899' : 'rgba(255,255,255,0.38)',
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                }}>
                                    {item.icon}
                                </span>

                                {/* Label — oculto cuando collapsed */}
                                {!collapsed && (
                                    <span style={{
                                        color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                                        fontSize: 14, fontWeight: 500,
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {item.label}
                                    </span>
                                )}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* ── Footer usuario ── */}
            <div style={{
                padding: '10px 8px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                flexShrink: 0, position: 'relative', zIndex: 1,
            }}>
                {collapsed ? (
                    // Solo avatar cuando colapsado
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: 10,
                            backgroundColor: '#EC4899',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: 11, fontWeight: 800,
                        }}>
                            {initials}
                        </div>
                    </div>
                ) : (
                    // Info completa cuando expandido
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 12 }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: 10,
                            backgroundColor: '#EC4899',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: 11, fontWeight: 800, flexShrink: 0,
                        }}>
                            {initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                                color: 'white', fontSize: 13, fontWeight: 600,
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                margin: 0,
                            }}>
                                {user?.nombre} {user?.apellido}
                            </p>
                            <p style={{
                                color: 'rgba(255,255,255,0.3)', fontSize: 11,
                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                margin: 0,
                            }}>
                                {roleLabels[user?.role ?? ''] ?? user?.role}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                color: 'rgba(255,255,255,0.25)', background: 'none',
                                border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#EC4899')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
                        >
                            <LogOut size={15} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}