import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Menu, Search, Bell, ChevronRight, LogOut, User, Settings, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

interface Props { onMenuClick: () => void }

const routeLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    orders: 'Órdenes',
    routes: 'Rutas',
    fleet: 'Flota',
    users: 'Usuarios',
    billing: 'Facturación',
    driver: 'Inicio',
    stops: 'Mis Entregas',
    superadmin: 'Dashboard Global',
    payments: 'Cola de Pagos',
    tenants: 'Tenants',
    new: 'Nueva',
    settings: 'Configuración',
    tracking: 'Tracking',
}

// Notificaciones mock — reemplazar con query real
const MOCK_NOTIFS = [
    { id: 1, text: 'Orden TRK-2845 cancelada', time: 'hace 5 min', dot: '#EF4444', read: false },
    { id: 2, text: 'Luis Ramos completó su ruta', time: 'hace 12 min', dot: '#10B981', read: false },
    { id: 3, text: 'Nueva orden TRK-2846 creada', time: 'hace 20 min', dot: '#3B82F6', read: true },
]

function useBreadcrumbs() {
    const { pathname } = useLocation()
    const parts = pathname.replace('/app/', '').replace('/app', '').split('/').filter(Boolean)
    return parts.map((part, i) => ({
        label: routeLabels[part] ?? part,
        isLast: i === parts.length - 1,
    }))
}

export default function TopBar({ onMenuClick }: Props) {
    const { user, clearAuth } = useAuthStore()
    const navigate = useNavigate()
    const breadcrumbs = useBreadcrumbs()
    const [userDrop, setUserDrop] = useState(false)
    const [bellDrop, setBellDrop] = useState(false)
    const [searchVal, setSearchVal] = useState('')
    const [searchFocus, setSearchFocus] = useState(false)
    const userRef = useRef<HTMLDivElement>(null)
    const bellRef = useRef<HTMLDivElement>(null)

    const unread = MOCK_NOTIFS.filter(n => !n.read).length

    // Cierra dropdowns al click fuera
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (userRef.current && !userRef.current.contains(e.target as Node)) setUserDrop(false)
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellDrop(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const initials = user
        ? `${user.nombre?.[0] ?? ''}${user.apellido?.[0] ?? ''}`.toUpperCase()
        : '?'

    const handleLogout = () => {
        clearAuth()
        navigate('/login')
    }

    return (
        <header
            className="shrink-0 flex items-center gap-3 px-4 sm:px-6"
            style={{
                height: 64,
                backgroundColor: '#1a0a14',
                borderBottom: '1px solid rgba(236,72,153,0.12)',
                zIndex: 10,
            }}
        >
            {/* Hamburger mobile */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-xl transition-colors"
                style={{ color: 'rgba(255,255,255,0.5)' }}
            >
                <Menu size={20} />
            </button>

            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>App</span>
                {breadcrumbs.map((bc) => (
                    <span key={bc.label} className="flex items-center gap-1.5">
                        <ChevronRight size={13} className="shrink-0" style={{ color: 'rgba(255,255,255,0.2)' }} />
                        <span className="text-sm truncate" style={{
                            fontWeight: bc.isLast ? 600 : 400,
                            color: bc.isLast ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                        }}>
                            {bc.label}
                        </span>
                    </span>
                ))}
            </nav>

            {/* Título mobile */}
            <span className="sm:hidden flex-1 text-sm font-semibold truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {breadcrumbs.at(-1)?.label ?? 'App'}
            </span>

            {/* Búsqueda */}
            <div
                className="hidden md:flex items-center gap-2 px-3 h-9 rounded-xl transition-all duration-200 overflow-hidden"
                style={{
                    border: `1.5px solid ${searchFocus || searchVal ? '#EC4899' : 'rgba(255,255,255,0.1)'}`,
                    backgroundColor: searchFocus || searchVal ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                    width: searchFocus || searchVal ? 260 : 160,
                    boxShadow: searchFocus ? '0 0 0 3px rgba(236,72,153,0.15)' : 'none',
                    flexShrink: 0,
                }}
            >
                <Search size={14} style={{ color: searchFocus || searchVal ? '#EC4899' : 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                <input
                    type="text"
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value.slice(0, 50))}
                    placeholder="Buscar..."
                    maxLength={50}
                    style={{
                        flex: 1, minWidth: 0, border: 'none', outline: 'none',
                        backgroundColor: 'transparent', fontSize: 13,
                        color: 'rgba(255,255,255,0.85)',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                    onFocus={() => setSearchFocus(true)}
                    onBlur={() => setSearchFocus(false)}
                />
                {searchVal && (
                    <button
                        onMouseDown={e => { e.preventDefault(); setSearchVal('') }}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
                            color: 'rgba(255,255,255,0.4)', flexShrink: 0, display: 'flex', alignItems: 'center',
                            borderRadius: 4,
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#EC4899')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                    >
                        <X size={13} />
                    </button>
                )}
            </div>

            {/* Campana */}
            <div className="relative" ref={bellRef}>
                <button
                    onClick={() => { setBellDrop(!bellDrop); setUserDrop(false) }}
                    className="relative p-2 rounded-xl transition-colors"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                    <Bell size={20} />
                    {unread > 0 && (
                        <span
                            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                            style={{ backgroundColor: '#EC4899' }}
                        />
                    )}
                </button>

                {bellDrop && (
                    <div
                        className="absolute right-0 top-12 w-80 bg-white rounded-2xl py-2 z-50"
                        style={{
                            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                            border: '1px solid #f1f5f9',
                        }}
                    >
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-50 mb-1">
                            <p className="text-sm font-bold text-gray-800">Notificaciones</p>
                            {unread > 0 && (
                                <span
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                                    style={{ backgroundColor: '#EC4899' }}
                                >
                                    {unread} nuevas
                                </span>
                            )}
                        </div>
                        {MOCK_NOTIFS.map(n => (
                            <div
                                key={n.id}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                                style={{ opacity: n.read ? 0.5 : 1 }}
                            >
                                <span
                                    className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                                    style={{ backgroundColor: n.dot }}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 leading-snug">{n.text}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                                </div>
                                {!n.read && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#EC4899] mt-2 shrink-0" />
                                )}
                            </div>
                        ))}
                        <div className="border-t border-gray-50 mt-1 px-4 pt-2 pb-1">
                            <button className="text-xs font-semibold text-[#EC4899] hover:underline w-full text-center">
                                Ver todas las notificaciones
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Avatar usuario */}
            <div className="relative" ref={userRef}>
                <button
                    onClick={() => { setUserDrop(!userDrop); setBellDrop(false) }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black transition-all hover:opacity-90"
                    style={{ backgroundColor: '#EC4899' }}
                >
                    {initials}
                </button>

                {userDrop && (
                    <div
                        className="absolute right-0 top-12 w-52 bg-white rounded-2xl py-2 z-50"
                        style={{
                            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                            border: '1px solid #f1f5f9',
                        }}
                    >
                        <div className="px-4 py-2.5 border-b border-gray-50 mb-1">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                                {user?.nombre} {user?.apellido}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            onClick={() => { navigate('/app/settings'); setUserDrop(false) }}>
                            <User size={14} className="text-gray-400" />
                            Mi perfil
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            onClick={() => { navigate('/app/settings'); setUserDrop(false) }}>
                            <Settings size={14} className="text-gray-400" />
                            Configuración
                        </button>
                        <div className="border-t border-gray-50 mt-1 pt-1">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors"
                                style={{ color: '#EC4899' }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(236,72,153,0.05)')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                                <LogOut size={14} />
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}