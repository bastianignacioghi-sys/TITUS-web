import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Printer, Layers, Wrench, Lightbulb } from 'lucide-react';
import { useSubmitContact } from '@workspace/api-client-react';

const serviceData = {
  'produccion-grafica': {
    icon: Printer,
    title: 'Producción Gráfica',
    accent: '#e8420a',
    tagline: 'Impresión digital de gran formato y gigantografía',
    description: 'Desarrollamos y ejecutamos piezas gráficas en impresión digital de gran formato. Trabajamos con lonas, viniles, papeles especiales y superficies rígidas, garantizando calidad de impresión y color en cada proyecto — desde una pieza puntual hasta un sistema de señalética completo.',
    features: [
      'Impresión digital de gran formato',
      'Gigantografías y lonas de alta resolución',
      'Vinilado en vehículos y superficies',
      'Material POP, banners y roll-ups',
      'Tótems y señalética impresa',
      'Manejo de color perfilado y calibrado',
    ],
    images: [
      'https://picsum.photos/seed/grafica1/1200/700',
      'https://picsum.photos/seed/grafica2/1200/700',
      'https://picsum.photos/seed/grafica3/1200/700',
      'https://picsum.photos/seed/grafica4/1200/700',
    ],
  },
  'produccion-industrial': {
    icon: Layers,
    title: 'Producción Industrial',
    accent: '#3b82f6',
    tagline: 'Fabricación y construcción de elementos para exhibición',
    description: 'Fabricamos y construimos elementos para exhibición, módulos, gabinetes, stands y estructuras tridimensionales. Combinamos materiales metálicos, maderas y acrílicos para crear piezas de alta durabilidad y acabado profesional para cualquier espacio.',
    features: [
      'Stands y módulos de exhibición a medida',
      'Gabinetes y muebles corporativos',
      'Letras volumétricas y logotipos en relieve',
      'Estructuras metálicas y en aluminio',
      'Acrílicos, MDF y materiales compuestos',
      'Prototipos y maquetas',
    ],
    images: [
      'https://picsum.photos/seed/industrial1/1200/700',
      'https://picsum.photos/seed/industrial2/1200/700',
      'https://picsum.photos/seed/industrial3/1200/700',
      'https://picsum.photos/seed/industrial4/1200/700',
    ],
  },
  'montaje-en-obra': {
    icon: Wrench,
    title: 'Montaje en Obra',
    accent: '#22c55e',
    tagline: 'Instalación profesional en terreno',
    description: 'Ejecutamos instalaciones en terreno con equipos especializados y las medidas de seguridad necesarias. Montamos señalética, elementos volumétricos, lonas y estructuras en cualquier tipo de superficie, altura y condición de obra.',
    features: [
      'Instalación de señalética corporativa',
      'Montaje de letras y logotipos en altura',
      'Instalación de lonas y gigantografías',
      'Vinilado en vidrios, paredes y fachadas',
      'Coordinación con administración de obra',
      'Equipos con protocolos de seguridad',
    ],
    images: [
      'https://picsum.photos/seed/montaje1/1200/700',
      'https://picsum.photos/seed/montaje2/1200/700',
      'https://picsum.photos/seed/montaje3/1200/700',
      'https://picsum.photos/seed/montaje4/1200/700',
    ],
  },
  'soluciones': {
    icon: Lightbulb,
    title: 'Proponemos Soluciones',
    accent: '#a855f7',
    tagline: 'Proyectos integrales desde la idea hasta la ejecución',
    description: 'Desarrollamos proyectos a partir de las ideas de nuestros clientes, proponiendo soluciones eficientes, modernas y prácticas. Acompañamos cada etapa del proceso — desde el diseño conceptual y renders hasta la fabricación e instalación final en obra.',
    features: [
      'Consultoría y diseño conceptual',
      'Renders y visualizaciones 3D',
      'Desarrollo de proyectos integrales',
      'Gestión completa del proyecto',
      'Asesoría en materiales y procesos',
      'Coordinación multidisciplinaria',
    ],
    images: [
      'https://picsum.photos/seed/sol1/1200/700',
      'https://picsum.photos/seed/sol2/1200/700',
      'https://picsum.photos/seed/sol3/1200/700',
      'https://picsum.photos/seed/sol4/1200/700',
    ],
  },
};

