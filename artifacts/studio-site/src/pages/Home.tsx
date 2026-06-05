import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Quote } from 'lucide-react';
import { SiInstagram, SiBehance } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';

interface Spark {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  angle: number;
  distance: number;
}

const SPARK_COLORS = ['#ff5a1f', '#ff7a3d', '#ff9f6b', '#ffbfa0', '#ffffff', '#ff3a00', '#ffcc99'];

const Cursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [sparks, setSparks] = useState<Spark[]>([]);
  const sparkIdRef = useRef(0);
  const lastSparkTime = useRef(0);

  const addSparks = useCallback((x: number, y: number) => {
    const now = Date.now();
    if (now - lastSparkTime.current < 40) return;
    lastSparkTime.current = now;

    const count = Math.floor(Math.random() * 3) + 2;
    const newSparks: Spark[] = Array.from({ length: count }, () => ({
      id: sparkIdRef.current++,
      x,
      y,
      size: Math.random() * 5 + 2,
      color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
      angle: Math.random() * 360,
      distance: Math.random() * 28 + 8,
    }));

    setSparks(prev => [...prev.slice(-30), ...newSparks]);
    setTimeout(() => {
      setSparks(prev => prev.filter(s => !newSparks.find(n => n.id === s.id)));
    }, 600);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      addSparks(e.clientX, e.clientY);
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [addSparks]);

  return (
    <>
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ left: `${position.x}px`, top: `${position.y}px`, transform: 'translate(-50%, -50%)' }}
      >
        <div className="w-3 h-3 rounded-full border border-white/60 bg-white/20 backdrop-blur-sm" />
      </div>
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="fixed pointer-events-none z-[9998]"
          style={{
            left: `${spark.x}px`,
            top: `${spark.y}px`,
            transform: `translate(-50%, -50%) rotate(${spark.angle}deg)`,
            animation: 'sparkle-out 0.6s ease-out forwards',
          }}
        >
          <div
            style={{
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              borderRadius: spark.size > 5 ? '50%' : '1px',
              background: spark.color,
              boxShadow: `0 0 ${spark.size * 2}px ${spark.color}`,
              transform: `translateY(-${spark.distance}px)`,
              opacity: 0.9,
            }}
          />
        </div>
      ))}
      <style>{`
        @keyframes sparkle-out {
          0%   { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(var(--r, 0deg)); }
          60%  { opacity: 0.6; }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.2) rotate(var(--r, 0deg)); }
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const heroTexts = ["MARCAS", "SEÑALES", "IDENTIDADES"];
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("Todos");
  const [currentSlide, setCurrentSlide] = useState(0);
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
    { num: "01", title: "Diseño de Marca e Identidad", img: "https://picsum.photos/seed/200/1200/800" },
    { num: "02", title: "Señalética y Wayfinding", img: "https://picsum.photos/seed/300/1200/800" },
    { num: "03", title: "Diseño Editorial y Print", img: "https://picsum.photos/seed/400/1200/800" },
    { num: "04", title: "Motion & Digital Design", img: "https://picsum.photos/seed/500/1200/800" }
  ];

  const projects = [
    { title: "Hotel Bellavista", category: "Señalética", img: "https://picsum.photos/seed/10/800/600" },
    { title: "Clínica Las Condes", category: "Branding", img: "https://picsum.photos/seed/11/800/600" },
    { title: "Revista Diseño Chile", category: "Editorial", img: "https://picsum.photos/seed/12/800/600" },
    { title: "Mall Plaza Oeste", category: "Señalética", img: "https://picsum.photos/seed/13/800/600" },
    { title: "Viña Montes", category: "Branding", img: "https://picsum.photos/seed/14/800/600" },
    { title: "Metro Santiago", category: "Señalética", img: "https://picsum.photos/seed/15/800/600" },
    { title: "Banco Estado", category: "Branding", img: "https://picsum.photos/seed/16/800/600" },
    { title: "Anuario Arquitectura", category: "Editorial", img: "https://picsum.photos/seed/17/800/600" },
    { title: "Parque Arauco", category: "Señalética", img: "https://picsum.photos/seed/18/800/600" }
  ];

  const filteredProjects = activeTab === "Todos" ? projects : projects.filter(p => p.category === activeTab);

  const carouselSlides = [
    { title: "Señalética Corporativa — Hotel Bellavista", desc: "Sistema completo de wayfinding para hotel 5 estrellas.", img: "https://picsum.photos/seed/1/1200/700", category: "Señalética" },
    { title: "Identidad Visual — Clínica Las Condes", desc: "Rediseño de marca para cadena médica líder.", img: "https://picsum.photos/seed/2/1200/700", category: "Branding" },
    { title: "Señalética Retail — Mall Plaza Oeste", desc: "600 piezas señaléticas en 3 niveles.", img: "https://picsum.photos/seed/3/1200/700", category: "Señalética" },
    { title: "Branding — Viña Montes", desc: "Sistema de identidad para exportación internacional.", img: "https://picsum.photos/seed/4/1200/700", category: "Branding" },
    { title: "Editorial — Revista Diseño Chile", desc: "Diseño editorial para publicación de arquitectura.", img: "https://picsum.photos/seed/5/1200/700", category: "Editorial" }
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
            ? 'bg-[rgba(10,10,10,0.88)] backdrop-blur-[24px] border-b border-[rgba(255,255,255,0.05)] py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" className="font-display text-[22px] tracking-wider text-white flex items-center">
            STUDIO<span style={{ color: '#ff5a1f' }}>·KM</span>
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
      <section id="inicio" className="h-[100vh] flex items-center justify-center relative overflow-hidden bg-[#0a0a0a]">
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none z-0"
          style={{ 
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")"
          }} 
        />
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0, duration: 0.8, ease: "easeOut" }}
            className="h-[2px] bg-[#ff5a1f] mx-auto mb-8"
          />
          <motion.p 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[#ff5a1f] tracking-[0.3em] text-[11px] uppercase mb-8"
          >
            Diseño que comunica.
          </motion.p>
          <div className="h-[clamp(60px,10vw,140px)] overflow-hidden mb-6 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={heroTextIndex}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-display text-[clamp(60px,10vw,140px)] text-white leading-none tracking-wide"
              >
                {heroTexts[heroTextIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-[#888] text-[16px] font-light max-w-xl mx-auto mb-16"
          >
            Estudio de diseño gráfico y señalética en Santiago, Chile
          </motion.p>
          <motion.a 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            href="#portafolio"
            className="inline-block border border-[#ff5a1f] text-[#ff5a1f] bg-transparent hover:bg-[#ff5a1f] hover:text-black transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] px-10 py-4 uppercase tracking-[0.2em] text-[13px]"
          >
            Ver Proyectos
          </motion.a>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <span className="text-[10px] text-[#444] tracking-[0.2em] [writing-mode:vertical-rl] uppercase">SCROLL</span>
          <div className="h-[40px] w-[1px] bg-[rgba(255,255,255,0.1)] relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-full h-1/2 bg-[#444]"
              style={{ animation: 'scroll-line 1.5s infinite' }}
            />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-[#111111] py-5 overflow-hidden flex whitespace-nowrap border-y border-[rgba(255,255,255,0.03)]">
        <div 
          className="flex gap-0 text-[13px] uppercase tracking-[0.15em] text-[#555]"
          style={{ animation: 'marquee-scroll 20s linear infinite', width: 'max-content' }}
        >
          {Array(2).fill("MARRIOTT — ADOBE — FALABELLA — PLAZA OESTE — ENTEL — LATAM — COPEC — SODIMAC — ").map((text, i) => (
            <span key={i} className="pr-4">{text}</span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section id="servicios" className="py-32 relative">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7 }}
            className="text-[72px] font-display mb-16"
          >
            Nuestros Servicios
          </motion.h2>
          
          <div className="flex flex-col border-t border-[rgba(255,255,255,0.06)]">
            {services.map((srv, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={idx}
                className="group relative border-b border-[rgba(255,255,255,0.06)] py-8 cursor-pointer overflow-hidden grid grid-cols-[60px_1fr_auto] md:grid-cols-[100px_1fr_auto] items-center"
                onMouseEnter={() => setHoveredService(idx)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <AnimatePresence>
                  {hoveredService === idx && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.12 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 z-[-1]"
                    >
                      <img src={srv.img} alt={srv.title} className="w-full h-full object-cover" />
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <span className="text-[12px] text-[#444] group-hover:text-[#ff5a1f] transition-colors duration-400 font-medium">
                  {srv.num}
                </span>
                <h3 className="text-[32px] md:text-[52px] font-display text-white transform group-hover:translate-x-2 transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                  {srv.title}
                </h3>
                <ArrowRight 
                  className="text-[#444] group-hover:text-white transform group-hover:-rotate-45 transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" 
                  size={32} 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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

      {/* About */}
      <section id="nosotros" className="py-32">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid md:grid-cols-[40%_60%] gap-16 items-center">
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
              className="text-[16px] font-light leading-[1.8] text-[#888] mb-12"
            >
              En Studio KM transformamos ideas en sistemas visuales que trascienden. Nos especializamos en diseño editorial, branding y señalética para marcas que buscan dejar huella. Nuestro enfoque es preciso, audaz y rigurosamente elaborado.
            </motion.p>
            <div className="flex gap-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <p className="font-display text-[90px] text-[#ff5a1f] leading-[1]">80+</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#555] mt-1">Proyectos</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <p className="font-display text-[90px] text-[#ff5a1f] leading-[1]">12+</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#555] mt-1">Años</p>
              </motion.div>
            </div>
          </div>
          
          <div className="relative pb-5 pr-5 mt-10 md:mt-0">
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative z-10 overflow-hidden w-full h-[600px] shadow-[20px_20px_0_#ff5a1f]"
            >
              <img 
                src="https://picsum.photos/seed/studiokm/1000/1200" 
                alt="Studio KM" 
                className="w-full h-full object-cover grayscale-[20%] contrast-110 hover:grayscale-0 transition-all duration-700" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portafolio" className="py-32">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[72px] font-display mb-4"
          >
            Nuestro Trabajo
          </motion.h2>
          
          <div className="flex flex-wrap gap-8 mb-12">
            {['Todos', 'Señalética', 'Branding', 'Editorial'].map(tab => (
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
                    <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-600 ease-out group-hover:scale-105" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8)_0%,transparent_50%)]" />
                    
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
      <section className="py-32 bg-[#0d0d0d]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[72px] font-display mb-16 text-center"
          >
            Voces
          </motion.h2>
          
          <div className="grid md:grid-cols-3">
            {[
              { q: "El equipo de Studio KM transformó completamente nuestra señalética. El rigor en cada detalle es notable.", n: "Carlos Mendez", r: "Gerente de Operaciones, Hotel Bellavista" },
              { q: "Profesionales, creativos y con una atención al detalle impecable. Entendieron nuestra marca desde el día uno.", n: "María González", r: "Directora de Marketing, Clínica Las Condes" },
              { q: "Nuestra identidad de marca nunca había sido tan coherente y poderosa. Un trabajo de nivel mundial.", n: "Pedro Soto", r: "CEO, Viña Montes" }
            ].map((t, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                key={i} 
                className={`px-8 py-8 md:py-0 ${i !== 0 ? 'md:border-l border-[rgba(255,255,255,0.06)]' : ''}`}
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
      <section id="contacto" className="py-32 bg-[#0a0a0a] border-t border-[rgba(255,255,255,0.06)]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[clamp(80px,10vw,140px)] font-display text-white mb-16 leading-none"
          >
            ¿Hablamos?
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-16">
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                <a href="mailto:hola@studiokm.cl" className="block text-[18px] text-[#888] hover:text-white transition-colors">hola@studiokm.cl</a>
                <p className="text-[18px] text-[#888]">+56 2 2345 6789</p>
              </div>
              <p className="font-[Playfair_Display] italic text-[#666] text-[20px] mt-16 md:mt-0">
                Diseñamos con intención, construimos con propósito.
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={e => e.preventDefault()}>
              <input 
                type="text" 
                placeholder="Nombre" 
                className="w-full bg-transparent border-b border-[rgba(255,255,255,0.15)] py-4 text-white placeholder:text-[#333] focus:outline-none focus:border-[#ff5a1f] transition-colors" 
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full bg-transparent border-b border-[rgba(255,255,255,0.15)] py-4 text-white placeholder:text-[#333] focus:outline-none focus:border-[#ff5a1f] transition-colors" 
              />
              <textarea 
                placeholder="Mensaje" 
                rows={4} 
                className="w-full bg-transparent border-b border-[rgba(255,255,255,0.15)] py-4 text-white placeholder:text-[#333] focus:outline-none focus:border-[#ff5a1f] transition-colors resize-none" 
              />
              <button className="mt-8 border border-[#ff5a1f] text-[#ff5a1f] bg-transparent px-8 py-4 uppercase tracking-[0.2em] text-[12px] hover:bg-[#ff5a1f] hover:text-[#000] transition-colors duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 bg-[#080808] border-t border-[rgba(255,255,255,0.05)]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-16 mb-16">
            <div>
              <a href="#" className="font-display text-[28px] tracking-wider text-white">
                STUDIO<span style={{ color: '#ff5a1f' }}>·KM</span>
              </a>
              <p className="text-[13px] text-[#444] mt-3">Creatividad con propósito.</p>
            </div>
            
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#444] mb-4">Navegación</p>
              <div className="flex flex-col gap-1">
                {['Inicio', 'Servicios', 'Portafolio', 'Nosotros', 'Contacto'].map(link => (
                  <a key={link} href={`#${link.toLowerCase()}`} className="text-[13px] text-[#666] hover:text-white transition-colors py-1">
                    {link}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#444] mb-4">Contacto</p>
              <div className="flex flex-col gap-1">
                <a href="mailto:hola@studiokm.cl" className="text-[13px] text-[#666] hover:text-white transition-colors py-1">hola@studiokm.cl</a>
                <p className="text-[13px] text-[#666] py-1">+56 2 2345 6789</p>
                <p className="text-[13px] text-[#666] py-1">Santiago, Chile</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-8 border-t border-[rgba(255,255,255,0.04)]">
            <p className="text-[11px] text-[#333]">© 2025 Studio KM. Todos los derechos reservados.</p>
            <div className="flex gap-4">
              <a href="#" className="text-[#444] hover:text-white transition-colors"><SiInstagram size={18} /></a>
              <a href="#" className="text-[#444] hover:text-white transition-colors"><SiBehance size={18} /></a>
              <a href="#" className="text-[#444] hover:text-white transition-colors"><FaLinkedin size={18} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
