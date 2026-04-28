import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useMotionTemplate } from 'motion/react';
import { Shield, Terminal, Database, Gamepad2, Cpu, ArrowRight, ExternalLink, Check, Code2, Zap, Layers, Activity, Server, Menu, X, ChevronDown, Plus, Minus, Lock, Network, BrainCircuit, Monitor, Share2 } from 'lucide-react';
import AIEstimator from './components/AIEstimator';

const DISCORD_LINK = "https://discord.com/users/1059109501313237114";
const ROBLOX_LINK = "https://www.roblox.com/users/1829644134/profile";

// Custom Cursor Component
function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Robust touch check
    const handleTouchStart = () => {
      setIsTouchDevice(true);
    };
    
    // Also check standard properties
    if (window.matchMedia("(hover: none) and (pointer: coarse)").matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    if (isTouchDevice) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('a') || target.closest('button')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div className="hidden md:block pointer-events-none z-[9999] fixed inset-0 overflow-hidden" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }}>
      <motion.div
        className="absolute w-3 h-3 bg-white rounded-full mix-blend-difference shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isHovering ? 2.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 40, mass: 0.2 }}
      />
      <motion.div
        className="absolute w-10 h-10 border border-white/30 bg-white/5 rounded-full mix-blend-difference backdrop-blur-[2px]"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
      />
    </div>
  );
}

// Magnetic Wrapper Component
function Magnetic({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Spotlight Card Component (Follows Mouse)
function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm transition-colors hover:border-zinc-600 ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.06),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
}

// Text Reveal Component
function TextReveal({ text, className }: { text: string, className?: string }) {
  const words = text.split(" ");
  return (
    <div className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <div key={i} className="overflow-hidden mr-[0.25em] mb-1 md:mb-2">
          <motion.div
            initial={{ y: "120%", rotateX: -30, opacity: 0 }}
            whileInView={{ y: 0, rotateX: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="origin-bottom"
          >
            {word}
          </motion.div>
        </div>
      ))}
    </div>
  );
}