type ServiceSlug = keyof typeof serviceData;

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = serviceData[slug as ServiceSlug];

  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const submitContact = useSubmitContact({
    mutation: {
      onSuccess: () => {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
      },
      onError: () => setFormStatus('error'),
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setFormStatus('sending');
    try {
      await submitContact.mutateAsync({
        data: {
          name: formData.name || formData.email,
          email: formData.email,
          message: `Servicio: ${service?.title}\n\n${formData.message}`,
        },
      });
    } catch {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center gap-4">
        <p className="text-white text-xl">Servicio no encontrado.</p>
        <Link href="/" className="text-[#ff5a1f] text-sm hover:opacity-70 transition-opacity">← Volver al inicio</Link>
      </div>
    );
  }

  const { icon: Icon, title, accent, tagline, description, features, images } = service;

  const goTo = (idx: number) => {
    setDirection(idx > slide ? 1 : -1);
    setSlide(idx);
  };
  const prev = () => goTo((slide - 1 + images.length) % images.length);
  const next = () => goTo((slide + 1) % images.length);

  const waMessage = encodeURIComponent(`Hola TITUS, me interesa cotizar: ${title}`);

  return (
    <div className="min-h-screen bg-[#0A0A0B]" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-[64px]"
        style={{ background: 'rgba(10,10,11,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} />
          <span style={{ letterSpacing: '0.08em' }}>Volver</span>
        </Link>
        <Link href="/">
          <span className="font-display text-white text-xl tracking-[0.2em]">TITUS</span>
        </Link>
        <a
          href={`https://wa.me/56992285863?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] uppercase tracking-[0.15em] px-4 py-2 transition-opacity hover:opacity-80"
          style={{ background: accent, color: '#fff' }}
        >
          Cotizar
        </a>
      </nav>

      {/* Hero */}
      <section className="pt-[64px] relative overflow-hidden" style={{ minHeight: '52vh', background: '#111113' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 60% 80% at 20% 50%, ${accent}20 0%, transparent 70%)` }} />
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col justify-center" style={{ minHeight: 'calc(52vh - 64px)', paddingTop: 64, paddingBottom: 64 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${accent}18`, border: `1.5px solid ${accent}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} color={accent} strokeWidth={1.5} />
              </div>
              <span style={{ fontSize: 11, letterSpacing: '0.28em', color: accent, textTransform: 'uppercase' }}>Servicio</span>
            </div>
            <h1 className="font-display text-white leading-none mb-4" style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}>{title}</h1>
            <p style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: '#888', maxWidth: 560, lineHeight: 1.6 }}>{tagline}</p>
          </motion.div>
        </div>
      </section>

      {/* Description + Features */}
      <section className="py-20 bg-[#0A0A0B]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>Descripción</p>
            <p style={{ fontSize: 18, color: '#ccc', lineHeight: 1.8 }}>{description}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p style={{ fontSize: 11, letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>Incluye</p>
            <ul className="flex flex-col gap-3">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontSize: 15, color: '#aaa' }}>{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Image Carousel */}
      <section className="pb-20 bg-[#0A0A0B]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <p style={{ fontSize: 11, letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', marginBottom: 24 }}>Trabajos</p>
          <div className="relative overflow-hidden rounded-lg" style={{ aspectRatio: '16/7', background: '#141416' }}>
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.img
                key={slide}
                src={images[slide]}
                alt={`${title} — imagen ${slide + 1}`}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all hover:scale-110"
              style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <ChevronLeft size={20} color="white" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center transition-all hover:scale-110"
              style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <ChevronRight size={20} color="white" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  style={{ width: i === slide ? 24 : 8, height: 8, borderRadius: 4, border: 'none', cursor: 'pointer', background: i === slide ? accent : 'rgba(255,255,255,0.3)', transition: 'all 0.25s', padding: 0 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Cotizar */}
      <section className="py-20 border-t border-[rgba(255,255,255,0.06)]" style={{ background: '#111113' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-14 items-center">

          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.28em', color: accent, textTransform: 'uppercase', marginBottom: 16 }}>— Cotizar</p>
            <h2 className="font-display text-white leading-none mb-6" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
              ¿Tienes un proyecto<br />de {title.toLowerCase()}?
            </h2>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8, marginBottom: 32, maxWidth: 380 }}>
              Cuéntanos qué necesitas y te responderemos con una propuesta en menos de 24 horas.
            </p>
            <a
              href={`https://wa.me/56992285863?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 text-[13px] uppercase tracking-[0.15em] font-semibold transition-opacity hover:opacity-85"
              style={{ background: '#25D366', color: 'white' }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Cotizar por WhatsApp
            </a>
          </div>

          <div style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#141416', borderRadius: 12, padding: 32 }}>
            {formStatus === 'success' ? (
              <div className="py-8 text-center">
                <p className="font-display text-white text-2xl mb-2">¡Mensaje enviado!</p>
                <p style={{ color: '#666', fontSize: 14 }}>Te contactaremos muy pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <h3 className="font-display text-white text-2xl">Solicitar cotización</h3>

                {[
                  { label: 'Nombre', key: 'name', type: 'text', placeholder: 'Tu nombre' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'tu@correo.cl' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={formData[key as keyof typeof formData]}
                      onChange={e => setFormData(f => ({ ...f, [key]: e.target.value }))}
                      required={key === 'email'}
                      className="w-full pb-2 text-white text-sm outline-none transition-colors"
                      style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = accent)}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.12)')}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>Descripción del proyecto</label>
                  <textarea
                    placeholder="Cuéntanos qué necesitas..."
                    rows={3}
                    value={formData.message}
                    onChange={e => setFormData(f => ({ ...f, message: e.target.value }))}
                    className="w-full text-sm outline-none transition-colors resize-none"
                    style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.12)', color: '#fff', paddingBottom: 8 }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = accent)}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.12)')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'sending'}
                  className="flex items-center justify-center gap-2 py-3 text-[13px] uppercase tracking-[0.18em] font-semibold transition-opacity hover:opacity-85 disabled:opacity-50"
                  style={{ background: accent, color: 'white' }}
                >
                  {formStatus === 'sending' ? 'Enviando…' : <>Enviar solicitud <ArrowRight size={14} /></>}
                </button>

                {formStatus === 'error' && (
                  <p style={{ fontSize: 13, color: '#f87171', textAlign: 'center' }}>Error al enviar. Intenta por WhatsApp.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer mínimo */}
      <footer className="py-8 border-t border-[rgba(255,255,255,0.05)]" style={{ background: '#0A0A0B' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <span className="font-display text-white text-lg tracking-[0.2em]">TITUS</span>
          <Link href="/#servicios" className="text-[12px] uppercase tracking-[0.2em] text-[#555] hover:text-white transition-colors">
            Ver todos los servicios
          </Link>
        </div>
      </footer>
    </div>
  );
}
