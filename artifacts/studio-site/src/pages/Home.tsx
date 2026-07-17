import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Quote, Printer, Layers, Wrench, Lightbulb } from 'lucide-react';
import { SiInstagram, SiBehance } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';
import { portfolio } from '../data/portfolio';
import SafeImage from '../components/SafeImage';

const TRAIL_COUNT = 8;

const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: -200, y: -200 });
  const history = useRef<Array<{ x: number; y: number }>>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -200, y: -200 }))
  );
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let tick = 0;
    const loop = () => {
      tick++;
      const { x, y } = mouse.current;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }

      if (tick % 2 === 0) {
        history.current = [{ x, y }, ...history.current.slice(0, TRAIL_COUNT - 1)];
        trailRefs.current.forEach((el, i) => {
          if (!el) return;
          const p = history.current[i];
          const t = 1 - i / TRAIL_COUNT;
          const size = 3 + t * 3;
          el.style.transform = `translate(${p.x - size / 2}px, ${p.y - size / 2}px)`;
          el.style.opacity = String(t * 0.55);
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <div
          key={i}
          ref={el => { trailRefs.current[i] = el; }}
          className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full bg-[#ff5a1f]"
          style={{ opacity: 0, willChange: 'transform, opacity, width, height' }}
        />
      ))}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] w-[8px] h-[8px] rounded-full bg-white"
        style={{ willChange: 'transform' }}
      />
      <style>{`
        @keyframes scroll-line {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(20px); opacity: 0; }
        }
        @keyframes progress-dot {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </>
  );
};

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const heroImgMainRef = useRef<HTMLImageElement>(null);
  const heroImgSecRef = useRef<HTMLImageElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const [heroBgIndex, setHeroBgIndex] = useState(0);

  const heroBgImages = [
    'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842078/produccion.png_na2rtr.png',
    'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842077/instalacion-panel.png_lvioxm.png',
    'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842496/stand-uss.png_cpwfms.jpg',
  ];
  const heroTexts = ["MARCAS", "SEÑALES", "ESPACIOS"];
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  const clientLogos = [
    { name: 'Cliente A',  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782334912/Dise%C3%B1o_sin_t%C3%ADtulo_1_dbbnyk.png' },
    { name: 'Cliente B',  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782334975/Dise%C3%B1o_sin_t%C3%ADtulo_2_expudm.png' },
    { name: 'Cliente C',  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782335079/Dise%C3%B1o_sin_t%C3%ADtulo_3_sptoxl.png' },
    { name: 'Cliente D',  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782335287/Dise%C3%B1o_sin_t%C3%ADtulo_4_ownqr7.png' },
    { name: 'Cliente E',  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782335349/Dise%C3%B1o_sin_t%C3%ADtulo_5_avofzm.png' },
    { name: 'Cliente F',  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782334975/Dise%C3%B1o_sin_t%C3%ADtulo_2_expudm.png' },
    { name: 'Cliente G',  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782335079/Dise%C3%B1o_sin_t%C3%ADtulo_3_sptoxl.png' },
    { name: 'Cliente H',  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782335287/Dise%C3%B1o_sin_t%C3%ADtulo_4_ownqr7.png' },
    { name: 'Cliente I',  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782334912/Dise%C3%B1o_sin_t%C3%ADtulo_1_dbbnyk.png' },
    { name: 'Cliente J',  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782335079/Dise%C3%B1o_sin_t%C3%ADtulo_3_sptoxl.png' },
    { name: 'Cliente K',  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782335349/Dise%C3%B1o_sin_t%C3%ADtulo_5_avofzm.png' },
  ];
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroBgIndex((prev) => (prev + 1) % heroBgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBgImages.length]);

  const services = [
    { icon: Printer,   slug: 'produccion-grafica',    title: "Producción Gráfica",      desc: "Desarrollo y ejecución de piezas gráficas en impresión digital de gran formato y gigantografía.",                                              accent: "#e8420a", bg: "#120a08" },
    { icon: Layers,    slug: 'produccion-industrial', title: "Producción Industrial",   desc: "Fabricación y construcción de elementos para exhibición, módulos, gabinetes y stand.",                                                         accent: "#3b82f6", bg: "#08101a" },
    { icon: Wrench,    slug: 'montaje-en-obra',       title: "Montaje en Obra",         desc: "Ejecutamos instalaciones en terreno, piezas gráficas y montaje de elementos volumétricos.",                                                     accent: "#22c55e", bg: "#08150a" },
    { icon: Lightbulb, slug: 'soluciones',            title: "Proponemos Soluciones",   desc: "Desarrollamos proyectos a partir de las ideas de nuestros clientes, proponiendo soluciones eficientes, modernas y prácticas.",               accent: "#a855f7", bg: "#120815" },
  ];

  const workCategories = [
    { title: "Producción Gráfica",    slug: "produccion-grafica",    accent: "#e8420a", img: "https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842078/produccion.png_na2rtr.png",          desc: "Impresión digital de gran formato, gigantografía y vinilo." },
    { title: "Producción Industrial", slug: "produccion-industrial", accent: "#3b82f6", img: "https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842077/stand.png_bh1u4z.png",              desc: "Fabricación de stands, módulos, gabinetes y elementos volumétricos." },
    { title: "Montaje en Obra",       slug: "montaje-en-obra",       accent: "#22c55e", img: "https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842077/instalacion-panel.png_lvioxm.png",  desc: "Instalación profesional en terreno con cuadrilla especializada." },
    { title: "Proponemos Soluciones", slug: "soluciones",            accent: "#a855f7", img: "https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782842496/stand-uss.png_cpwfms.jpg",          desc: "Proyectos integrales desde la concept hasta la entrega final." },
  ];

  // Portfolio carousel
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselTouchStart = useRef<number | null>(null);
  const carouselAutoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const carouselItems = portfolio.length > 0 ? portfolio : null;

  const carouselTotal = carouselItems?.length ?? 0;

  function carouselPrev() {
    setCarouselIdx(i => (i - 1 + carouselTotal) % carouselTotal);
  }
  function carouselNext() {
    setCarouselIdx(i => (i + 1) % carouselTotal);
  }

  useEffect(() => {
    if (!carouselItems || carouselTotal < 2) return;
    carouselAutoRef.current = setInterval(() => {
      setCarouselIdx(i => (i + 1) % carouselTotal);
    }, 5000);
    return () => { if (carouselAutoRef.current) clearInterval(carouselAutoRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carouselTotal]);

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-sans selection:bg-[#ff5a1f] selection:text-black">
      <Cursor />
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-[2px] bg-[#ff5a1f] z-[10000] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />
      {/* Navigation */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-400 ease-out ${
          isScrolled 
            ? 'bg-[rgba(10,10,10,0.92)] backdrop-blur-[24px] border-b border-[rgba(255,255,255,0.07)]' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex justify-between items-center py-4">
          <a href="#" className="flex items-center h-12">
            <span className="font-display text-[24px] leading-none tracking-[0.06em] text-white">
              TITUS<span className="text-[#ff5a1f]">·</span>DISEÑO
            </span>
          </a>
          
          <div className="hidden md:flex gap-8 text-[12px] uppercase tracking-[0.15em] text-[#888]">
            {['Inicio', 'Servicios', 'Portafolio', 'Nosotros', 'Contacto'].map(link => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                className="relative hover:text-white transition-colors duration-300 group py-2"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#ff5a1f] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#0a0a0a] z-[60] flex flex-col items-center justify-center gap-12"
          >
            <button 
              className="absolute top-6 right-6 text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={32} />
            </button>
            {['Inicio', 'Servicios', 'Portafolio', 'Nosotros', 'Contacto'].map((link, i) => (
              <motion.a 
                key={link} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                href={`#${link.toLowerCase()}`} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-5xl tracking-wider hover:text-[#ff5a1f] transition-colors"
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero Section */}
      <section id="inicio" className="min-h-[100vh] relative overflow-x-hidden bg-[#0A0A0B]">
        {/* Background image carousel */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {heroBgImages.map((src, i) => (
            <SafeImage
              key={src}
              src={src}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: i === heroBgIndex ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
              }}
            />
          ))}
          {/* Strong dark overlay so text stays readable */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,10,11,0.88) 0%, rgba(10,10,11,0.70) 55%, rgba(10,10,11,0.40) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,11,0.3) 0%, transparent 30%, rgba(10,10,11,0.6) 80%, #0A0A0B 100%)' }} />
        </div>
        {/* noise texture */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none z-[2]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")" }}
        />
        {/* Orange radial glow behind headline */}
        <div className="absolute inset-0 pointer-events-none z-[3]"
          style={{ background: 'radial-gradient(ellipse 55% 50% at 30% 52%, rgba(232,66,10,0.10) 0%, transparent 65%)' }}
        />

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 min-h-[100vh] flex flex-col justify-center relative z-10">

          {/* ── CONTENT ── */}
          <div className="flex flex-col gap-4 pt-20 pb-8 md:gap-6 md:pt-32 md:pb-12" style={{ maxWidth: 720 }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span style={{ display: 'inline-block', width: 24, height: 1, background: '#e8420a', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#e8420a', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                Diseño Gráfico · Señalética · Diseño Industrial
              </span>
            </motion.div>

            {/* Headline — 2 lines */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <h1
                className="font-display leading-[0.92] tracking-wide"
                style={{
                  fontSize: 'clamp(52px, 7.5vw, 96px)',
                  color: '#ffffff',
                  display: 'block',
                }}
              >DISEÑO Y EJECUCIÓN
              PROFESIONAL</h1>
              <h1
                className="font-display leading-[0.92] tracking-wide"
                style={{
                  fontSize: 'clamp(52px, 7.5vw, 96px)',
                  color: '#e8420a',
                  display: 'block',
                }}
              >
                DE PRINCIPIO A FIN
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              style={{ fontSize: 17, color: '#ffffff', maxWidth: 580, lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}
            >
              Diseñamos, fabricamos e instalamos soluciones gráficas para empresas e industrias. Especialistas en señalética, letreros, impresión de gran formato, branding corporativo y proyectos personalizados, con más de 30 años de experiencia entregando calidad, precisión y resultados.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center"
              style={{ gap: 40 }}
            >
              <div>
                <p className="font-display leading-none" style={{ fontSize: 40, color: '#ffffff' }}>800+</p>
                <p style={{ fontSize: 11, color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4, fontFamily: 'Inter, sans-serif' }}>Proyectos completados</p>
              </div>
              <div style={{ width: 1, height: 40, background: '#333333', flexShrink: 0 }} />
              <div>
                <p className="font-display leading-none" style={{ fontSize: 40, color: '#ffffff' }}>30</p>
                <p style={{ fontSize: 11, color: '#a0a0a0', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4, fontFamily: 'Inter, sans-serif' }}>Años de experiencia</p>
              </div>
            </motion.div>

            {/* CTAs — row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex items-center gap-4 flex-wrap"
            >
              <a
                href="https://wa.me/56992285863?text=Hola%2C+quiero+cotizar+un+proyecto"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#25D366', color: '#ffffff', borderRadius: 4, padding: '16px 32px', fontSize: 14, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', textDecoration: 'none', transition: 'background-color 0.2s', boxShadow: 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#1ebe5d'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#25D366'; }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Cotizar por WhatsApp
              </a>

              <a
                href="tel:+56992285863"
                style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#2a2a2a', color: '#ffffff', borderRadius: 4, padding: '16px 24px', fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif', textDecoration: 'none', transition: 'background-color 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#383838'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#2a2a2a'; }}
              >
                o llámanos ahora →
              </a>
            </motion.div>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex items-center gap-2"
            >
              <span style={{
                display: 'inline-block', width: 8, height: 8,
                background: '#22c55e', borderRadius: '50%',
                animation: 'pulse-green-hero 2.5s ease-in-out infinite',
              }} />
              <span style={{ fontSize: 13, color: '#a0a0a0', fontFamily: 'Inter, sans-serif' }}>Disponible para nuevos proyectos</span>
            </motion.div>

          </div>
        </div>

        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[2]"
          style={{ background: 'linear-gradient(to bottom, transparent, #0A0A0B)' }}
        />
        {/* Scroll indicator — centered bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
          <span className="text-[10px] text-[#444] tracking-[0.3em] uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>SCROLL</span>
          <div className="h-[36px] w-[1px] bg-[rgba(255,255,255,0.08)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-[#444]" style={{ animation: 'scroll-line 1.5s infinite' }} />
          </div>
        </div>

        <style>{`
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes pulse-green-hero {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.35; }
          }
        `}</style>
      </section>
      {/* Services */}
      <section id="servicios" className="py-20 relative bg-[#141416]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
            className="text-[72px] font-display mb-12"
          >
            Nuestros Servicios
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((srv, idx) => {
              const Icon = srv.icon;
              const isFlipped = flippedCard === idx;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.07 }}
                  style={{ perspective: '1000px', height: '260px' }}
                  onMouseEnter={() => setFlippedCard(idx)}
                  onMouseLeave={() => setFlippedCard(null)}
                  className="cursor-pointer"
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      transformStyle: 'preserve-3d',
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  >
                    {/* ── FRONT ── */}
                    <div
                      style={{
                        position: 'absolute', inset: 0,
                        backfaceVisibility: 'hidden',
                        background: '#1c1c1c',
                        border: '2px solid rgba(255,255,255,0.22)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '20px',
                        padding: '28px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{
                        width: 72, height: 72,
                        borderRadius: '50%',
                        background: `${srv.accent}18`,
                        border: `1.5px solid ${srv.accent}55`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Icon size={36} color={srv.accent} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-[13px] uppercase tracking-[0.2em] mb-2" style={{ color: '#ffffff' }}>
                          {String(idx + 1).padStart(2, '0')}
                        </p>
                        <h3 className="text-[30px] font-display text-white leading-tight">{srv.title}</h3>
                      </div>
                    </div>

                    {/* ── BACK ── */}
                    <div
                      style={{
                        position: 'absolute', inset: 0,
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: srv.accent,
                        border: '2px solid rgba(255,255,255,0.22)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '28px',
                      }}
                    >
                      <h3 className="text-[30px] font-display text-white leading-tight">{srv.title}</h3>
                      <div>
                        <p className="text-[16px] text-white/90 leading-relaxed mb-5">{srv.desc}</p>
                        <Link
                          href={`/servicios/${srv.slug}`}
                          className="text-[13px] uppercase tracking-[0.18em] text-white font-semibold flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                          Ver más <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      {/* Clientes — Marquee infinito */}
      <section className="bg-[#0A0A0B] py-12 border-t border-[rgba(255,255,255,0.06)] overflow-hidden">
        <p style={{ textAlign: 'center', fontSize: 11, letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 36 }}>
          MARCAS QUE CONFÍAN EN NOSOTROS
        </p>
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #0A0A0B, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #0A0A0B, transparent)' }} />
          {/* Track */}
          <div style={{ display: 'flex', gap: 12, width: 'max-content', animation: 'client-marquee 28s linear infinite' }}>
            {[...clientLogos, ...clientLogos].map((logo, i) => (
              <div
                key={i}
                style={{
                  width: 140,
                  height: 96,
                  background: 'white',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 18px',
                  flexShrink: 0,
                }}
              >
                <SafeImage
                  src={logo.url}
                  alt={logo.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                />
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes client-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
      </section>
      {/* About */}
      <section id="nosotros" className="py-16 relative overflow-hidden" style={{ background: '#0A0A0B' }}>

        {/* Wave ribbon background — luminous S-curves */}
        <svg
          aria-hidden="true"
          preserveAspectRatio="xMidYMid slice"
          viewBox="0 0 1440 700"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
        >
          <defs>
            <filter id="glow-wave" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="14" result="blur" />
            </filter>
            <filter id="glow-wave-soft" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="32" result="blur" />
            </filter>
            <filter id="glow-wave-core" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" result="blur" />
            </filter>
          </defs>

          {/* Wave 1 — top sweep, right to left */}
          {/* Outer soft halo */}
          <path d="M 1520 60 C 1200 70, 950 200, 700 230 C 450 260, 220 170, -80 280"
            fill="none" stroke="#8B0000" strokeWidth="60" opacity="0.35" filter="url(#glow-wave-soft)" />
          {/* Mid glow */}
          <path d="M 1520 60 C 1200 70, 950 200, 700 230 C 450 260, 220 170, -80 280"
            fill="none" stroke="#cc1100" strokeWidth="20" opacity="0.45" filter="url(#glow-wave)" />
          {/* Bright core line */}
          <path d="M 1520 60 C 1200 70, 950 200, 700 230 C 450 260, 220 170, -80 280"
            fill="none" stroke="#ff3300" strokeWidth="2.5" opacity="0.85" filter="url(#glow-wave-core)" />

          {/* Wave 2 — middle sweep, left to right */}
          {/* Outer soft halo */}
          <path d="M -80 390 C 200 360, 480 460, 730 420 C 980 380, 1200 480, 1520 450"
            fill="none" stroke="#7a0000" strokeWidth="60" opacity="0.3" filter="url(#glow-wave-soft)" />
          {/* Mid glow */}
          <path d="M -80 390 C 200 360, 480 460, 730 420 C 980 380, 1200 480, 1520 450"
            fill="none" stroke="#bb1000" strokeWidth="18" opacity="0.4" filter="url(#glow-wave)" />
          {/* Bright core line */}
          <path d="M -80 390 C 200 360, 480 460, 730 420 C 980 380, 1200 480, 1520 450"
            fill="none" stroke="#ff2200" strokeWidth="2" opacity="0.75" filter="url(#glow-wave-core)" />

          {/* Wave 3 — lower sweep, left to right */}
          {/* Outer soft halo */}
          <path d="M -80 590 C 300 555, 650 630, 1000 600 C 1200 582, 1360 620, 1520 608"
            fill="none" stroke="#6a0000" strokeWidth="50" opacity="0.25" filter="url(#glow-wave-soft)" />
          {/* Mid glow */}
          <path d="M -80 590 C 300 555, 650 630, 1000 600 C 1200 582, 1360 620, 1520 608"
            fill="none" stroke="#aa0e00" strokeWidth="14" opacity="0.35" filter="url(#glow-wave)" />
          {/* Bright core line */}
          <path d="M -80 590 C 300 555, 650 630, 1000 600 C 1200 582, 1360 620, 1520 608"
            fill="none" stroke="#ff1a00" strokeWidth="1.5" opacity="0.65" filter="url(#glow-wave-core)" />
        </svg>

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid md:grid-cols-[1fr_1fr] gap-12 items-start relative z-10">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] text-white tracking-[0.2em] uppercase mb-6"
            >
              — Sobre Nosotros
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-[56px] md:text-[80px] font-display leading-[1] mb-4 whitespace-pre-line"
            >
              {"Nos adaptamos a tus desafíos"}
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 40 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="h-[2px] bg-[#ff5a1f] mb-8"
            />
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="text-[15px] font-light leading-[1.75] text-[#888] mb-6"
            >
              Con más de 30 años de experiencia, somos una empresa especializada en diseño gráfico, diseño industrial, fabricación de señalética corporativa e impresión de gran formato. Desarrollamos soluciones visuales de alto impacto para empresas, industrias, centros comerciales, oficinas y proyectos comerciales de todo Chile. Diseñamos, fabricamos e instalamos letreros, señalización interior y exterior, gráficas vehiculares, branding corporativo, stands, elementos publicitarios y proyectos personalizados con los más altos estándares de calidad. Nuestra trayectoria nos ha permitido trabajar junto a algunas de las empresas más importantes del país, destacando por nuestro profesionalismo, atención al detalle y compromiso con cada proyecto. Transformamos ideas en soluciones visuales duraderas que fortalecen la imagen de marca y generan resultados.
            </motion.p>
            <div className="flex gap-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <p className="font-display text-[90px] text-[#ff5a1f] leading-[1]">800+</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#555] mt-1">Proyectos</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <p className="font-display text-[90px] text-[#ff5a1f] leading-[1]">30</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#555] mt-1">Años</p>
              </motion.div>
            </div>
          </div>
          
          <div className="relative mt-10 md:mt-0">
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 overflow-hidden w-full h-[600px]"
            >
              <SafeImage
                src="https://res.cloudinary.com/dnlpxcjpw/image/upload/v1784241426/ChatGPT_Image_16_jul_2026_18_36_57_arsemi.png"
                alt="TITUS"
                className="w-full h-full object-cover grayscale-[20%] contrast-110 hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
            {/* Gradient accent line — right edge */}
            <div style={{
              position: 'absolute', top: 0, right: -4, width: 4, height: '100%',
              background: 'linear-gradient(to bottom, #E8420A, #2F6FE8)',
              borderRadius: 2, zIndex: 11,
            }} />
          </div>
        </div>
      </section>
      {/* Portfolio Carousel */}
      <section id="portafolio" className="py-16 bg-[#0A0A0B]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[clamp(48px,7vw,80px)] font-display leading-none"
            >
              Nuestro Trabajo
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[14px] text-[#666] max-w-xs leading-relaxed"
            >
              30 años produciendo identidad visual para instituciones, empresas y espacios de Chile.
            </motion.p>
          </div>

          {carouselItems ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Carousel track */}
              <div
                className="overflow-hidden"
                onTouchStart={e => { carouselTouchStart.current = e.touches[0].clientX; }}
                onTouchEnd={e => {
                  if (carouselTouchStart.current === null) return;
                  const delta = e.changedTouches[0].clientX - carouselTouchStart.current;
                  if (delta < -40) carouselNext();
                  else if (delta > 40) carouselPrev();
                  carouselTouchStart.current = null;
                }}
              >
                <div
                  className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                  style={{ transform: `translateX(-${carouselIdx * 100}%)` }}
                >
                  {carouselItems.map(item => (
                    <div
                      key={item.id}
                      className="relative flex-none w-full aspect-[16/8] overflow-hidden"
                    >
                      <SafeImage
                        src={item.img}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.0) 100%)' }}
                      />
                      <div className="absolute bottom-0 left-0 p-8 md:p-12">
                        {item.category && (
                          <p className="text-[10px] tracking-[0.28em] uppercase mb-3 text-[#ff5a1f]">
                            — {item.category}
                          </p>
                        )}
                        <h3 className="font-display text-white text-[clamp(28px,4vw,56px)] leading-none">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrows */}
              {carouselTotal > 1 && (
                <>
                  <button
                    onClick={carouselPrev}
                    aria-label="Anterior"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 transition-all duration-200"
                    style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 3L5 8L10 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    onClick={carouselNext}
                    aria-label="Siguiente"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 transition-all duration-200"
                    style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3L11 8L6 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </>
              )}

              {/* Dots */}
              {carouselTotal > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {carouselItems.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCarouselIdx(i)}
                      aria-label={`Slide ${i + 1}`}
                      className="transition-all duration-300"
                      style={{
                        width: i === carouselIdx ? 28 : 8,
                        height: 3,
                        background: i === carouselIdx ? '#ff5a1f' : 'rgba(255,255,255,0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Counter */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="text-[13px] font-medium text-white">{carouselIdx + 1}</span>
                <span className="text-[11px] text-[#555]">/</span>
                <span className="text-[11px] text-[#555]">{carouselTotal}</span>
              </div>
            </motion.div>
          ) : (
            /* Empty state — no projects uploaded yet */
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center py-24 text-center"
              style={{ border: '1px dashed rgba(255,255,255,0.08)', background: '#0d0d0e' }}
            >
              <div style={{ width: 56, height: 56, background: 'rgba(255,90,31,0.08)', border: '1px solid rgba(255,90,31,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <ArrowRight size={20} color="#ff5a1f" />
              </div>
              <p className="text-[11px] tracking-[0.25em] uppercase text-[#555] mb-3">Portafolio en construcción</p>
              <p className="text-[14px] text-[#333] max-w-xs leading-relaxed">
                Los proyectos aparecerán aquí una vez cargados desde el panel de administración.
              </p>
            </motion.div>
          )}
        </div>
      </section>
      {/* Contact */}
      <section id="contacto" className="py-16 border-t border-[rgba(255,255,255,0.06)] relative overflow-hidden"
        style={{ background: '#0A0A0B' }}>

        {/* Blob background — organic red glow inspired */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          {/* Top-right large blob */}
          <div style={{
            position: 'absolute', top: '-18%', right: '-12%',
            width: 560, height: 440,
            background: 'radial-gradient(ellipse at 40% 50%, #a10000 0%, #5a0000 45%, transparent 75%)',
            borderRadius: '62% 38% 55% 45% / 48% 60% 40% 52%',
            filter: 'blur(72px)',
            opacity: 0.22,
          }} />
          {/* Top-right accent blob (slightly offset) */}
          <div style={{
            position: 'absolute', top: '-8%', right: '5%',
            width: 280, height: 200,
            background: 'radial-gradient(ellipse at 50% 50%, #e8420a 0%, #8B0000 55%, transparent 80%)',
            borderRadius: '40% 60% 35% 65% / 55% 45% 60% 40%',
            filter: 'blur(55px)',
            opacity: 0.18,
          }} />
          {/* Bottom-left medium blob */}
          <div style={{
            position: 'absolute', bottom: '-10%', left: '-8%',
            width: 420, height: 320,
            background: 'radial-gradient(ellipse at 55% 45%, #990000 0%, #4a0000 50%, transparent 78%)',
            borderRadius: '55% 45% 40% 60% / 60% 40% 55% 45%',
            filter: 'blur(68px)',
            opacity: 0.2,
          }} />
          {/* Bottom-right small blob */}
          <div style={{
            position: 'absolute', bottom: '8%', right: '-4%',
            width: 200, height: 180,
            background: 'radial-gradient(ellipse at 50% 50%, #cc2200 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)',
            opacity: 0.15,
          }} />
          {/* Center floating small orb */}
          <div style={{
            position: 'absolute', top: '42%', left: '18%',
            width: 100, height: 100,
            background: 'radial-gradient(circle, #c01010 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(38px)',
            opacity: 0.12,
          }} />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[clamp(80px,10vw,140px)] font-display text-white mb-8 leading-none"
          >
            ¿Hablamos?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-10">
            <div className="flex flex-col gap-8">
              <div className="space-y-4">
                <a href="mailto:titus@titus.cl" className="block text-[18px] text-[#888] hover:text-white transition-colors">titus@titus.cl</a>
                <p className="text-[18px] text-[#888]">+56 9 9228 5863</p>
              </div>
              <p className="font-[Playfair_Display] italic text-[#666] text-[20px]">
                Diseñamos con intención, construimos con propósito.
              </p>
            </div>
            
            <form
              className="space-y-6"
              onSubmit={async e => {
                e.preventDefault();
                if (!contactForm.name || !contactForm.email || !contactForm.message) return;
                setFormStatus('idle');
                setIsSubmitting(true);
                try {
                  const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...contactForm }),
                  });
                  if (!res.ok) throw new Error();
                  setFormStatus('success');
                  setContactForm({ name: '', email: '', phone: '', message: '' });
                } catch {
                  setFormStatus('error');
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <input
                type="text"
                placeholder="Nombre"
                value={contactForm.name}
                onChange={e => setContactForm(f => ({ ...f, name: e.target.value }))}
                required
                data-testid="input-contact-name"
                className="w-full bg-transparent border-b border-[rgba(255,255,255,0.15)] py-4 text-white placeholder:text-[#333] focus:outline-none focus:border-[#ff5a1f] transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                value={contactForm.email}
                onChange={e => setContactForm(f => ({ ...f, email: e.target.value }))}
                required
                data-testid="input-contact-email"
                className="w-full bg-transparent border-b border-[rgba(255,255,255,0.15)] py-4 text-white placeholder:text-[#333] focus:outline-none focus:border-[#ff5a1f] transition-colors"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={contactForm.phone}
                onChange={e => setContactForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full bg-transparent border-b border-[rgba(255,255,255,0.15)] py-4 text-white placeholder:text-[#333] focus:outline-none focus:border-[#ff5a1f] transition-colors"
              />
              <textarea
                placeholder="Mensaje"
                rows={4}
                value={contactForm.message}
                onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                required
                data-testid="input-contact-message"
                className="w-full bg-transparent border-b border-[rgba(255,255,255,0.15)] py-4 text-white placeholder:text-[#333] focus:outline-none focus:border-[#ff5a1f] transition-colors resize-none"
              />

              {formStatus === 'success' && (
                <p className="text-[#ff5a1f] text-[13px] tracking-[0.1em] uppercase">
                  Mensaje enviado — te contactaremos pronto.
                </p>
              )}
              {formStatus === 'error' && (
                <p className="text-red-400 text-[13px] tracking-[0.1em] uppercase">
                  Error al enviar. Por favor intenta de nuevo.
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                data-testid="button-contact-submit"
                className="mt-8 border border-[#ff5a1f] text-[#ff5a1f] bg-transparent px-8 py-4 uppercase tracking-[0.2em] text-[12px] hover:bg-[#ff5a1f] hover:text-[#000] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer rounded-[8px]"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </div>
      </section>
      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/56992285863?text=Hola%2C+quiero+cotizar+un+proyecto"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Cotizar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-transform duration-200 hover:scale-110"
        style={{ background: '#25D366' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
      {/* Footer */}
      <footer className="pt-16 pb-8 bg-[#080808] border-t border-[rgba(255,255,255,0.05)]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {/* Col 1 — Logo + descripción */}
            <div>
              <a href="#" className="inline-flex items-center h-12 mb-4">
                <span className="font-display text-[22px] leading-none tracking-[0.06em] text-white">
                  TITUS<span className="text-[#ff5a1f]">·</span>DISEÑO
                </span>
              </a>
              <p className="text-[13px] text-[#444] leading-relaxed">Diseño y ejecución<br/>profesional en Santiago.</p>
            </div>
            
            {/* Col 2 — Navegación */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#444] mb-5">Navegación</p>
              <div className="flex flex-col gap-2">
                {['Inicio', 'Servicios', 'Portafolio', 'Nosotros', 'Contacto'].map(link => (
                  <a key={link} href={`#${link.toLowerCase()}`} className="text-[13px] text-[#666] hover:text-white transition-colors duration-200">
                    {link}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Col 3 — Contacto */}
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#444] mb-5">Contacto</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:titus@titus.cl" className="text-[13px] text-[#666] hover:text-white transition-colors duration-200">titus@titus.cl</a>
                <p className="text-[13px] text-[#666]">+56 9 9228 5863</p>
                <p className="text-[13px] text-[#666]">Santiago, Chile</p>
              </div>
            </div>
          </div>
          
          {/* Barra inferior */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[rgba(255,255,255,0.06)]">
            <p className="text-[11px] text-[#333] tracking-[0.05em]">© 2025 TITUS. Todos los derechos reservados.</p>
            <div className="flex gap-5">
              <a href="#" aria-label="Instagram" className="text-[#444] hover:text-white transition-colors duration-200"><SiInstagram size={16} /></a>
              <a href="#" aria-label="Behance" className="text-[#444] hover:text-white transition-colors duration-200"><SiBehance size={16} /></a>
              <a href="#" aria-label="LinkedIn" className="text-[#444] hover:text-white transition-colors duration-200"><FaLinkedin size={16} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
