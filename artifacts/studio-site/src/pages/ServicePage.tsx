import { useState } from 'react';
import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Printer, Layers, Wrench, Lightbulb } from 'lucide-react';
import SafeImage from '../components/SafeImage';

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
      'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842078/produccion.png_na2rtr.png',
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
      'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842077/stand.png_bh1u4z.png',
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
      'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842077/instalacion-panel.png_lvioxm.png',
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
      'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842496/stand-uss.png_cpwfms.jpg',
    ],
  },
};

type ServiceSlug = keyof typeof serviceData;

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = serviceData[slug as ServiceSlug];

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setFormStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || formData.email,
          email: formData.email,
          phone: formData.phone,
          message: `Servicio: ${service?.title}\n\n${formData.message}`,
        }),
      });
      if (!res.ok) throw new Error();
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
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
      <section className="pt-[64px] relative overflow-hidden" style={{ minHeight: '56vh' }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <SafeImage
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.60) 60%, rgba(0,0,0,0.30) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,11,0.9) 0%, transparent 50%)' }} />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col justify-center" style={{ minHeight: 'calc(56vh - 64px)', paddingTop: 64, paddingBottom: 64 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ display: 'block', fontSize: 11, letterSpacing: '0.28em', color: accent, textTransform: 'uppercase', marginBottom: 20 }}>— Servicio</span>
            <h1 className="font-display text-white leading-none mb-4" style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}>{title}</h1>
            <p style={{ fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'rgba(255,255,255,0.65)', maxWidth: 560, lineHeight: 1.6 }}>{tagline}</p>
          </motion.div>
        </div>
      </section>

      {/* Main — two columns */}
      <section className="py-20 bg-[#0A0A0B]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-16 items-start">

          {/* Left: description + features + form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="flex flex-col gap-10"
          >
            {/* Description */}
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>Descripción</p>
              <p style={{ fontSize: 17, color: '#ccc', lineHeight: 1.85 }}>{description}</p>
            </div>

            {/* Features */}
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', marginBottom: 16 }}>Incluye</p>
              <ul className="flex flex-col gap-3">
                {features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ fontSize: 15, color: '#aaa' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cotización form */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 32 }}>
              {formStatus === 'success' ? (
                <div className="py-6 text-center">
                  <p className="font-display text-white text-2xl mb-2">¡Mensaje enviado!</p>
                  <p style={{ color: '#666', fontSize: 14 }}>Te contactaremos muy pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <h3 className="font-display text-white" style={{ fontSize: 28 }}>Solicitar cotización</h3>

                  {[
                    { label: 'Nombre', key: 'name', type: 'text', placeholder: 'Tu nombre' },
                    { label: 'Email', key: 'email', type: 'email', placeholder: 'tu@correo.cl' },
                    { label: 'Teléfono', key: 'phone', type: 'tel', placeholder: '+56 9 XXXX XXXX' },
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

                  <div className="flex gap-3 flex-wrap">
                    <button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="flex items-center gap-2 px-6 py-3 text-[13px] uppercase tracking-[0.18em] font-semibold transition-opacity hover:opacity-85 disabled:opacity-50"
                      style={{ background: accent, color: 'white' }}
                    >
                      {formStatus === 'sending' ? 'Enviando…' : <>Enviar solicitud <ArrowRight size={14} /></>}
                    </button>
                    <a
                      href={`https://wa.me/56992285863?text=${waMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 text-[13px] uppercase tracking-[0.15em] font-semibold transition-opacity hover:opacity-85"
                      style={{ background: '#25D366', color: 'white' }}
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </div>

                  {formStatus === 'error' && (
                    <p style={{ fontSize: 13, color: '#f87171' }}>Error al enviar. Intenta por WhatsApp.</p>
                  )}
                </form>
              )}
            </div>
          </motion.div>

          {/* Right: single image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
            className="sticky top-[80px]"
          >
            <div className="overflow-hidden rounded-lg" style={{ aspectRatio: '4/5', background: '#141416' }}>
              <SafeImage
                src={images[0]}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

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
