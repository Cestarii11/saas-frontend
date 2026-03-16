import { useState } from 'react'
import {
    User, Settings, Camera, Lock, Bell, MapPin, Building2,
    Phone, Mail, Shield, Eye, EyeOff, Check, Save,
    ChevronRight, Zap,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const F = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"

// ─── Colores del tema — armonizados con sidebar #1a0a14 ──────────────────────
const PINK = '#EC4899'
const LILAC = '#D8B4FE'
const BG = '#1f0d18'           // mismo fondo que el app
const CARD = '#2d1122'           // cards: un poco más claro que el fondo
const CARD2 = '#361428'           // cards secundarias / hover: aún más claro
const BORDER = 'rgba(236,72,153,0.14)'
const SHADOW = '0 4px 24px rgba(0,0,0,0.3), 0 1px 4px rgba(236,72,153,0.08)'

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Tab = 'perfil' | 'configuracion'

// ─── Toggle Component ─────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!value)}
            style={{
                width: 44, height: 24, borderRadius: 12,
                backgroundColor: value ? PINK : 'rgba(236,72,153,0.15)',
                border: 'none', cursor: 'pointer', padding: 0,
                position: 'relative', transition: 'background-color 0.2s ease',
                flexShrink: 0,
            }}
        >
            <span style={{
                position: 'absolute', top: 2,
                left: value ? 22 : 2,
                width: 20, height: 20, borderRadius: '50%',
                backgroundColor: value ? 'white' : 'rgba(236,72,153,0.4)',
                transition: 'left 0.2s ease',
                boxShadow: value ? '0 2px 6px rgba(236,72,153,0.3)' : 'none',
            }} />
        </button>
    )
}

// ─── Input estilizado con validaciones estrictas ─────────────────────────────
function Field({
    label, value, onChange, type = 'text', placeholder = '', readOnly = false,
    hint, suffix, maxLength, onlyNumbers = false, onlyLetters = false, isRif = false,
}: {
    label: string
    value: string
    onChange?: (v: string) => void
    type?: string
    placeholder?: string
    readOnly?: boolean
    hint?: string
    suffix?: React.ReactNode
    maxLength?: number
    onlyNumbers?: boolean
    onlyLetters?: boolean
    isRif?: boolean       // RIF venezolano: solo J/V/E/G/C + guión + números
}) {
    const [focused, setFocused] = useState(false)

    const handleChange = (raw: string) => {
        let v = raw
        if (onlyNumbers) {
            // Solo dígitos
            v = v.replace(/\D/g, '')
        } else if (onlyLetters) {
            // Solo letras (incluyendo acentos) y espacios, sin caracteres especiales
            v = v.replace(/[^a-záéíóúüñA-ZÁÉÍÓÚÜÑ\s]/g, '')
        } else if (isRif) {
            // RIF venezolano: primera letra solo J/V/E/G/C, luego guión y números
            v = v.toUpperCase()
            // Solo permite letras válidas al inicio, guiones y números
            v = v.replace(/[^JVEGC0-9\-]/g, '')
            // Asegura que empiece con letra válida
            if (v.length > 0 && !/^[JVEGC]/.test(v)) v = ''
        }
        if (maxLength) v = v.slice(0, maxLength)
        onChange?.(v)
    }

    return (
        <div>
            <label style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#D8B4FE', display: 'block', marginBottom: 6 }}>
                {label}
                {maxLength && !readOnly && (
                    <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.25)', marginLeft: 6, fontSize: 11 }}>
                        {value.length}/{maxLength}
                    </span>
                )}
            </label>
            <div style={{
                display: 'flex', alignItems: 'center',
                border: `1.5px solid ${focused ? PINK : BORDER}`,
                borderRadius: 12, overflow: 'hidden',
                backgroundColor: readOnly ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)',
                boxShadow: focused ? `0 0 0 3px rgba(236,72,153,0.1)` : 'none',
                transition: 'all 0.15s',
            }}>
                <input
                    type={type}
                    value={value}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    inputMode={onlyNumbers ? 'numeric' : undefined}
                    onChange={e => handleChange(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        flex: 1, border: 'none', outline: 'none',
                        padding: '11px 14px', fontFamily: F, fontSize: 14,
                        color: readOnly ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.9)',
                        backgroundColor: 'transparent',
                    }}
                />
                {suffix}
            </div>
            {hint && <p style={{ fontFamily: F, fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{hint}</p>}
        </div>
    )
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div style={{
            backgroundColor: '#2d1122', borderRadius: 18,
            border: `1px solid ${BORDER}`, boxShadow: SHADOW,
            overflow: 'hidden',
        }}>
            {/* Header con gradiente sutil */}
            <div style={{
                padding: '16px 22px',
                background: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(216,180,254,0.05) 100%)',
                borderBottom: `1px solid ${BORDER}`,
                display: 'flex', alignItems: 'center', gap: 10,
            }}>
                <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: 'linear-gradient(135deg, #EC4899, #D8B4FE)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', flexShrink: 0,
                }}>
                    {icon}
                </div>
                <h3 style={{ fontFamily: F, fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>{title}</h3>
            </div>
            <div style={{ padding: '22px' }}>
                {children}
            </div>
        </div>
    )
}

