import React, { useState, useEffect, useRef, useCallback } from 'react';
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
      `}</style>
    </>
  );
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const heroTexts = ["MARCAS", "SEÑALES", "IDENTIDADES"];
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("Todos");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
  }, []);

  const services = [
    { num: "01", title: "Diseño de Marca e Identidad", img: "https://picsum.photos/seed/200/800/600" },
    { num: "02", title: "Señalética y Wayfinding", img: "https://picsum.photos/seed/300/800/600" },
    { num: "03", title: "Diseño Editorial y Print", img: "https://picsum.photos/seed/400/800/600" },
    { num: "04", title: "Motion & Digital Design", img: "https://picsum.photos/seed/500/800/600" }
  ];

  const projects = [
    { title: "Hotel Bellavista", category: "Señalética", img: "https://picsum.photos/seed/10/600/400" },
    { title: "Clínica Las Condes", category: "Branding", img: "https://picsum.photos/seed/11/600/400" },
    { title: "Revista Diseño Chile", category: "Editorial", img: "https://picsum.photos/seed/12/600/400" },
    { title: "Mall Plaza Oeste", category: "Señalética", img: "https://picsum.photos/seed/13/600/400" },
    { title: "Viña Montes", category: "Branding", img: "https://picsum.photos/seed/14/600/400" },
    { title: "Metro Santiago", category: "Señalética", img: "https://picsum.photos/seed/15/600/400" },
    { title: "Banco Estado", category: "Branding", img: "https://picsum.photos/seed/16/600/400" },
    { title: "Anuario Arquitectura", category: "Editorial", img: "https://picsum.photos/seed/17/600/400" },
    { title: "Parque Arauco", category: "Señalética", img: "https://picsum.photos/seed/18/600/400" }
  ];

  const filteredProjects = activeTab === "Todos" ? projects : projects.filter(p => p.category === activeTab);

  const carouselSlides = [
    { title: "Señalética Corporativa — Hotel Bellavista", desc: "Sistema completo de wayfinding para hotel 5 estrellas en Santiago.", img: "https://picsum.photos/seed/1/1200/700" },
    { title: "Identidad Visual — Clínica Las Condes", desc: "Rediseño de marca para cadena médica líder.", img: "https://picsum.photos/seed/2/1200/700" },
    { title: "Señalética Retail — Mall Plaza Oeste", desc: "600 piezas señaléticas instaladas en 3 niveles.", img: "https://picsum.photos/seed/3/1200/700" },
    { title: "Branding — Viña Montes", desc: "Sistema de identidad para exportación internacional.", img: "https://picsum.photos/seed/4/1200/700" },
    { title: "Editorial — Revista Diseño Chile", desc: "Diseño editorial para publicación de arquitectura.", img: "https://picsum.photos/seed/5/1200/700" }
  ];

  return (
    <div className="bg-background text-foreground min-h-screen font-sans selection:bg-primary selection:text-black">
      <Cursor />
      
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="font-display text-2xl tracking-widest font-bold">STUDIO KM</a>
          
          <div className="hidden md:flex gap-8 text-sm uppercase tracking-wider text-muted-foreground font-medium">
            {['Inicio', 'Servicios', 'Portafolio', 'Nosotros', 'Contacto'].map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-primary transition-colors">{link}</a>
            ))}
          </div>

          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8"
          >
            {['Inicio', 'Servicios', 'Portafolio', 'Nosotros', 'Contacto'].map(link => (
              <a 
                key={link} 
                href={`#${link.toLowerCase()}`} 
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-display text-4xl hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="inicio" className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/50 via-background to-background z-0" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary tracking-[0.3em] text-sm md:text-base uppercase mb-6"
          >
            Diseño que comunica.
          </motion.p>
          <div className="h-24 md:h-40 overflow-hidden mb-4">
            <AnimatePresence mode="wait">
              <motion.h1
                key={heroTextIndex}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="font-display text-[4rem] md:text-[8rem] leading-none"
              >
                {heroTexts[heroTextIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-12"
          >
            Estudio de diseño gráfico y señalética en Santiago, Chile
          </motion.p>
          <motion.a 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            href="#portafolio"
            className="inline-block border border-primary text-primary px-8 py-4 uppercase tracking-widest text-sm hover:bg-primary hover:text-black transition-all duration-300"
          >
            Ver Proyectos
          </motion.a>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-secondary py-4 overflow-hidden flex whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1035] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 10 }}
          className="flex gap-4 font-display text-2xl tracking-widest text-muted-foreground"
        >
          {Array(4).fill("MARRIOTT ★ ADOBE ★ FALABELLA ★ PLAZA OESTE ★ ENTEL ★ LATAM ★ COPEC ★ SODIMAC ★ ").map((text, i) => (
            <span key={i}>{text}</span>
          ))}
        </motion.div>
      </div>

      {/* Services */}
      <section id="servicios" className="py-32 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl mb-16">Nuestros Servicios</h2>
          <div className="border-t border-border">
            {services.map((srv, idx) => (
              <div 
                key={idx}
                className="group relative border-b border-border py-8 md:py-12 px-4 transition-colors duration-500 hover:bg-primary hover:text-black cursor-pointer overflow-hidden flex items-center justify-between"
                onMouseEnter={() => setHoveredService(idx)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="flex items-center gap-8 md:gap-16 relative z-10">
                  <span className="font-display text-2xl opacity-50 group-hover:opacity-100">{srv.num}</span>
                  <h3 className="text-2xl md:text-5xl font-display">{srv.title}</h3>
                </div>
                <ArrowRight className="opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all z-10" size={32} />
                
                <AnimatePresence>
                  {hoveredService === idx && (
                    <motion.div 
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="absolute right-0 top-0 bottom-0 w-1/3 hidden md:block"
                    >
                      <img src={srv.img} alt={srv.title} className="w-full h-full object-cover" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Carousel */}
      <section className="py-32 bg-secondary/30">
        <div className="container mx-auto px-6 mb-12">
          <h2 className="text-4xl md:text-6xl">Proyectos Destacados</h2>
        </div>
        <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <img src={carouselSlides[currentSlide].img} className="w-full h-full object-cover opacity-60" alt={carouselSlides[currentSlide].title} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent flex items-end">
                <div className="container mx-auto px-6 pb-16 md:pb-24">
                  <h3 className="text-3xl md:text-5xl font-display mb-4">{carouselSlides[currentSlide].title}</h3>
                  <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">{carouselSlides[currentSlide].desc}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-8 right-8 flex gap-2">
            {carouselSlides.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-primary scale-125' : 'bg-muted-foreground/50 hover:bg-muted-foreground'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="nosotros" className="py-32">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-primary tracking-widest text-sm uppercase mb-6">Sobre Nosotros</p>
            <h2 className="text-4xl md:text-6xl mb-8 leading-tight">Donde la creatividad encuentra la estrategia.</h2>
            <p className="text-muted-foreground text-lg mb-12 leading-relaxed">
              En Studio KM transformamos ideas en sistemas visuales que trascienden. Nos especializamos en diseño editorial, branding y señalética para marcas que buscan dejar huella. Nuestro enfoque es preciso, audaz y rigurosamente elaborado.
            </p>
            <div className="flex gap-16 border-t border-border pt-8">
              <div>
                <p className="font-display text-6xl text-primary">80+</p>
                <p className="text-muted-foreground uppercase tracking-widest text-xs mt-2">Proyectos</p>
              </div>
              <div>
                <p className="font-display text-6xl text-primary">12+</p>
                <p className="text-muted-foreground uppercase tracking-widest text-xs mt-2">Años</p>
              </div>
            </div>
          </div>
          <div className="relative h-[600px]">
            <img src="https://picsum.photos/seed/studio/600/800" alt="Studio KM Workspace" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-primary mix-blend-overlay opacity-20" />
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portafolio" className="py-32 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <h2 className="text-4xl md:text-6xl">Nuestro Trabajo</h2>
            <div className="flex flex-wrap gap-4">
              {['Todos', 'Señalética', 'Branding', 'Editorial'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 border uppercase tracking-wider text-sm transition-all ${activeTab === tab ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredProjects.map((p, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={p.title}
                  className="group relative aspect-[4/3] overflow-hidden bg-secondary cursor-pointer"
                >
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100 grayscale group-hover:grayscale-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-primary uppercase tracking-widest text-xs mb-2">{p.category}</p>
                    <h3 className="text-2xl font-display">{p.title}</h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl mb-16 text-center">Lo que dicen nuestros clientes</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { q: "El equipo de Studio KM transformó completamente nuestra señalética.", n: "Carlos Mendez", r: "Gerente de Operaciones, Hotel Bellavista" },
              { q: "Profesionales, creativos y con atención al detalle impecable.", n: "María González", r: "Directora de Marketing, Clínica Las Condes" },
              { q: "Nuestra identidad de marca nunca había sido tan coherente.", n: "Pedro Soto", r: "CEO, Viña Montes" }
            ].map((t, i) => (
              <div key={i} className="bg-secondary p-8 border border-border/50 hover:border-primary/30 transition-colors">
                <Quote className="text-primary mb-6" size={32} />
                <p className="text-lg mb-8 text-foreground/90 font-light">"{t.q}"</p>
                <div>
                  <p className="font-bold">{t.n}</p>
                  <p className="text-muted-foreground text-sm">{t.r}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contacto" className="py-32 bg-primary text-black">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-6xl md:text-8xl font-display mb-8">¿Hablamos?</h2>
            <div className="space-y-4 text-xl">
              <a href="mailto:hola@studiokm.cl" className="block hover:opacity-70 transition-opacity">hola@studiokm.cl</a>
              <p>+56 2 2345 6789</p>
            </div>
          </div>
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <input type="text" placeholder="Nombre" className="w-full bg-black/10 border-b border-black/20 p-4 focus:outline-none focus:border-black placeholder:text-black/50 transition-colors" />
            <input type="email" placeholder="Email" className="w-full bg-black/10 border-b border-black/20 p-4 focus:outline-none focus:border-black placeholder:text-black/50 transition-colors" />
            <textarea placeholder="Mensaje" rows={4} className="w-full bg-black/10 border-b border-black/20 p-4 focus:outline-none focus:border-black placeholder:text-black/50 transition-colors resize-none" />
            <button className="bg-black text-primary px-8 py-4 uppercase tracking-widest text-sm hover:bg-black/80 transition-colors w-full md:w-auto">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h3 className="font-display text-2xl mb-2">STUDIO KM</h3>
            <p className="text-muted-foreground text-sm">Creatividad con propósito.</p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><SiInstagram size={20} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><SiBehance size={20} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaLinkedin size={20} /></a>
          </div>
          
          <p className="text-muted-foreground text-sm">© 2025 Studio KM. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