// Infinite Marquee Component
function Marquee() {
  const techStack = [
    "Luau", "OOP", "Raycasting", "DataStores", "Anti-Cheat", 
    "Netcode", "Client-Server Model", "UI Tweening", "Pathfinding", 
    "Modular Frameworks", "Roblox Studio", "Git"
  ];
  
  return (
    <div className="w-full overflow-hidden border-y border-white/5 bg-white/[0.01] py-4 md:py-6 flex relative z-20">
      <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-transparent to-[#09090b] z-10 pointer-events-none" />
      <motion.div 
        className="flex whitespace-nowrap gap-8 md:gap-16 px-4 md:px-8 items-center"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {[...techStack, ...techStack, ...techStack].map((tech, i) => (
          <div key={i} className="flex items-center gap-8 md:gap-16">
            <span className="text-xs md:text-sm font-mono tracking-widest uppercase text-zinc-500">{tech}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer, isOpen, onClick }: { question: string, answer: string, isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border-b border-zinc-800">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
      >
        <span className="text-lg md:text-xl font-bold text-zinc-300 group-hover:text-white transition-colors">{question}</span>
        <span className="ml-4 flex-shrink-0 text-zinc-500 group-hover:text-white transition-colors">
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-zinc-400 text-base md:text-lg font-light leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const yBg = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
  const opacityBg = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [1, 0.8, 0.8, 0.3]);
  const yStory = useTransform(smoothProgress, [0, 1], ["0%", "-15%"]);

  const portfolioRef = useRef<HTMLElement>(null);
  const { scrollYProgress: portfolioScroll } = useScroll({
    target: portfolioRef,
    offset: ["start end", "end start"]
  });
  const yPortfolioBg = useTransform(portfolioScroll, [0, 1], ["-20%", "20%"]);

  const capabilitiesRef = useRef<HTMLElement>(null);
  const { scrollYProgress: capabilitiesScroll } = useScroll({
    target: capabilitiesRef,
    offset: ["start end", "end start"]
  });
  const yCapabilitiesBg = useTransform(capabilitiesScroll, [0, 1], ["-15%", "15%"]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("INITIALIZING KERNEL...");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);
  const [toast, setToast] = useState<string | null>(null);

  const handleCopyLink = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setToast("Link copied to clipboard!");
    setTimeout(() => setToast(null), 3000);
  };

  const sections = [
    { name: "Home", id: "home" },
    { name: "The Story", id: "story" },
    { name: "Capabilities", id: "capabilities" },
    { name: "Systems", id: "portfolio" },
    { name: "Investment", id: "pricing" },
    { name: "AI Estimator", id: "estimator" },
    { name: "FAQ", id: "faq" },
    { name: "Verification", id: "testimonials" },
    { name: "Commence", id: "contact" }
  ];

  const faqs = [
    {
      question: "Do you design UI or animate models?",
      answer: "No. I specialize purely in backend logic, core game loops, API integrations, and heavy scripting. If you need a beautifully designed inventory, you provide the UI, and I will write the bulletproof logic to make it work seamlessly."
    },
    {
      question: "How long does a typical system take?",
      answer: "I work exceptionally fast. Small UI logic or basic systems can be done in 2-12 hours. Medium-sized requested features like combat frameworks typically take 1-2 days. Large-scale structural items might take around 3-7 days. My AI estimator provides tailored timeframes."
    },
    {
      question: "How does the payment process work?",
      answer: "I require 50% upfront via PayPal before writing the first line of code, and the remaining 50% upon successful completion and demonstration of the system in a test environment. No Robux, no percentages, no rev-share."
    },
    {
      question: "Are your systems secure against exploiters?",
      answer: "Absolute security is a core tenet of my architecture. All critical actions are validated server-side. I specialize in OOP frameworks and Raycasting, writing custom anti-cheat logic seamlessly integrated into the combat and interaction loops."
    },
    {
      question: "What if I hire you for a smaller task?",
      answer: "I'm open to smaller tasks if the details are clearly defined. Using the AI Estimator is the best way to see if your request falls into a feasible price range. Don't hesitate to reach out for simple scripts."
    }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleScrollTo = (id: string) => {
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const bootSequence = [
      { progress: 12, text: "ALLOCATING MEMORY FOR 21 AGENT SWARM...", delay: 300 },
      { progress: 34, text: "MOUNTING SERVER-AUTHORITATIVE LOGIC...", delay: 800 },
      { progress: 58, text: "COMPILING AEGIS ANTI-CHEAT MODULES...", delay: 1200 },
      { progress: 76, text: "ESTABLISHING WEBSOCKET TO ORCHESTRATOR...", delay: 1700 },
      { progress: 94, text: "INJECTING UI/UX DEPENDENCIES...", delay: 2200 },
      { progress: 100, text: "SYSTEM READY.", delay: 2600 }
    ];

    let startTime = Date.now();
    let isMounted = true;

    const runSequence = () => {
      if (!isMounted) return;
      const now = Date.now();
      const elapsed = now - startTime;

      let currentStep = { progress: 0, text: "INITIALIZING KERNEL..." };
      for (const step of bootSequence) {
        if (elapsed >= step.delay) {
          currentStep = step;
        }
      }

      setLoadingProgress(currentStep.progress);
      setLoadingText(currentStep.text);

      if (elapsed < 3000) {
        requestAnimationFrame(runSequence);
      } else {
        setTimeout(() => {
          if (isMounted) setIsLoading(false);
        }, 300);
      }
    };

    requestAnimationFrame(runSequence);

    return () => { isMounted = false; };
  }, []);

  return (
    <div id="home" ref={containerRef} className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-white selection:text-black overflow-x-hidden cursor-auto md:cursor-none">
      <CustomCursor />

      {/* Floating Side Navigation Menu */}
      <div className="fixed right-4 md:right-8 top-20 md:top-24 z-[100] flex flex-col items-center">
        <button 
          onClick={toggleMenu}
          className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)] group"
          aria-label="Navigation Menu"
        >
          {isMenuOpen ? <X className="w-5 h-5 group-hover:rotate-90 transition-transform" /> : <Menu className="w-5 h-5 group-hover:-rotate-12 transition-transform" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 w-64 md:w-80 bg-[#09090b] border-l border-zinc-800 z-[95] flex flex-col p-8 lg:p-12 shadow-2xl overflow-y-auto"
            >
              <h3 className="font-mono text-xs text-zinc-500 tracking-widest uppercase mb-12 border-b border-zinc-800 pb-4">Directory</h3>
              <nav className="flex flex-col gap-6">
                {sections.map((section, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleScrollTo(section.id)}
                    className="text-left text-xl md:text-2xl font-black uppercase tracking-tighter text-zinc-400 hover:text-white transition-colors relative group w-fit"
                  >
                    {section.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
                  </button>
                ))}
              </nav>
              <div className="mt-auto pt-12 text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                <p>Status: Online</p>
                <p className="mt-2 text-green-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Available
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Elite Preloader Sequence */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
            initial={{ y: 0 }}
            exit={{ y: "-100%", opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Tech Parallax Background */}
            <motion.div 
              className="absolute inset-0 z-0 opacity-30 pointer-events-none"
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 3, ease: "easeOut" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,187,0.03)_0%,transparent_60%)]" />
              <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem]" style={{ transform: "perspective(500px) rotateX(60deg) translateY(-100px) scale(2)" }} />
            </motion.div>
            
            <div className="relative z-10 w-full max-w-md px-8 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-16 h-16 border-2 border-zinc-800 rounded-full flex items-center justify-center mb-8 relative"
              >
                {/* Rotating ring */}
                <motion.div 
                  className="absolute inset-[-4px] rounded-full border border-t-[#00ffbb] border-r-transparent border-b-transparent border-l-transparent opacity-70"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
                <Terminal className="w-6 h-6 text-zinc-400" />
              </motion.div>

              <div className="flex justify-between w-full mb-3 font-mono">
                <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-widest">{loadingText}</span>
                <span className="text-[10px] md:text-xs text-[#00ffbb]">{loadingProgress}%</span>
              </div>

              <div className="w-full h-[3px] bg-zinc-900 overflow-hidden relative rounded-full">
                <motion.div 
                  className="absolute top-0 left-0 h-full bg-[#00ffbb] rounded-full shadow-[0_0_15px_rgba(0,255,187,0.8)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </div>
              
              <div className="mt-8 font-mono text-[9px] md:text-[10px] text-zinc-600 tracking-widest flex flex-col items-center gap-2">
                <p>Establishing secure connection to mainframe...</p>
                <div className="flex gap-1" >
                  {[...Array(3)].map((_, i) => (
                     <motion.div 
                       key={i}
                       className="w-1.5 h-1.5 rounded-full bg-zinc-700"
                       animate={{ opacity: [0.3, 1, 0.3] }}
                       transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                     />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-white origin-left z-[150] shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        style={{ scaleX: smoothProgress }}
      />

      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Parallax Background Grid & Glow */}
      <motion.div className="fixed inset-0 z-0 pointer-events-none" style={{ y: yBg, opacity: opacityBg }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
        <motion.div 
          className="h-[200%] w-full bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem] md:bg-[size:4rem_4rem]" 
          animate={{ y: [0, -64] }}
          transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        />
      </motion.div>

      {/* Floating Orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-zinc-400/[0.03] blur-[120px]"
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[20%] right-[5%] w-[50vw] h-[50vw] rounded-full bg-white/[0.02] blur-[150px]"
          animate={{ x: [0, -80, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-[#09090b]/70 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
        <Magnetic>
          <div className="flex flex-col cursor-pointer p-2 md:p-4 -m-2 md:-m-4">
            <span className="text-sm md:text-base font-bold tracking-widest uppercase text-white">Lukako.</span>
            <span className="text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-widest">SYS.ARCHITECT // v2.0</span>
          </div>
        </Magnetic>
        <Magnetic>
          <a 
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-mono tracking-widest uppercase border border-zinc-700 bg-zinc-900/80 backdrop-blur-md rounded-full px-5 md:px-6 py-2.5 md:py-3 hover:bg-white hover:text-black hover:border-white transition-all duration-500 shadow-lg"
          >
            <span>Initialize</span>
            <div className="w-1.5 h-1.5 bg-green-400 group-hover:bg-black rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)] group-hover:shadow-none" />
          </a>
        </Magnetic>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex flex-col justify-center pt-24 pb-12 z-10">
        <div className="px-4 md:px-8 max-w-[90rem] mx-auto w-full flex-grow flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-8 md:mb-12 overflow-hidden">
              <motion.div 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: isLoading ? "100%" : 0, opacity: isLoading ? 0 : 1 }}
                transition={{ duration: 0.8, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
                className="px-3 md:px-4 py-1.5 border border-green-500/30 bg-green-500/10 rounded-full text-[9px] md:text-[10px] font-mono tracking-widest uppercase text-green-400 flex items-center gap-2 backdrop-blur-sm shadow-[0_0_15px_rgba(74,222,128,0.15)]"
              >
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                Accepting Clients: Q2
              </motion.div>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isLoading ? 0 : 1, x: isLoading ? -20 : 0 }}
                transition={{ duration: 0.8, delay: 2.4, ease: "easeOut" }}
                className="font-mono text-zinc-400 tracking-widest uppercase text-[9px] md:text-[10px] bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800/80"
              >
                AGE: 15 <span className="text-zinc-600 mx-1">//</span> ROBLOX <span className="text-zinc-600 mx-1">//</span> <span className="text-white font-bold tracking-[0.2em] relative"><span className="absolute -inset-1 bg-white/10 blur-[4px] rounded-full"></span>OOP SPECIALIST</span>
              </motion.p>
            </div>
            
            <h1 className="text-[16vw] md:text-[12vw] lg:text-[10vw] leading-[0.85] md:leading-[0.8] font-black tracking-tighter uppercase mb-8 md:mb-12 text-white perspective-1000">
              <span className="block overflow-hidden pb-2">
                <motion.span 
                  initial={{ y: "120%", rotateX: -20, opacity: 0 }}
                  animate={{ y: isLoading ? "120%" : 0, rotateX: isLoading ? -20 : 0, opacity: isLoading ? 0 : 1 }}
                  transition={{ duration: 1.2, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
                  className="block origin-bottom drop-shadow-2xl relative"
                >
                  <span className="absolute inset-x-0 bottom-0 top-[60%] bg-gradient-to-t from-zinc-800/40 mix-blend-overlay"></span>
                  Engineering
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2 text-zinc-600">
                <motion.span 
                  initial={{ y: "120%", rotateX: -20, opacity: 0 }}
                  animate={{ y: isLoading ? "120%" : 0, rotateX: isLoading ? -20 : 0, opacity: isLoading ? 0 : 1 }}
                  transition={{ duration: 1.2, delay: 2.2, ease: [0.16, 1, 0.3, 1] }}
                  className="block origin-bottom"
                >
                  Robust
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span 
                  initial={{ y: "120%", rotateX: -20, opacity: 0 }}
                  animate={{ y: isLoading ? "120%" : 0, rotateX: isLoading ? -20 : 0, opacity: isLoading ? 0 : 1 }}
                  transition={{ duration: 1.2, delay: 2.3, ease: [0.16, 1, 0.3, 1] }}
                  className="block origin-bottom drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                >
                  Systems.
                </motion.span>
              </span>
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 40 : 0 }}
            transition={{ duration: 1, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-t border-zinc-800 pt-8 md:pt-12 mt-4 md:mt-8"
          >
            <p className="text-base md:text-xl lg:text-2xl text-zinc-400 max-w-3xl font-light leading-relaxed tracking-wide">
              Stop paying for spaghetti code. I build polished, modular, and unhackable game mechanics that scale. Your game's success relies on its foundation.
            </p>
            <Magnetic>
              <a href="#portfolio" className="group flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-mono uppercase tracking-widest text-white hover:text-zinc-400 transition-colors p-4 -m-4">
                <span className="relative overflow-hidden">
                  <span className="block group-hover:-translate-y-full transition-transform duration-300">Explore Architecture</span>
                  <span className="block absolute top-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">Explore Architecture</span>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        {/* Marquee added to bottom of hero */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 1, delay: 3.2 }}
          className="mt-16 md:mt-24"
        >
          <Marquee />
        </motion.div>
      </section>

      {/* The Story Section */}
      <section id="story" className="py-24 md:py-40 px-4 md:px-8 relative z-10 bg-[#0c0c0e] overflow-hidden">
        <div className="max-w-[90rem] mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:sticky lg:top-32"
          >
            <TextReveal text="The Evolution." className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.85] text-white" />
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-6 md:mt-8 font-mono text-[10px] md:text-xs text-zinc-500 tracking-widest uppercase space-y-1"
            >
              <p>System Failure: 9 Months Ago</p>
              <p className="text-white">Reboot Status: Complete</p>
            </motion.div>
          </motion.div>
          
          <motion.div 
            style={{ y: yStory }}
            className="space-y-8 md:space-y-12 text-lg md:text-2xl text-zinc-400 font-light leading-relaxed tracking-wide"
          >
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              If you're looking for my old showcase videos, they're gone. Taken down 9 months ago. Honestly? Half of those videos were recorded in terrible quality on a laggy laptop because I couldn't afford a proper PC.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              Losing that portfolio was a devastating blow. I had nothing to show for my years of self-taught scripting. But it forced a hard reset. I couldn't rely on old, messy code anymore. I had to prove myself all over again, from scratch.
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              I spent the last nine months completely deconstructing my process. I mastered Object-Oriented Programming (OOP) and built impenetrable anti-cheat systems.
            </motion.p>
            
            <SpotlightCard className="p-8 md:p-12 shadow-2xl mt-8">
              <div className="relative z-10">
                <p className="text-white font-medium text-xl md:text-3xl leading-tight">
                  Today, I work on a PC with an RTX 5070. The progress is night and day. I don't just write scripts anymore; I engineer scalable, unexploitable architectures. The systems I build today are lightyears ahead of what was lost.
                </p>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

      {/* Featured Architectures (Case Studies Expansion) */}
      <section id="portfolio" ref={portfolioRef} className="py-24 md:py-40 px-4 md:px-8 border-t border-zinc-800/50 relative z-10 overflow-hidden">
        {/* Subtle Parallax Background for Portfolio */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none opacity-20"
          style={{ y: yPortfolioBg }}
        >
          <div className="absolute right-[5%] top-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-500/[0.03] blur-[100px]" />
          <div className="h-full w-full bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:5rem_5rem]" />
        </motion.div>

        <div className="max-w-[90rem] mx-auto relative z-10">
          <div className="mb-12 md:mb-20">
            <TextReveal text="Featured Systems" className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-2 md:mb-4 text-white" />
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[10px] md:text-xs text-zinc-500 tracking-widest uppercase"
            >
              Case Studies & Deployments
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            <motion.div
              id="system-combat"
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard className="h-full p-8 md:p-12 flex flex-col justify-between group overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 border border-zinc-700 rounded-xl flex items-center justify-center bg-zinc-900/50 text-white">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-3 relative z-20">
                      <span className="font-mono text-[10px] px-3 py-1 border border-zinc-700 rounded-full text-zinc-400">FRAMEWORK</span>
                      <button onClick={(e) => handleCopyLink('system-combat', e)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all pointer-events-auto cursor-pointer" title="Copy section link">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-white">Next-Gen Combat</h3>
                  <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
                    A fully modular, OOP-driven combat framework designed for 100-player servers. Features predictive hit registration, rollback netcode, and 0.01ms server latency.
                  </p>
                  <ul className="space-y-3 font-mono text-xs text-zinc-500">
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Raycast Hit Detection</li>
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Client-Side Prediction</li>
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Synced VFX/SFX Engine</li>
                  </ul>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                  <Code2 className="w-64 h-64 text-white" />
                </div>
              </SpotlightCard>
            </motion.div>

            <motion.div
              id="system-anticheat"
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <SpotlightCard className="h-full p-8 md:p-12 flex flex-col justify-between group overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 border border-zinc-700 rounded-xl flex items-center justify-center bg-zinc-900/50 text-white">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-3 relative z-20">
                      <span className="font-mono text-[10px] px-3 py-1 border border-zinc-700 rounded-full text-zinc-400">SECURITY</span>
                      <button onClick={(e) => handleCopyLink('system-anticheat', e)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all pointer-events-auto cursor-pointer" title="Copy section link">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-white">Aegis Anti-Cheat</h3>
                  <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-8">
                    An impenetrable server-authoritative security layer. Automatically detects and punishes memory injection, physics manipulation, and remote event spamming.
                  </p>
                  <ul className="space-y-3 font-mono text-xs text-zinc-500">
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Server-Authoritative Physics</li>
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Remote Event Encryption</li>
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-500" /> Auto-Ban Heuristics</li>
                  </ul>
                </div>
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                  <Lock className="w-64 h-64 text-white" />
                </div>
              </SpotlightCard>
            </motion.div>
          </div>

          {/* ADK Full Width Showcase */}
          <motion.div
            id="system-adk"
            initial={{ opacity: 0, y: 80, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 md:mt-8"
          >
            <SpotlightCard className="p-8 md:p-12 overflow-hidden group">
              <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-12 h-12 border border-zinc-700 rounded-xl flex items-center justify-center bg-zinc-900/50 text-white">
                      <BrainCircuit className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-3 relative z-20">
                      <span className="font-mono text-[10px] px-3 py-1 border border-zinc-700 rounded-full text-zinc-400">AI / ORCHESTRATION</span>
                      <button onClick={(e) => handleCopyLink('system-adk', e)} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900/50 border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all pointer-events-auto cursor-pointer" title="Copy section link">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 text-white leading-tight">Professional ADK Agent Design</h3>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                    I am a professional ADK (Agent Development Kit) Designer. Look closely at the image—this is one of my production-ready, professional agents featuring an orchestra of <span className="text-white font-bold">21 specialized sub-agents</span> focused on different tasks and working concurrently.
                  </p>
                  <ul className="space-y-3 font-mono text-xs text-zinc-500">
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-purple-500" /> Multi-Agent Orchestration</li>
                    <li className="flex items-center gap-3"><Check className="w-4 h-4 text-purple-500" /> Parallel Execution Pipelines</li>
                  </ul>
                </div>
                <div className="relative z-10 w-full rounded-xl overflow-hidden border border-zinc-800 bg-[#0a0a0c] shadow-2xl relative">
                  {/* CSS Fallback if Image is not present */}
                  <div className="absolute inset-0 bg-[#0a0a0c] -z-10 p-6 flex flex-col items-center justify-center text-center">
                     <p className="text-zinc-500 font-mono text-xs mb-2">Awaiting target image payload...</p>
                     <p className="text-zinc-600 font-mono text-[10px]">Please drag your image to the file manager, name it 'adk-orchestrator.png' inside the 'public' folder.</p>
                  </div>
                  <img 
                    src="/adk-orchestrator.png" 
                    alt="Nexus Orchestrator - production ready professional agent with 21 agents focused on different tasks" 
                    className="hidden"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {/* Perfect Replica of AI Studio Agent Chat UI */}
                  <div className="w-full bg-[#09090b] p-6 font-sans text-[13px] md:text-[14px] text-zinc-300 flex flex-col overflow-hidden relative rounded-xl border border-white/5 pb-12">
                    
                    {/* Top Nav Mockup */}
                    <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-800/60 sticky top-0 bg-[#09090b]/80 backdrop-blur-sm z-10 w-full pt-2">
                       <div className="flex items-center gap-3">
                         <div className="w-6 h-6 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                            <span className="w-3 h-3 rounded-full border-[1.5px] border-zinc-500"></span>
                         </div>
                         <div className="flex items-center gap-1">
                           <span className="text-white font-medium text-[15px]">Gemini 3.1 Neural</span>
                           <ChevronDown className="w-4 h-4 text-zinc-500" />
                         </div>
                         <span className="hidden md:inline-flex text-[10px] uppercase text-zinc-500 tracking-wider">SECURE LOCAL BRIDGE</span>
                       </div>
                       <div className="flex gap-4">
                         <div className="hidden md:flex bg-zinc-800 text-zinc-300 px-4 py-1.5 rounded-lg border border-zinc-700 text-xs items-center gap-2">
                            To exit full screen, press and hold <span className="bg-zinc-700 px-1.5 py-0.5 rounded text-[10px] uppercase text-white font-mono">Esc</span>
                         </div>
                         <div className="px-3 py-1.5 bg-[#004e3c]/20 border border-[#00ffbb]/30 text-[#00ffbb] font-mono text-[10px] rounded-full flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ffbb] animate-pulse"></span> PORT 8001
                         </div>
                       </div>
                    </div>

                    <div className="max-w-3xl mx-auto w-full space-y-12">
                      {/* User Chat Bubble */}
                      <div className="flex items-start gap-5">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 text-white font-medium mt-1">
                          S
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium mb-3 text-[15px]">You</p>
                          <p className="text-zinc-200 leading-relaxed text-[15px]">Hello. Create a round system.</p>
                        </div>
                      </div>

                      {/* Nexus Orchestrator Header */}
                      <div className="flex items-start gap-5">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.3)] mt-1">
                           <svg viewBox="0 0 24 24" className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                        </div>
                        <div className="flex-1 space-y-6">
                           <p className="text-white font-semibold text-[15px]">Nexus Orchestrator</p>

                           {/* Sub agent tool call 1 */}
                           <div className="space-y-3">
                              <div className="flex items-center gap-2 text-zinc-300 font-mono text-[11px] font-semibold tracking-wide">
                                <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                <span>System Tool Call:</span> <span className="bg-[#1c1c38] text-[#9393ff] px-2 py-0.5 rounded border border-[#3b3b64]">core_systems_engineer</span>
                              </div>
                              <div className="bg-[#121212] border border-zinc-800 rounded-xl p-5 font-mono text-[11px] leading-relaxed">
                                <div className="flex justify-between items-center text-zinc-500 mb-4 tracking-widest text-[9px] font-bold">
                                  <span>JSON</span>
                                  <span className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy</span>
                                </div>
                                <div className="overflow-x-auto whitespace-pre">
<span className="text-white">{`{
  `}</span><span className="text-[#a5d6ff]">"request"</span><span className="text-white">: </span><span className="text-[#ceced3]">"[Context]: We are building a robust, enterprise-grade round system for a..."</span><span className="text-white">{`
}`}</span>
                                </div>
                              </div>
                           </div>
                           
                           {/* Sub agent tool call 2 */}
                           <div className="space-y-3 pt-2">
                              <div className="flex items-center gap-2 text-zinc-300 font-mono text-[11px] font-semibold tracking-wide">
                                <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                <span>System Tool Call:</span> <span className="bg-[#1c1c38] text-[#9393ff] px-2 py-0.5 rounded border border-[#3b3b64]">uiux_architect</span>
                              </div>
                              <div className="bg-[#121212] border border-zinc-800 rounded-xl p-5 font-mono text-[11px] leading-relaxed">
                                <div className="flex justify-between items-center text-zinc-500 mb-4 tracking-widest text-[9px] font-bold">
                                  <span>JSON</span>
                                  <span className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> Copy</span>
                                </div>
                                <div className="overflow-x-auto whitespace-pre">
<span className="text-white">{`{
  `}</span><span className="text-[#a5d6ff]">"request"</span><span className="text-white">: </span><span className="text-[#ceced3]">"[Context]: We are building a robust round system. The core systems engine..."</span><span className="text-white">{`
}`}</span>
                                </div>
                              </div>
                           </div>

                           <div className="space-y-6 pt-4 text-[15px] font-normal leading-[1.7] text-[#d4d4dc]">
                             <p>Here is a complete, enterprise-grade round system architected by my specialized engineering and UI subagents.</p>
                             <p>This system operates on a <strong className="text-white font-semibold">Server-Authoritative / Client-Presentation</strong> model. The server explicitly manages the game states, time, and player lifecycle (teleporting, win conditions, map loading), while the client merely listens for state updates to display a highly polished, animated top-center HUD.</p>
                             
                             <div>
                               <h4 className="text-white text-xl font-bold mb-4">Step 1: Project Hierarchy Setup</h4>
                               <p className="mb-4">Before adding the code, create the following required folder structure in your Roblox Studio Explorer:</p>
                               <ol className="list-decimal pl-5 space-y-4 marker:text-zinc-500">
                                  <li>
                                    <span className="bg-[#1c1c38] text-[#9393ff] font-mono text-xs px-2 py-0.5 rounded border border-[#3b3b64]">ServerStorage</span>
                                    <ul className="list-disc pl-5 mt-2 space-y-2 text-sm marker:text-zinc-600">
                                      <li>Create a Folder named <span className="bg-[#24242e] text-[#ceced3] font-mono text-[10px] px-1.5 py-0.5 rounded">Maps</span>.</li>
                                      <li>Place your map models inside this folder.</li>
                                      <li><strong>Crucial:</strong> Inside <em>every</em> map model, create a Folder named <span className="bg-[#24242e] text-[#ceced3] font-mono text-[10px] px-1.5 py-0.5 rounded">Spawns</span>, and place your SpawnLocation Parts (or any normal parts to act as spawns) inside it.</li>
                                    </ul>
                                  </li>
                                  <li>
                                    <span className="bg-[#1c1c38] text-[#9393ff] font-mono text-xs px-2 py-0.5 rounded border border-[#3b3b64]">StarterGui</span>
                                    <ul className="list-disc pl-5 mt-2 space-y-2 text-sm marker:text-zinc-600">
                                      <li>Create a <span className="bg-[#1c1c38] text-[#9393ff] font-mono text-[10px] px-1.5 py-0.5 rounded border border-[#3b3b64]">ScreenGui</span> named <span className="bg-[#24242e] text-[#ceced3] font-mono text-[10px] px-1.5 py-0.5 rounded">RoundStatusGui</span>.</li>
                                      <li>Disable <span className="bg-[#24242e] text-[#ceced3] font-mono text-[10px] px-1.5 py-0.5 rounded">ResetOnSpawn</span> (uncheck the box in properties).</li>
                                    </ul>
                                  </li>
                               </ol>
                             </div>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl pointer-events-none"></div>
                </div>
              </div>
            </SpotlightCard>

            {/* ADK Specifications Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {[
                {
                  icon: <Network className="w-5 h-5 text-purple-400" />,
                  title: "Swarm Intelligence",
                  desc: "21 concurrent micro-agents capable of handling UI/UX, Core Systems, Security, and Networking in parallel without stepping on each other's code context."
                },
                {
                  icon: <Lock className="w-5 h-5 text-[#00ffbb]" />,
                  title: "Zero-Trust Architecture",
                  desc: "Agents are directly fine-tuned to architect Server-Authoritative environments, migrating and patching all exploitable remote events automatically."
                },
                {
                  icon: <Cpu className="w-5 h-5 text-blue-400" />,
                  title: "Token Optimization",
                  desc: "Advanced context-window management ensures absolute memory retention across complex, multi-day development sprints to avoid hallucinating APIs."
                },
                {
                  icon: <Activity className="w-5 h-5 text-rose-400" />,
                  title: "Autonomous Iteration",
                  desc: "Self-correcting feedback loops. If a system fails a simulated integration test, the diagnostic sub-agent isolates and patches the logic instantly."
                }
              ].map((spec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, x: -20 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.1 * i + 0.4, ease: "easeOut" }}
                >
                  <SpotlightCard className="p-6 h-full flex flex-col justify-between group cursor-default">
                    <div className="mb-4 w-10 h-10 border border-zinc-800 rounded-lg flex items-center justify-center bg-zinc-900/50">
                      {spec.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 transition-all">{spec.title}</h4>
                      <p className="text-zinc-500 text-xs leading-relaxed">{spec.desc}</p>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* Expertise / Bento Grid */}
      <section id="capabilities" ref={capabilitiesRef} className="py-24 md:py-40 px-4 md:px-8 border-t border-zinc-800/50 relative z-10 bg-[#0c0c0e] overflow-hidden">
        {/* Subtle Parallax Background for Capabilities */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.15]"
          style={{ y: yCapabilitiesBg }}
        >
          <div className="absolute left-[-10%] top-[30%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-emerald-500/[0.04] blur-[120px]" />
          <div className="h-full w-full bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.02)_0%,transparent_50%)]" />
        </motion.div>

        <div className="max-w-[90rem] mx-auto relative z-10">
          <div className="mb-12 md:mb-20">
            <TextReveal text="Capabilities" className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-2 md:mb-4 text-white" />
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[10px] md:text-xs text-zinc-500 tracking-widest uppercase"
            >
              Technical Arsenal
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[minmax(250px,auto)] md:auto-rows-[minmax(300px,auto)]">
            {/* Large Card */}
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2"
            >
              <SpotlightCard className="h-full p-8 md:p-12 flex flex-col justify-between group overflow-hidden">
                <div className="absolute top-0 right-0 p-6 md:p-8 opacity-5 group-hover:opacity-15 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 pointer-events-none">
                  <Server className="w-48 h-48 md:w-64 md:h-64 text-white" />
                </div>
                
                <div className="relative z-10">
                  <div className="w-10 h-10 md:w-12 md:h-12 border border-zinc-700 rounded-xl flex items-center justify-center mb-8 md:mb-12 bg-zinc-900/50 text-white">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-4 md:mb-6 text-white drop-shadow-md">Core Game Loops</h3>
                  <p className="text-zinc-400 max-w-xl text-base md:text-lg leading-relaxed">
                    Flawless round systems, secure DataStores with session locking, and highly scalable architectures designed to handle thousands of concurrent players without dropping a single frame.
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Standard Cards */}
            {[
              {
                icon: <Terminal />,
                title: "Custom Admin",
                desc: "1k+ lines of unhackable, unexploitable admin architecture tailored to your moderation needs."
              },
              {
                icon: <Cpu />,
                title: "Advanced AI",
                desc: "From simple PathFinding dummies to complex, state-machine driven boss AI."
              },
              {
                icon: <Monitor />,
                title: "UI Systems",
                desc: "Smooth tweening, modular shops, inventory systems, and responsive starterpacks."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, rotateX: 20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.15 * (i + 1), ease: [0.16, 1, 0.3, 1] }}
                style={{ perspective: "1000px" }}
              >
                <SpotlightCard className="h-full p-8 md:p-10 flex flex-col justify-between group">
                  <div className="relative z-10">
                    <div className="w-10 h-10 border border-zinc-700 rounded-xl flex items-center justify-center mb-8 bg-zinc-900/50 text-white">
                      <div className="w-4 h-4">{feature.icon}</div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-3 md:mb-4 text-white">{feature.title}</h3>
                    {feature.title === "UI Systems" ? (
                      <TextReveal text={feature.desc} className="text-zinc-400 text-sm leading-relaxed" />
                    ) : (
                      <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
                    )}
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol / Rules */}
      <section className="py-24 md:py-32 px-4 md:px-8 border-t border-zinc-800/50 relative z-10">
        <div className="max-w-[90rem] mx-auto">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-32">
            <div>
              <TextReveal text="Operating Parameters" className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-4 text-white" />
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="font-mono text-[10px] md:text-xs text-zinc-500 tracking-widest uppercase"
              >
                Terms of Engagement
              </motion.p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
              >
                <SpotlightCard className="h-full p-8 md:p-10">
                  <div className="relative z-10">
                    <h3 className="font-mono text-[9px] md:text-[10px] text-zinc-500 tracking-widest uppercase mb-6 md:mb-8">01 // Protocol</h3>
                    <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Strictly No Reselling</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      I work exclusively for those who pay me. My systems are not to be resold or redistributed. You buy it, you keep it, and you use it. Zero exceptions.
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                <SpotlightCard className="h-full p-8 md:p-10">
                  <div className="relative z-10">
                    <h3 className="font-mono text-[9px] md:text-[10px] text-zinc-500 tracking-widest uppercase mb-6 md:mb-8">02 // Scope</h3>
                    <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-white">Pure Engineering</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      I am strictly a programmer. If your project requires VFX, animations, or UI design, you must provide the assets. I build the logic that makes them flawless.
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 md:py-40 px-4 md:px-8 border-t border-zinc-800/50 relative z-10 bg-[#0c0c0e]">
        <div className="max-w-[90rem] mx-auto">
          <div className="mb-12 md:mb-20">
            <TextReveal text="Investment" className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-2 md:mb-4 text-white" />
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[10px] md:text-xs text-zinc-500 tracking-widest uppercase"
            >
              Financial Parameters
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16">
            <div className="space-y-12">
              <div className="space-y-3 md:space-y-4">
                {[
                  { title: "UI Systems", desc: "Tweening, shops, inventory, starterpack", price: "$3 - $60" },
                  { title: "Modular Framework Ability", desc: "Using OOP and Raycasting for hit detection", price: "$20 - $60" },
                  { title: "OOP Combat System", desc: "Raycasting based, completely anti-cheat secured", price: "$30 - $100" },
                  { title: "Full Game Systems", desc: "Scales infinitely depending on scope", price: "$20+" },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ x: 8, backgroundColor: "rgba(39, 39, 42, 0.5)", borderColor: "rgba(255,255,255,0.2)" }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 md:p-8 border border-zinc-800 bg-zinc-900/30 rounded-2xl transition-all duration-300 cursor-pointer"
                  >
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-zinc-200 mb-1 md:mb-2 uppercase tracking-tight group-hover:text-white transition-colors">{item.title}</h3>
                      <p className="text-zinc-500 text-xs md:text-sm font-mono">{item.desc}</p>
                    </div>
                    <div className="text-2xl md:text-3xl font-mono text-white mt-4 sm:mt-0 tracking-tighter group-hover:scale-105 transition-transform origin-left sm:origin-right">
                      {item.price}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* AI Estimator Section */}
              <motion.div
                id="estimator"
                className="scroll-mt-32"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
              >
                <AIEstimator />
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 md:p-10 border border-zinc-700 bg-zinc-800/40 backdrop-blur-md rounded-3xl h-fit lg:sticky lg:top-32 shadow-2xl"
            >
              <h3 className="font-mono text-[10px] md:text-xs text-white tracking-widest uppercase mb-6 md:mb-8 border-b border-zinc-700 pb-4">Payment Protocol</h3>
              <ul className="space-y-4 md:space-y-6 font-mono text-xs md:text-sm text-zinc-400">
                {[
                  "50% Upfront / 50% Upon Completion.",
                  "PayPal Exclusive. No exceptions.",
                  "Prices are negotiable based on exact specifications.",
                  "Available for significantly smaller tasks upon request."
                ].map((text, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-start gap-3 md:gap-4"
                  >
                    <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 md:py-40 px-4 md:px-8 border-t border-zinc-800/50 relative z-10 bg-[#09090b] overflow-hidden">
        <div className="max-w-[50rem] mx-auto">
          <div className="mb-12 md:mb-20 text-center">
            <TextReveal text="Query Databank" className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-2 md:mb-4 text-white justify-center" />
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[10px] md:text-xs text-zinc-500 tracking-widest uppercase"
            >
              Frequently Asked Questions
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col border-t border-zinc-800"
          >
            {faqs.map((faq, idx) => (
              <FAQItem 
                key={idx} 
                question={faq.question} 
                answer={faq.answer} 
                isOpen={openFAQIndex === idx} 
                onClick={() => setOpenFAQIndex(openFAQIndex === idx ? null : idx)} 
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 md:py-40 px-4 md:px-8 border-t border-zinc-800/50 relative z-10 bg-[#0a0a0c] overflow-hidden">
        <div className="max-w-[90rem] mx-auto">
          <div className="mb-12 md:mb-20">
            <TextReveal text="Verification" className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-2 md:mb-4 text-white" />
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-mono text-[10px] md:text-xs text-zinc-500 tracking-widest uppercase"
            >
              Client Telemetry
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                quote: "Lukako built a custom combat framework for our RPG in under a week. The raycasting is flawless, and the code is cleaner than what we got from a 'senior' dev we paid triple for.",
                author: "Project Lead",
                project: "Unannounced RPG",
                rating: 5
              },
              {
                quote: "I needed a complex inventory and shop system with secure server-side validation. He delivered it perfectly, documented everything, and even optimized our existing UI code.",
                author: "Indie Studio Owner",
                project: "Survival Simulator",
                rating: 5
              },
              {
                quote: "Fastest scripter I've ever worked with. The anti-cheat measures he implemented stopped our exploiter problem overnight. Highly recommend for any serious project.",
                author: "Community Manager",
                project: "1M+ Visits FPS",
                rating: 5
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="group relative p-8 md:p-10 border border-zinc-800 bg-zinc-900/30 rounded-3xl overflow-hidden hover:bg-zinc-800/50 transition-colors duration-500"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (i * 0.1) + (j * 0.05), type: "spring" }}
                      >
                        <svg className="w-4 h-4 text-zinc-300 fill-zinc-300" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </motion.div>
                    ))}
                  </div>
                  
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 flex-grow font-light">
                    "{testimonial.quote}"
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center justify-between">
                    <div>
                      <p className="text-white font-bold text-sm tracking-tight">{testimonial.author}</p>
                      <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-1">{testimonial.project}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                      <Terminal className="w-3 h-3 text-zinc-400" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Conversion Focused */}
      <section id="contact" className="py-32 md:py-40 px-4 md:px-8 border-t border-zinc-800/50 relative z-10 bg-[#09090b] overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)] pointer-events-none" 
          animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="max-w-[90rem] mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-800/50 backdrop-blur-sm mb-8">
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-xs font-mono tracking-widest uppercase text-zinc-300">Availability: 1 Slot Remaining</span>
            </div>

            <TextReveal text="Initiate." className="text-[16vw] md:text-[12vw] font-black tracking-tighter uppercase mb-6 md:mb-8 leading-none text-white justify-center drop-shadow-2xl" />
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-2xl text-zinc-400 mb-12 md:mb-16 font-light max-w-2xl mx-auto px-4"
            >
              Why hire a 15-year-old? Because I write better code than 20-year-olds, and I don't stop until the system is flawless. Let's build something massive.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
              <Magnetic className="inline-block">
                <a 
                  href={DISCORD_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-3 md:gap-4 bg-white text-black px-8 md:px-12 py-5 md:py-6 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest overflow-hidden transition-transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                >
                  <span className="relative z-10">Secure Slot via Discord</span>
                  <ExternalLink className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </a>
              </Magnetic>

              <Magnetic className="inline-block">
                <a 
                  href={ROBLOX_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center gap-3 md:gap-4 bg-transparent border border-zinc-700 text-white px-8 md:px-12 py-5 md:py-6 rounded-full font-bold text-xs md:text-sm uppercase tracking-widest overflow-hidden transition-transform hover:scale-105 hover:bg-zinc-800/50"
                >
                  <span className="relative z-10">View Roblox Profile</span>
                  <ExternalLink className="w-4 h-4 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </Magnetic>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-8 font-mono text-[10px] md:text-xs text-zinc-500 tracking-widest uppercase flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6"
            >
              <span>Discord ID: 1059109501313237114</span>
              <span className="hidden sm:inline">•</span>
              <span>Roblox ID: 1829644134</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-4 md:px-8 border-t border-zinc-800/50 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 text-zinc-500 text-[9px] md:text-[10px] font-mono uppercase tracking-widest bg-[#09090b] relative z-10">
        <p>© {new Date().getFullYear()} Lukako. Systems Engineering.</p>
        <div className="flex gap-4 md:gap-6">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
            Status: Online
          </span>
          <span>Location: Earth</span>
        </div>
      </footer>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999] bg-[#0c0c0e] border border-zinc-700 text-white px-5 py-3 rounded-full flex items-center gap-3 shadow-2xl backdrop-blur-md"
          >
            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-3 h-3 text-green-500" />
            </div>
            <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Dummy Lock component since it wasn't imported from lucide-react in the main imports
function Lock(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