// ─── Tab Perfil ───────────────────────────────────────────────────────────────
function TabPerfil() {
    const { user } = useAuthStore()
    const [nombre, setNombre] = useState(user?.nombre ?? '')
    const [apellido, setApellido] = useState(user?.apellido ?? '')
    const [telefono, setTelefono] = useState('+58 412 000 0000')
    const [saved, setSaved] = useState(false)

    const [currentPass, setCurrentPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [passSaved, setPassSaved] = useState(false)

    const passMin8 = newPass.length >= 8
    const passMatch = newPass === confirmPass && confirmPass.length > 0

    const initials = `${nombre?.[0] ?? ''}${apellido?.[0] ?? ''}`.toUpperCase() || '?'

    const handleSavePerfil = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    const handleSavePass = () => {
        if (!passMin8 || !passMatch || !currentPass) return
        setPassSaved(true)
        setCurrentPass(''); setNewPass(''); setConfirmPass('')
        setTimeout(() => setPassSaved(false), 2500)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Avatar */}
            <SectionCard title="Foto de perfil" icon={<Camera size={16} />}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    {/* Avatar grande */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: 22,
                            background: 'linear-gradient(135deg, #EC4899, #D8B4FE)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: 26, fontWeight: 900, fontFamily: F,
                            boxShadow: '0 8px 24px rgba(236,72,153,0.3)',
                        }}>
                            {initials}
                        </div>
                        {/* Botón cámara */}
                        <button style={{
                            position: 'absolute', bottom: -4, right: -4,
                            width: 28, height: 28, borderRadius: 8,
                            backgroundColor: PINK, border: '2.5px solid white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: '0 2px 8px rgba(236,72,153,0.4)',
                        }}>
                            <Camera size={13} color="white" />
                        </button>
                    </div>
                    <div>
                        <p style={{ fontFamily: F, fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: '0 0 4px 0' }}>
                            {nombre} {apellido}
                        </p>
                        <p style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: '0 0 10px 0' }}>{user?.email}</p>
                        <button style={{
                            fontFamily: F, fontSize: 13, fontWeight: 600,
                            color: PINK, border: `1.5px solid ${PINK}`,
                            backgroundColor: 'rgba(236,72,153,0.06)',
                            padding: '6px 14px', borderRadius: 8, cursor: 'pointer',
                        }}>
                            Cambiar foto
                        </button>
                    </div>
                </div>
            </SectionCard>

            {/* Datos personales */}
            <SectionCard title="Datos personales" icon={<User size={16} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nombre" value={nombre} onChange={v => setNombre(v)} placeholder="Tu nombre" onlyLetters maxLength={30} />
                    <Field label="Apellido" value={apellido} onChange={v => setApellido(v)} placeholder="Tu apellido" onlyLetters maxLength={30} />
                    <Field
                        label="Email"
                        value={user?.email ?? ''}
                        readOnly
                        hint="El email no se puede cambiar"
                        suffix={
                            <div style={{ paddingRight: 12 }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    backgroundColor: 'rgba(16,185,129,0.15)',
                                    padding: '3px 8px', borderRadius: 6,
                                }}>
                                    <Shield size={11} color="#10B981" />
                                    <span style={{ fontFamily: F, fontSize: 11, color: '#10B981', fontWeight: 600 }}>Verificado</span>
                                </div>
                            </div>
                        }
                    />
                    <div>
                        <label style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#D8B4FE', display: 'block', marginBottom: 6 }}>
                            Teléfono
                        </label>
                        <div style={{
                            display: 'flex', gap: 8,
                        }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                padding: '11px 12px', borderRadius: 12,
                                border: `1.5px solid ${BORDER}`,
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                flexShrink: 0,
                            }}>
                                <span style={{ fontSize: 14 }}>🇻🇪</span>
                                <span style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>+58</span>
                            </div>
                            <input
                                value={telefono.replace('+58 ', '')}
                                onChange={e => setTelefono('+58 ' + e.target.value.replace(/\D/g, '').slice(0, 10))}
                                placeholder="412 000 0000"
                                inputMode="numeric"
                                maxLength={10}
                                style={{
                                    flex: 1, border: `1.5px solid ${BORDER}`, borderRadius: 12,
                                    padding: '11px 14px', fontFamily: F, fontSize: 14,
                                    color: 'rgba(255,255,255,0.9)', outline: 'none',
                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = '#EC4899'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.15)' }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(236,72,153,0.14)'; e.currentTarget.style.boxShadow = 'none' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex justify-end sm:justify-end justify-center">
                    <button
                        onClick={handleSavePerfil}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 20px', borderRadius: 12,
                            backgroundColor: saved ? '#10B981' : PINK,
                            color: 'white', border: 'none', cursor: 'pointer',
                            fontFamily: F, fontSize: 14, fontWeight: 600,
                            transition: 'background-color 0.3s, transform 0.15s',
                            boxShadow: saved ? '0 4px 14px rgba(16,185,129,0.3)' : '0 4px 14px rgba(236,72,153,0.3)',
                        }}
                    >
                        {saved ? <Check size={15} /> : <Save size={15} />}
                        {saved ? 'Guardado' : 'Guardar cambios'}
                    </button>
                </div>
            </SectionCard>

            {/* Cambiar contraseña */}
            <SectionCard title="Cambiar contraseña" icon={<Lock size={16} />}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 480 }}>
                    {/* Contraseña actual */}
                    <div>
                        <label style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#D8B4FE', display: 'block', marginBottom: 6 }}>
                            Contraseña actual
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                value={currentPass}
                                onChange={e => setCurrentPass(e.target.value.slice(0, 64))}
                                placeholder="••••••••"
                                maxLength={64}
                                style={{
                                    width: '100%', border: `1.5px solid ${BORDER}`, borderRadius: 12,
                                    padding: '11px 44px 11px 14px', fontFamily: F, fontSize: 14,
                                    color: 'rgba(255,255,255,0.9)', outline: 'none', boxSizing: 'border-box',
                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = '#EC4899'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.15)' }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(236,72,153,0.14)'; e.currentTarget.style.boxShadow = 'none' }}
                            />
                            <button onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                                {showCurrent ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>

                    {/* Nueva contraseña */}
                    <div>
                        <label style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#D8B4FE', display: 'block', marginBottom: 6 }}>
                            Nueva contraseña
                            <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.25)', marginLeft: 6, fontSize: 11 }}>{newPass.length}/30</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showNew ? 'text' : 'password'}
                                value={newPass}
                                onChange={e => setNewPass(e.target.value.slice(0, 30))}
                                placeholder="Mínimo 8 caracteres"
                                maxLength={30}
                                style={{
                                    width: '100%', border: `1.5px solid ${BORDER}`, borderRadius: 12,
                                    padding: '11px 44px 11px 14px', fontFamily: F, fontSize: 14,
                                    color: 'rgba(255,255,255,0.9)', outline: 'none', boxSizing: 'border-box',
                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = '#EC4899'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.15)' }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(236,72,153,0.14)'; e.currentTarget.style.boxShadow = 'none' }}
                            />
                            <button onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                                {showNew ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirmar */}
                    <div>
                        <label style={{ fontFamily: F, fontSize: 13, fontWeight: 600, color: '#D8B4FE', display: 'block', marginBottom: 6 }}>
                            Confirmar nueva contraseña
                            <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.25)', marginLeft: 6, fontSize: 11 }}>{confirmPass.length}/30</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                value={confirmPass}
                                onChange={e => setConfirmPass(e.target.value.slice(0, 30))}
                                placeholder="Repite la nueva contraseña"
                                maxLength={30}
                                style={{
                                    width: '100%', border: `1.5px solid ${BORDER}`, borderRadius: 12,
                                    padding: '11px 44px 11px 14px', fontFamily: F, fontSize: 14,
                                    color: 'rgba(255,255,255,0.9)', outline: 'none', boxSizing: 'border-box',
                                    backgroundColor: 'rgba(255,255,255,0.06)',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = '#EC4899'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(236,72,153,0.15)' }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(236,72,153,0.14)'; e.currentTarget.style.boxShadow = 'none' }}
                            />
                            <button onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>
                                {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                    </div>

                    {/* Validaciones */}
                    {(newPass.length > 0 || confirmPass.length > 0) && (
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.08)`, borderRadius: 10, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[
                                { ok: passMin8, text: 'Al menos 8 caracteres' },
                                { ok: passMatch, text: 'Las contraseñas coinciden' },
                            ].map(v => (
                                <div key={v.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <div style={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: v.ok ? '#10B981' : 'rgba(236,72,153,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        {v.ok && <Check size={9} color="white" strokeWidth={3} />}
                                    </div>
                                    <span style={{ fontFamily: F, fontSize: 12, color: v.ok ? '#10B981' : 'rgba(255,255,255,0.3)' }}>{v.text}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            onClick={handleSavePass}
                            disabled={!passMin8 || !passMatch || !currentPass}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '10px 20px', borderRadius: 12,
                                backgroundColor: passSaved ? '#10B981' : PINK,
                                color: 'white', border: 'none', cursor: 'pointer',
                                fontFamily: F, fontSize: 14, fontWeight: 600,
                                opacity: (!passMin8 || !passMatch || !currentPass) ? 0.4 : 1,
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 14px rgba(236,72,153,0.3)',
                            }}
                        >
                            {passSaved ? <Check size={15} /> : <Lock size={15} />}
                            {passSaved ? 'Contraseña actualizada' : 'Actualizar contraseña'}
                        </button>
                    </div>
                </div>
            </SectionCard>
        </div>
    )
}

// ─── Tab Configuración ────────────────────────────────────────────────────────
function TabConfiguracion() {
    const [negocio, setNegocio] = useState('Distribuidora Pérez')
    const [rif, setRif] = useState('J-12345678-9')
    const [direccion, setDireccion] = useState('Av. Libertador, Caracas')
    const [telNegocio, setTelNegocio] = useState('0212-123-4567')
    const [ciudad, setCiudad] = useState('caracas')
    const [saved, setSaved] = useState(false)

    const [notifs, setNotifs] = useState({
        ordenEntregada: true,
        rutaCompletada: true,
        ordenFallida: true,
        nuevaOrden: false,
        choferesSinRuta: false,
    })

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    const ciudades = [
        { value: 'caracas', label: 'Caracas' },
        { value: 'maracaibo', label: 'Maracaibo' },
        { value: 'valencia', label: 'Valencia' },
        { value: 'barquisimeto', label: 'Barquisimeto' },
        { value: 'maracay', label: 'Maracay' },
        { value: 'barcelona', label: 'Barcelona' },
    ]

    const notifItems = [
        { key: 'ordenEntregada', label: 'Orden entregada', desc: 'Notificar cuando una orden sea marcada como entregada' },
        { key: 'rutaCompletada', label: 'Ruta completada', desc: 'Notificar cuando un chofer complete su ruta del día' },
        { key: 'ordenFallida', label: 'Orden fallida', desc: 'Alerta inmediata cuando una entrega falle' },
        { key: 'nuevaOrden', label: 'Nueva orden creada', desc: 'Notificar cada vez que se registre una nueva orden' },
        { key: 'choferesSinRuta', label: 'Choferes sin ruta', desc: 'Alertar si hay choferes disponibles sin ruta asignada' },
    ] as const

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Datos del negocio */}
            <SectionCard title="Datos del negocio" icon={<Building2 size={16} />}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-1 sm:col-span-2">
                        <Field label="Nombre del negocio" value={negocio} onChange={v => setNegocio(v)} placeholder="Mi Negocio" maxLength={50} />
                    </div>
                    <Field label="RIF" value={rif} onChange={v => setRif(v)} placeholder="J-00000000-0" isRif maxLength={12} />
                    <Field label="Teléfono de contacto" value={telNegocio} onChange={v => setTelNegocio(v.replace(/D/g, '').slice(0, 11))} placeholder="0212-000-0000" onlyNumbers maxLength={11} />
                    <div className="col-span-1 sm:col-span-2">
                        <Field label="Dirección" value={direccion} onChange={v => setDireccion(v)} placeholder="Dirección de tu negocio" maxLength={150} />
                    </div>
                </div>

                <div className="mt-5 flex justify-end sm:justify-end justify-center">
                    <button
                        onClick={handleSave}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '10px 20px', borderRadius: 12,
                            backgroundColor: saved ? '#10B981' : PINK,
                            color: 'white', border: 'none', cursor: 'pointer',
                            fontFamily: F, fontSize: 14, fontWeight: 600,
                            transition: 'all 0.2s',
                            boxShadow: saved ? '0 4px 14px rgba(16,185,129,0.3)' : '0 4px 14px rgba(236,72,153,0.3)',
                        }}
                    >
                        {saved ? <Check size={15} /> : <Save size={15} />}
                        {saved ? 'Guardado' : 'Guardar cambios'}
                    </button>
                </div>
            </SectionCard>

            {/* Zona de operación */}
            <SectionCard title="Zona de operación" icon={<MapPin size={16} />}>
                <p style={{ fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 16px 0' }}>
                    La ciudad principal determina el centro del mapa en tu dashboard.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ciudades.map(c => (
                        <button
                            key={c.value}
                            onClick={() => setCiudad(c.value)}
                            style={{
                                padding: '12px 16px', borderRadius: 12, cursor: 'pointer',
                                border: `1.5px solid ${ciudad === c.value ? PINK : BORDER}`,
                                backgroundColor: ciudad === c.value ? 'rgba(236,72,153,0.15)' : 'rgba(255,255,255,0.04)',
                                fontFamily: F, fontSize: 14, fontWeight: ciudad === c.value ? 700 : 500,
                                color: ciudad === c.value ? PINK : 'rgba(255,255,255,0.5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                transition: 'all 0.15s',
                            }}
                        >
                            {ciudad === c.value && <Check size={14} color={PINK} strokeWidth={3} />}
                            {c.label}
                        </button>
                    ))}
                </div>
            </SectionCard>

            {/* Notificaciones */}
            <SectionCard title="Notificaciones" icon={<Bell size={16} />}>
                <p style={{ fontFamily: F, fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 18px 0' }}>
                    Elige qué eventos te generan una notificación en el sistema.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {notifItems.map((item, i) => (
                        <div
                            key={item.key}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                gap: 16, padding: '14px 0',
                                borderBottom: i < notifItems.length - 1 ? `1px solid rgba(236,72,153,0.08)` : 'none',
                            }}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontFamily: F, fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: '0 0 2px 0' }}>
                                    {item.label}
                                </p>
                                <p style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                                    {item.desc}
                                </p>
                            </div>
                            <Toggle
                                value={notifs[item.key]}
                                onChange={v => setNotifs(prev => ({ ...prev, [item.key]: v }))}
                            />
                        </div>
                    ))}
                </div>
            </SectionCard>

        </div>
    )
}

// ─── Settings Page ────────────────────────────────────────────────────────────
export default function SettingsPage() {
    const [tab, setTab] = useState<Tab>('perfil')
    const { user } = useAuthStore()

    return (
        <div style={{ fontFamily: F }} className="max-w-3xl mx-auto w-full px-1 sm:px-0">

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <p style={{
                    fontFamily: F, fontSize: 13, fontWeight: 700, margin: '0 0 3px 0',
                    background: 'linear-gradient(135deg, #EC4899, #D8B4FE)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                    Mi cuenta
                </p>
                <h1 style={{ fontFamily: F, fontSize: 28, fontWeight: 900, color: 'rgba(255,255,255,0.92)', margin: '0 0 3px 0', letterSpacing: '-0.02em' }}>
                    Perfil y Configuración
                </h1>
                <p style={{ fontFamily: F, fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                    {user?.email}
                </p>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex', gap: 4, marginBottom: 24,
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: `1px solid ${BORDER}`,
                borderRadius: 14, padding: 4,
            }} className="w-full sm:w-fit">
                {([
                    { key: 'perfil', label: 'Mi Perfil', icon: <User size={15} /> },
                    { key: 'configuracion', label: 'Configuración', icon: <Settings size={15} /> },
                ] as { key: Tab; label: string; icon: React.ReactNode }[]).map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                            padding: '9px 20px', borderRadius: 10,
                            border: 'none', cursor: 'pointer',
                            fontFamily: F, fontSize: 14, fontWeight: 600,
                            transition: 'all 0.2s', flex: 1,
                            backgroundColor: tab === t.key ? 'rgba(236,72,153,0.2)' : 'transparent',
                            color: tab === t.key ? PINK : 'rgba(255,255,255,0.45)',
                            boxShadow: tab === t.key ? '0 2px 12px rgba(236,72,153,0.25)' : 'none',
                        }}
                    >
                        <span style={{ color: tab === t.key ? PINK : 'rgba(255,255,255,0.3)' }}>{t.icon}</span>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Contenido del tab */}
            {tab === 'perfil' && <TabPerfil />}
            {tab === 'configuracion' && <TabConfiguracion />}
        </div>
    )
}