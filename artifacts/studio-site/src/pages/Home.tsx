import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Quote, Printer, Layers, Wrench, Lightbulb } from 'lucide-react';
import { SiInstagram, SiBehance } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';
import { useSubmitContact } from '@workspace/api-client-react';

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
  const [quickForm, setQuickForm] = useState({ name: '', email: '', need: '', message: '' });
  const [quickStatus, setQuickStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const heroImgMainRef = useRef<HTMLImageElement>(null);
  const heroImgSecRef = useRef<HTMLImageElement>(null);
  const submitContact = useSubmitContact({
    mutation: {
      onSuccess: () => {
        setFormStatus('success');
        setContactForm({ name: '', email: '', message: '' });
      },
      onError: () => setFormStatus('error'),
    },
  });

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickForm.email) return;
    setQuickStatus('sending');
    try {
      await submitContact.mutateAsync({
        data: {
          name: quickForm.name || quickForm.email,
          email: quickForm.email,
          message: `¿Qué necesita?: ${quickForm.need || 'No indicado'}\n\n${quickForm.message}`,
        },
      });
      setQuickStatus('success');
      setQuickForm({ name: '', email: '', need: '', message: '' });
      setTimeout(() => setQuickStatus('idle'), 5000);
    } catch {
      setQuickStatus('error');
      setTimeout(() => setQuickStatus('idle'), 3000);
    }
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const heroTexts = ["MARCAS", "SEÑALES", "ESPACIOS"];
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("Todos");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [clientPage, setClientPage] = useState(0);

  const clientLogos = [
    { name: 'Clínica Las Condes',          url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782312468/LOGO_CLINICALASCONDES_acrgn2.jpg' },
    { name: 'U. Católica',                 url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782334912/Dise%C3%B1o_sin_t%C3%ADtulo_1_dbbnyk.png' },
    { name: 'U. de Los Andes',             url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782312469/LOGO_UANDES_hjz0cj.png' },
    { name: 'MetroGas',                    url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782312468/LOGO_METROGAS_pyslkf.webp' },
    { name: 'Escuela Militar',             url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782312468/LOGO_ESCUELAMILITAR_j5bboc.png' },
    { name: 'Consejo Defensa del Estado',  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782312468/LOGO_DEFENSAESTADO_x0jigg.png' },
    { name: 'UNAB',                        url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782312468/LOGO_UNAB_ka4q3u.png' },
    { name: 'Cliente 8',                   url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782335349/Dise%C3%B1o_sin_t%C3%ADtulo_5_avofzm.png' },
    { name: 'Cliente 9',                   url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782335287/Dise%C3%B1o_sin_t%C3%ADtulo_4_ownqr7.png' },
    { name: 'Cliente 10',                  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782335079/Dise%C3%B1o_sin_t%C3%ADtulo_3_sptoxl.png' },
    { name: 'Cliente 11',                  url: 'https://res.cloudinary.com/dnlpxcjpw/image/upload/v1782334975/Dise%C3%B1o_sin_t%C3%ADtulo_2_expudm.png' },
  ];
  const touchStartRef = useRef<number | null>(null);
  
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
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, [currentSlide]); // reset interval on manual slide change

  const services = [
    { icon: Printer,   slug: 'produccion-grafica',    title: "Producción Gráfica",      desc: "Desarrollo y ejecución de piezas gráficas en impresión digital de gran formato y gigantografía.",                                              accent: "#e8420a", bg: "#120a08" },
    { icon: Layers,    slug: 'produccion-industrial', title: "Producción Industrial",   desc: "Fabricación y construcción de elementos para exhibición, módulos, gabinetes y stand.",                                                         accent: "#3b82f6", bg: "#08101a" },
    { icon: Wrench,    slug: 'montaje-en-obra',       title: "Montaje en Obra",         desc: "Ejecutamos instalaciones en terreno, piezas gráficas y montaje de elementos volumétricos.",                                                     accent: "#22c55e", bg: "#08150a" },
    { icon: Lightbulb, slug: 'soluciones',            title: "Proponemos Soluciones",   desc: "Desarrollamos proyectos a partir de las ideas de nuestros clientes, proponiendo soluciones eficientes, modernas y prácticas.",               accent: "#a855f7", bg: "#120815" },
  ];

  const projects = [
    { title: "Clínica Las Condes",            category: "Señalética",  img: "https://picsum.photos/seed/clc1/800/600" },
    { title: "Clínica Estoril",               category: "Señalética",  img: "https://picsum.photos/seed/est2/800/600" },
    { title: "Universidad Central",           category: "Branding",    img: "https://picsum.photos/seed/uc3/800/600"  },
    { title: "Museo Nac. Historia Natural",   category: "Producción",  img: "https://picsum.photos/seed/mhn4/800/600" },
    { title: "Clínica Las Condes — Ambulancias", category: "Branding", img: "https://picsum.photos/seed/amb5/800/600" },
    { title: "Hospital Félix Bulnes",         category: "Señalética",  img: "https://picsum.photos/seed/hfb6/800/600" },
    { title: "Universidad Andrés Bello",      category: "Branding",    img: "https://picsum.photos/seed/uab7/800/600" },
    { title: "MetroGas",                      category: "Señalética",  img: "https://picsum.photos/seed/mg8/800/600"  },
    { title: "Escuela Militar",               category: "Señalética",  img: "https://picsum.photos/seed/em9/800/600"  },
  ];

  const filteredProjects = activeTab === "Todos" ? projects : projects.filter(p => p.category === activeTab);

  const carouselSlides = [
    { title: "Señalética Corporativa — Clínica Las Condes",       desc: "Sistema completo de señalética corporativa y general de direccionamiento.",                                              img: "https://picsum.photos/seed/car1/1200/700", category: "Señalética"  },
    { title: "Señalética Corporativa — Clínica Estoril",          desc: "Sistema completo de señalética corporativa y general de direccionamiento.",                                              img: "https://picsum.photos/seed/car2/1200/700", category: "Señalética"  },
    { title: "Branding Oficinas — Universidad Central",           desc: "Instalación de film empavonado en todos los recintos vidriados.",                                                       img: "https://picsum.photos/seed/car3/1200/700", category: "Branding"    },
    { title: "Módulos Exhibición — Museo Nac. Historia Natural",  desc: "Fabricación y montaje de módulos exhibidores.",                                                                         img: "https://picsum.photos/seed/car4/1200/700", category: "Producción"  },
    { title: "Branding Ambulancias — Clínica Las Condes",         desc: "Implementación de branding con rotulación de emergencia bajo norma y gráfica corporativa.",                           img: "https://picsum.photos/seed/car5/1200/700", category: "Branding"    },
  ];

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (touchStartRef.current === null) return;
    const diff = e.clientX - touchStartRef.current;
    if (diff > 50) {
      setCurrentSlide(prev => (prev === 0 ? carouselSlides.length - 1 : prev - 1));
    } else if (diff < -50) {
      setCurrentSlide(prev => (prev + 1) % carouselSlides.length);
    }
    touchStartRef.current = null;
  };

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
            <img
              src="https://res.cloudinary.com/dnlpxcjpw/image/upload/e_trim/v1781899403/Gemini_Generated_Image_g8lqswg8lqswg8lq-removebg-preview_1_al0af6.png"
              alt="TITUS"
              className="h-full w-auto object-contain"
            />
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
        {/* noise texture */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none z-0"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")" }}
        />
        {/* Orange radial glow behind headline */}
        <div className="absolute inset-0 pointer-events-none z-[1]"
          style={{ background: 'radial-gradient(ellipse 55% 50% at 30% 52%, rgba(232,66,10,0.12) 0%, transparent 65%)' }}
        />

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 min-h-[100vh] grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-8 relative z-10">

          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col justify-center gap-4 pt-20 pb-8 md:gap-6 md:pt-32 md:pb-12">

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
              style={{ fontSize: 17, color: '#a0a0a0', maxWidth: 480, lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}
            >
              Estudio de diseño gráfico, señalética y diseño industrial con más de 30 años desarrollando, produciendo e instalando identidad visual para nuestros clientes.
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

          {/* ── RIGHT COLUMN — 2×2 image grid ── */}
          <div className="hidden md:block relative pt-36 pb-8">
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '1fr 1fr',
              gap: 8,
              height: 480,
            }}>
              {[
                { seed: 'senaleg1',   label: 'PROD. GRÁFICA'    },
                { seed: 'branding2',  label: 'PROD. INDUSTRIAL'  },
                { seed: 'montaje3',   label: 'MONTAJE EN OBRA'   },
                { seed: 'produccion4',label: 'SOLUCIONES'        },
              ].map(({ seed, label }, idx) => (
                <div
                  key={seed}
                  className="overflow-hidden relative cursor-pointer group"
                  style={{ animation: `slideInRight 0.9s ease ${0.3 + idx * 0.15}s both` }}
                >
                  <img
                    src={`https://picsum.photos/seed/${seed}/400/300`}
                    alt={label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)' }}
                  />
                  {/* Corner bracket — top-left technical style */}
                  <div className="absolute top-0 left-0 z-10 pointer-events-none" style={{ width: 20, height: 20, borderTop: '2px solid #E8420A', borderLeft: '2px solid #E8420A' }} />
                  <span
                    className="absolute bottom-3 left-3 font-display text-[13px] uppercase"
                    style={{ color: '#e8420a', letterSpacing: '0.12em' }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
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
      {/* Clientes — Image Carousel */}
      {(() => {
        const perPage = 5;
        const totalPages = Math.ceil(clientLogos.length / perPage);
        const visibleLogos = clientLogos.slice(clientPage * perPage, clientPage * perPage + perPage);
        const canPrev = clientPage > 0;
        const canNext = clientPage < totalPages - 1;
        return (
          <section className="bg-[#0A0A0B] py-16 border-t border-[rgba(255,255,255,0.06)]">
            <div className="max-w-[1280px] mx-auto px-6 md:px-16">
              <p style={{ textAlign: 'center', fontSize: 11, letterSpacing: '0.3em', color: '#555', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', marginBottom: 40 }}>
                MARCAS QUE CONFÍAN EN NOSOTROS
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                  onClick={() => setClientPage(p => Math.max(0, p - 1))}
                  disabled={!canPrev}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.04)',
                    cursor: canPrev ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, opacity: canPrev ? 1 : 0.2,
                    transition: 'all 0.2s', padding: 0,
                  }}
                  aria-label="Anterior"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={clientPage}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.3 }}
                      style={{ display: 'flex', gap: 12, alignItems: 'center' }}
                    >
                      {visibleLogos.map((logo, i) => (
                        <div
                          key={i}
                          style={{
                            flex: '1 1 0',
                            background: 'white',
                            borderRadius: 10,
                            height: 180,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                            overflow: 'hidden',
                            border: '1px solid rgba(0,0,0,0.08)',
                          }}
                        >
                          <img
                            src={logo.url}
                            alt={logo.name}
                            style={{
                              width: '88%',
                              height: '82%',
                              objectFit: 'contain',
                              display: 'block',
                            }}
                          />
                        </div>
                      ))}
                      {visibleLogos.length < perPage && Array.from({ length: perPage - visibleLogos.length }).map((_, i) => (
                        <div key={`empty-${i}`} style={{ flex: '1 1 0', height: 160 }} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => setClientPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={!canNext}
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.15)',
                    background: 'rgba(255,255,255,0.04)',
                    cursor: canNext ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, opacity: canNext ? 1 : 0.2,
                    transition: 'all 0.2s', padding: 0,
                  }}
                  aria-label="Siguiente"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setClientPage(i)}
                    style={{
                      width: i === clientPage ? 24 : 8, height: 8,
                      borderRadius: 4, border: 'none', cursor: 'pointer',
                      background: i === clientPage ? '#e8420a' : 'rgba(255,255,255,0.18)',
                      transition: 'all 0.25s', padding: 0,
                    }}
                    aria-label={`Página ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })()}
      {/* Projects Carousel */}
      <section className="overflow-x-hidden relative w-full bg-[#0a0a0a]">
        <div className="flex flex-col md:flex-row h-auto md:h-[90vh]">
          {/* Left: Image */}
          <div 
            className="w-full md:w-[65%] h-[50vh] md:h-full relative overflow-hidden"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={currentSlide}
                src={carouselSlides[currentSlide].img}
                alt={carouselSlides[currentSlide].title}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
              />
            </AnimatePresence>
            <div className="absolute inset-0 hidden md:block bg-[linear-gradient(to_right,transparent_60%,#0a0a0a)] pointer-events-none" />
          </div>
          
          {/* Right: Text Panel */}
          <div className="w-full md:w-[35%] bg-[#0a0a0a] flex flex-col justify-center px-6 py-12 md:px-12 md:py-16 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-[11px] tracking-[0.25em] text-[#444] mb-6">
                  0{currentSlide + 1} / 0{carouselSlides.length}
                </div>
                <div className="border border-[#ff5a1f] text-[#ff5a1f] text-[10px] tracking-[0.2em] px-3 py-1 inline-block mb-8 uppercase">
                  {carouselSlides[currentSlide].category}
                </div>
                <h3 className="font-display text-[40px] md:text-[56px] text-white mb-4 leading-[1.1]">
                  {carouselSlides[currentSlide].title}
                </h3>
                <p className="text-[15px] text-[#888] leading-[1.7] mb-10 font-light">
                  {carouselSlides[currentSlide].desc}
                </p>
                <a href="#" className="text-[13px] text-[#ff5a1f] tracking-[0.1em] hover:underline transition-all">
                  Ver proyecto →
                </a>
              </motion.div>
            </AnimatePresence>
            
            {/* Nav */}
            <div className="mt-16 flex items-center justify-between">
              <div className="flex gap-4">
                <button 
                  onClick={() => setCurrentSlide(prev => (prev === 0 ? carouselSlides.length - 1 : prev - 1))}
                  className="w-[44px] h-[44px] rounded-full border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-white hover:border-white transition-colors"
                >
                  <ArrowRight className="rotate-180" size={18} />
                </button>
                <button 
                  onClick={() => setCurrentSlide(prev => (prev + 1) % carouselSlides.length)}
                  className="w-[44px] h-[44px] rounded-full border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-white hover:border-white transition-colors"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
              <div className="flex gap-2">
                {carouselSlides.map((_, idx) => (
                  <div key={idx} className="w-[40px] h-[1px] bg-[rgba(255,255,255,0.2)] overflow-hidden">
                    {idx === currentSlide && (
                      <div className="h-full bg-[#ff5a1f]" style={{ animation: 'progress-dot 4s linear forwards' }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Sección Cotizar / Conversemos */}
      <section id="cotizar" className="py-14 relative overflow-hidden" style={{ background: '#0d0d0d' }}>
        {/* faint radial glow behind form */}
        <div className="absolute right-0 top-0 w-[600px] h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(255,90,31,0.06) 0%, transparent 70%)' }} />

        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-12 items-center relative z-10">

          {/* Left */}
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase mb-4" style={{ color: '#ff5a1f' }}>— Conversemos</p>
            <h2 className="font-display text-[clamp(34px,3.8vw,52px)] text-white leading-none mb-5">
              ¿Tienes un proyecto<br />en mente?
            </h2>
            <p className="text-[#666] text-[14px] leading-relaxed mb-8 max-w-xs">
              Cuéntanos qué necesitas.<br />Respondemos en menos de 24 horas.
            </p>
            <div className="flex flex-col gap-3">
              <a href="mailto:titus@titus.cl" style={{ color: '#ff5a1f' }} className="text-[13px] tracking-wide hover:opacity-70 transition-opacity">
                titus@titus.cl
              </a>
              <span className="text-[13px] text-[#555]">+56 9 9228 5863</span>
              <span className="text-[13px] text-[#555]">Vargas Fontecilla 4550, Quinta Normal, Santiago</span>
            </div>
          </div>

          {/* Right — card form */}
          <div
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#141416',
              backdropFilter: 'blur(4px)',
              position: 'relative',
              borderRadius: 12,
            }}
          >
            <div className="p-8">
              {quickStatus === 'success' ? (
                <div className="py-6 text-center">
                  <p className="text-white text-[20px] font-display tracking-wide mb-2">¡Mensaje enviado!</p>
                  <p className="text-[#666] text-[13px]">Te contactaremos muy pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    { label: 'Nombre', key: 'name', type: 'text', placeholder: 'Tu nombre' },
                    { label: 'Email', key: 'email', type: 'email', placeholder: 'tu@correo.cl', required: true },
                    { label: '¿Qué necesitas?', key: 'need', type: 'text', placeholder: 'Ej: Señalética, diseño de logo...' },
                  ].map(({ label, key, type, placeholder, required }) => (
                    <div key={key}>
                      <label className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: '#888' }}>{label}</label>
                      <input
                        type={type}
                        required={required}
                        placeholder={placeholder}
                        value={quickForm[key as keyof typeof quickForm]}
                        onChange={e => setQuickForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full pb-2 text-white text-[14px] outline-none transition-colors duration-300"
                        style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.12)', color: '#fff' }}
                        onFocus={e => (e.currentTarget.style.borderBottomColor = '#ff5a1f')}
                        onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.12)')}
                      />
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: '#888' }}>
                      Mensaje <span className="normal-case tracking-normal text-[#444]">(opcional)</span>
                    </label>
                    <textarea
                      placeholder="Cuéntanos más detalles..."
                      value={quickForm.message}
                      onChange={e => setQuickForm(f => ({ ...f, message: e.target.value }))}
                      rows={2}
                      className="w-full pb-2 text-white text-[14px] outline-none resize-none transition-colors duration-300"
                      style={{ background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.12)' }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = '#ff5a1f')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.12)')}
                    />
                  </div>

                  {quickStatus === 'error' && (
                    <p className="sm:col-span-2 text-red-400 text-[11px] tracking-wide -mt-2">Error al enviar. Intenta de nuevo.</p>
                  )}

                  <div className="sm:col-span-2 flex items-center gap-4 mt-2">
                    <button
                      type="submit"
                      disabled={quickStatus === 'sending'}
                      className="px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-40"
                      style={{ background: '#ff5a1f', color: '#000', borderRadius: 0 }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#e04800'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(4px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#ff5a1f'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateX(0)'; }}
                    >
                      {quickStatus === 'sending' ? 'Enviando…' : 'Enviar mensaje →'}
                    </button>
                    <span className="text-[11px] text-[#444] tracking-wide">Sin compromiso</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* About */}
      <section id="nosotros" className="py-16 bg-[#0A0A0B]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid md:grid-cols-[40%_60%] gap-10 items-center">
          <div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] text-[#ff5a1f] tracking-[0.2em] uppercase mb-6"
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
              {"Donde la creatividad\nencontró\nla estrategia."}
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
              className="text-[16px] font-light leading-[1.8] text-[#888] mb-6"
            >
              Somos un equipo apasionado por el diseño estratégico. Combinamos creatividad y funcionalidad para construir marcas sólidas y sistemas de señalética que guían, informan y conectan a las personas con los espacios y las marcas.
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
              <img 
                src="https://picsum.photos/seed/studiokm/1000/1200" 
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
      {/* Portfolio Grid */}
      <section id="portafolio" className="py-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[72px] font-display mb-4"
          >
            Nuestro Trabajo
          </motion.h2>
          
          <div className="flex flex-wrap gap-6 mb-8">
            {['Todos', 'Señalética', 'Branding', 'Producción'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[13px] tracking-[0.1em] uppercase transition-colors relative py-1 ${activeTab === tab ? 'text-white' : 'text-[#888] hover:text-white'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-[1px] bg-[#ff5a1f]" />
                )}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-1">
            <AnimatePresence>
              {filteredProjects.map((p, i) => {
                // Layout logic for editorial feel
                let gridClass = "col-span-1 aspect-[4/3]";
                if (i === 0 || i === 3) gridClass = "md:col-span-2 aspect-[16/9]";
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    key={p.title}
                    className={`group relative overflow-hidden cursor-pointer ${gridClass}`}
                  >
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8)_0%,transparent_50%)]" />
                    {/* Hover border overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
                      style={{ border: '1px solid rgba(47,111,232,0.4)' }}
                    />
                    
                    <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end transform transition-transform duration-400 group-hover:-translate-y-[6px]">
                      <div>
                        <p className="text-[#ff5a1f] uppercase tracking-[0.2em] text-[10px] mb-2">{p.category}</p>
                        <h3 className="text-[22px] font-display text-white">{p.title}</h3>
                      </div>
                      <ArrowRight className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-400" size={20} />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-16 bg-[#141416]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[72px] font-display mb-10 text-center"
          >
            Voces
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { q: "TITUS transformó completamente nuestra señalética. El rigor en cada detalle es notable.", n: "Carlos Mendez", r: "Gerente de Operaciones, Hotel Bellavista" },
              { q: "Profesionales, creativos y con una atención al detalle impecable. Entendieron nuestra marca desde el día uno.", n: "María González", r: "Directora de Marketing, Clínica Las Condes" },
              { q: "Nuestra identidad de marca nunca había sido tan coherente y poderosa. Un trabajo de nivel mundial.", n: "Pedro Soto", r: "CEO, Viña Montes" }
            ].map((t, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                key={i}
                className="px-8 py-8 rounded-[8px]"
                style={{ background: '#0A0A0B', borderTop: '2px solid #E8420A' }}
              >
                <div className="font-[Playfair_Display] italic text-[80px] leading-[1] text-[#ff5a1f]/30 mb-4">"</div>
                <p className="text-[17px] font-light leading-[1.8] text-[#ddd] mb-8">
                  {t.q}
                </p>
                <div>
                  <p className="font-medium text-[13px] text-white">{t.n}</p>
                  <p className="text-[#555] text-[12px] tracking-[0.1em] uppercase mt-1">{t.r}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Contact */}
      <section id="contacto" className="py-16 border-t border-[rgba(255,255,255,0.06)]"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 85% 15%, rgba(232,66,10,0.08) 0%, #0A0A0B 60%)' }}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
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
              onSubmit={e => {
                e.preventDefault();
                if (!contactForm.name || !contactForm.email || !contactForm.message) return;
                setFormStatus('idle');
                submitContact.mutate({ data: contactForm });
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
                disabled={submitContact.isPending}
                data-testid="button-contact-submit"
                className="mt-8 border border-[#ff5a1f] text-[#ff5a1f] bg-transparent px-8 py-4 uppercase tracking-[0.2em] text-[12px] hover:bg-[#ff5a1f] hover:text-[#000] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer rounded-[8px]"
              >
                {submitContact.isPending ? 'Enviando...' : 'Enviar Mensaje'}
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
                <img
                  src="https://res.cloudinary.com/dnlpxcjpw/image/upload/e_trim/v1781899403/Gemini_Generated_Image_g8lqswg8lqswg8lq-removebg-preview_1_al0af6.png"
                  alt="TITUS"
                  className="h-full w-auto object-contain"
                />
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
