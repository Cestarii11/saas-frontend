import { Link } from 'react-router-dom'

export default function HeroSection() {
    return (
        <section
            className="w-full min-h-[calc(100svh-64px)] flex flex-col items-center justify-center px-5 pt-16 pb-0 overflow-hidden relative"
            style={{ backgroundColor: '#2a1020' }}
        >
            {/* Orb decorativo centro */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-30 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #EC4899 0%, transparent 70%)' }}
            />
            <div
                className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, #D8B4FE 0%, transparent 70%)' }}
            />

            <div className="max-w-3xl w-full mx-auto text-center relative z-10">

                {/* Headline */}
                <h1
                    className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-5 text-white"
                    style={{ animation: 'fadeUp 0.6s ease 0.1s both' }}
                >
                    Gestiona tu flota,
                    <br />entregas y rutas
                    <br />
                    <span
                        className="text-transparent bg-clip-text"
                        style={{ backgroundImage: 'linear-gradient(135deg, #EC4899 30%, #D8B4FE 100%)' }}
                    >
                        en un solo lugar
                    </span>
                </h1>

                {/* Sub */}
                <p
                    className="text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.55)', animation: 'fadeUp 0.6s ease 0.2s both' }}
                >
                    La herramienta que necesitan las PYMES venezolanas para manejar
                    sus repartidores, órdenes y rutas desde un solo lugar.
                </p>

                {/* CTA */}
                <div style={{ animation: 'fadeUp 0.6s ease 0.3s both' }}>
                    <Link
                        to="/register"
                        className="inline-block px-8 sm:px-12 py-4 sm:py-5 text-white font-black text-lg sm:text-xl rounded-2xl transition-all hover:-translate-y-1 active:scale-95"
                        style={{
                            background: 'linear-gradient(135deg, #EC4899, #D8B4FE)',
                            boxShadow: '0 16px 50px rgba(236,72,153,0.4)',
                            color: '#ffffff'
                        }}
                    >
                        Comenzar ya →
                    </Link>
                </div>
            </div>

            {/* Dashboard mock */}
            <div
                className="w-full max-w-5xl mx-auto mt-14 relative z-10 px-2 sm:px-0"
                style={{ animation: 'fadeUp 0.7s ease 0.4s both' }}
            >
                <div
                    className="rounded-t-2xl overflow-hidden"
                    style={{
                        backgroundColor: '#1a0a14',
                        border: '1px solid rgba(236,72,153,0.15)',
                        boxShadow: '0 -8px 60px rgba(236,72,153,0.12)',
                    }}
                >
                    {/* Window bar */}
                    <div className="flex items-center gap-2 px-4 sm:px-5 py-3 border-b border-white/10">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#EC4899]" />
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#D8B4FE]" />
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/20" />
                        <div className="flex items-center gap-3 sm:gap-5 ml-3">
                            {['Dashboard', 'Órdenes', 'Rutas', 'Flota'].map((tab, i) => (
                                <span
                                    key={tab}
                                    className={`text-[10px] sm:text-xs font-semibold ${i === 0 ? 'text-[#EC4899] border-b border-[#EC4899] pb-0.5' : 'text-white/30'}`}
                                >
                                    {tab}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Stats — 2 cols mobile, 4 desktop */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-white/10 border-b border-white/10">
                        {[
                            { label: 'Órdenes hoy', value: '248', sub: '+12%', color: '#EC4899' },
                            { label: 'En tránsito', value: '34', sub: '+5%', color: '#D8B4FE' },
                            { label: 'Choferes activos', value: '9', sub: '100%', color: '#10B981' },
                            { label: 'Ingresos hoy', value: '$1,240', sub: '+8%', color: '#F59E0B' },
                        ].map((s) => (
                            <div key={s.label} className="px-4 sm:px-5 py-4">
                                <p className="text-white/40 text-[10px] sm:text-xs mb-0.5">{s.label}</p>
                                <p className="font-black text-lg sm:text-2xl" style={{ color: s.color }}>{s.value}</p>
                                <p className="text-[10px] sm:text-xs mt-0.5" style={{ color: s.color }}>{s.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Chart + mapa */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 sm:divide-x divide-white/10 min-h-[160px] sm:min-h-[200px]">
                        <div className="sm:col-span-3 p-4 sm:p-6">
                            <p className="text-white/40 text-[10px] sm:text-xs mb-3 sm:mb-4">Entregas por día</p>
                            <div className="flex items-end gap-1.5 sm:gap-2 h-20 sm:h-24">
                                {[{ h: 45, l: 'L' }, { h: 62, l: 'M' }, { h: 38, l: 'X' }, { h: 75, l: 'J' }, { h: 58, l: 'V' }, { h: 92, l: 'S' }, { h: 70, l: 'D' }].map((bar, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <div className="w-full rounded-sm" style={{
                                            height: `${bar.h}%`,
                                            background: i === 5 ? 'linear-gradient(180deg,#EC4899,#D8B4FE)' : 'rgba(255,255,255,0.1)',
                                        }} />
                                        <span className="text-white/25 text-[9px] sm:text-[10px]">{bar.l}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="sm:col-span-2 p-4 sm:p-5 border-t sm:border-t-0 border-white/10">
                            <p className="text-white/40 text-[10px] sm:text-xs mb-3">Caracas · 5 paradas</p>
                            <div className="relative bg-[#0f172a] rounded-xl overflow-hidden" style={{ minHeight: 100 }}>
                                <div className="absolute inset-0 opacity-[0.07]"
                                    style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 28px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 28px)' }} />
                                {[
                                    { t: '15%', l: '18%', n: '1', c: '#EC4899' },
                                    { t: '40%', l: '38%', n: '2', c: '#D8B4FE' },
                                    { t: '30%', l: '58%', n: '3', c: '#D8B4FE' },
                                    { t: '15%', l: '72%', n: '4', c: '#D8B4FE' },
                                    { t: '60%', l: '68%', n: '5', c: '#10B981' },
                                ].map((pin) => (
                                    <div key={pin.n} className="absolute" style={{ top: pin.t, left: pin.l, transform: 'translate(-50%,-50%)' }}>
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white text-[9px] sm:text-[10px] font-black shadow-md"
                                            style={{ backgroundColor: pin.c }}>{pin.n}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
        </section>
    )
}