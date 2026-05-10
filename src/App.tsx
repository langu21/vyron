import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, User, Search, Menu, X, Heart, MessageSquare, Zap, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from './context/CartContext';
import { products } from './data/products';
import { Product } from './types';
import { geminiService } from './services/geminiService';
import { loginWithGoogle, logout, auth } from './firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

// --- Components ---

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-brand-black flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.5, duration: 0.8 }}
      onAnimationComplete={onComplete}
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 mb-6 relative">
          <motion.div 
             className="absolute inset-0 border-4 border-brand-blue rounded-full opacity-20"
             animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
             transition={{ duration: 2, repeat: Infinity }}
          />
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-brand-white">
            <path d="M20 20L50 80L80 20" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M35 50L50 80L65 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="opacity-50" />
          </svg>
        </div>
        <motion.h1 
          className="text-4xl md:text-6xl font-orbitron font-black tracking-[0.2em]"
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ duration: 0.2, repeat: 10 }}
        >
          VYRON
        </motion.h1>
        <motion.p 
          className="mt-4 text-brand-blue/60 font-space uppercase tracking-[0.5em] text-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          Wear the Future
        </motion.p>
      </motion.div>
      <div className="absolute bottom-12 w-full max-w-xs h-0.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-brand-blue"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

const Navbar = ({ onCartOpen, onStylistOpen }: { onCartOpen: () => void, onStylistOpen: () => void }) => {
  const { cartCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-brand-black/90 backdrop-blur-md py-6 border-b border-white/10' : 'bg-transparent py-8'}`}>
      <div className="px-10 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <a href="/" className="text-3xl font-orbitron font-black tracking-tighter uppercase italic flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-white flex items-center justify-center transform rotate-45 shrink-0">
              <div className="w-4 h-4 bg-brand-black transform -rotate-45"></div>
            </div>
            <span className="hidden sm:inline">VYRON</span>
          </a>
          <ul className="hidden lg:flex items-center gap-10 text-[11px] uppercase tracking-[0.2em] font-medium text-brand-white/70">
            <li><a href="#" className="hover:text-brand-blue transition-colors">Collections</a></li>
            <li><a href="#" className="hover:text-brand-blue transition-colors">Drops</a></li>
            <li><button onClick={onStylistOpen} className="text-brand-blue font-bold tracking-[0.2em] hover:opacity-80 transition-opacity">AI Stylist</button></li>
            <li><a href="#" className="hover:text-brand-blue transition-colors">About</a></li>
          </ul>
        </div>
        <div className="flex items-center gap-8">
          <button className="hidden sm:block text-[11px] font-mono tracking-widest text-brand-white/70 hover:text-brand-white">SEARCH</button>
          <button onClick={user ? logout : loginWithGoogle} className="flex items-center gap-2 text-brand-white/70 hover:text-brand-white">
            {user ? (
              <img src={user.photoURL || ''} className="w-6 h-6 rounded-none border border-brand-blue" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-[11px] font-mono tracking-widest uppercase">ACCOUNT</span>
            )}
          </button>
          <button onClick={onCartOpen} className="relative text-[11px] font-mono tracking-widest text-brand-white/70 hover:text-brand-white flex items-center gap-2">
            CART ({cartCount})
            {cartCount > 0 && (
              <div className="w-2 h-2 bg-brand-blue rounded-full pulse"></div>
            )}
          </button>
          <button className="lg:hidden text-brand-white"><Menu size={20} /></button>
        </div>
      </div>
    </nav>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-brand-charcoal">
        <motion.img 
          src={product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {product.isNewArrival && (
          <span className="absolute top-4 left-4 bg-brand-blue text-brand-black text-[10px] font-black uppercase px-2 py-1 rounded-sm">New Drop</span>
        )}
        
        <div className="absolute bottom-4 left-4 right-4 translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
          <button 
            onClick={() => addToCart(product, product.sizes[0])}
            className="w-full py-3 bg-brand-white text-brand-black font-black uppercase text-[10px] tracking-widest rounded-none flex items-center justify-center gap-2 hover:bg-brand-blue transition-colors"
          >
            Quick Add
          </button>
        </div>

        <button className="absolute top-4 right-4 p-2 rounded-none bg-brand-black/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart size={16} className="text-white hover:fill-brand-blue hover:text-brand-blue transition-colors" />
        </button>
      </div>
      <div className="mt-4 flex justify-between items-start border-l border-brand-blue/30 pl-4 py-1">
        <div>
          <h3 className="text-xs font-space font-bold text-brand-white uppercase tracking-wider group-hover:text-brand-blue transition-colors">{product.name}</h3>
          <p className="text-[10px] text-brand-white/40 uppercase mt-1 tracking-[0.2em]">{product.type}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono font-bold tracking-tighter">${product.price}</p>
          {product.discountPrice && (
            <p className="text-[9px] text-brand-white/20 line-through tracking-tighter">${product.discountPrice + product.price}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const CartSidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
             className="fixed inset-0 bg-brand-black/80 backdrop-blur-sm z-[100]" 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={onClose}
          />
          <motion.div 
            className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-charcoal z-[101] shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-orbitron font-black uppercase tracking-widest">Cart</h2>
              <button onClick={onClose} className="p-2 hover:text-brand-blue"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-brand-white/30">
                  <ShoppingCart size={48} strokeWidth={1} />
                  <p className="mt-4 uppercase tracking-[0.2em] text-xs">Your bag is empty</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 group">
                      <div className="w-20 h-24 bg-brand-black rounded-lg overflow-hidden shrink-0">
                        <img src={item.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold truncate">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id, item.selectedSize)} className="text-brand-white/30 hover:text-red-500"><Trash2 size={16} /></button>
                        </div>
                        <p className="text-[10px] text-brand-white/50 uppercase mt-1">Size: {item.selectedSize}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-brand-black px-2 py-1 rounded-md border border-white/5">
                            <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)} className="hover:text-brand-blue"><Minus size={14} /></button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)} className="hover:text-brand-blue"><Plus size={14} /></button>
                          </div>
                          <p className="text-sm font-orbitron font-bold">${item.price * item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-brand-black/50 border-t border-white/10 space-y-4">
              <div className="flex justify-between text-sm uppercase tracking-widest text-brand-white/60">
                <span>Total</span>
                <span className="text-brand-white font-orbitron font-bold text-lg">${cartTotal}</span>
              </div>
              <button className="w-full py-4 bg-brand-blue text-brand-black font-black uppercase tracking-[0.2em] text-sm rounded-lg hover:bg-brand-white transition-colors flex items-center justify-center gap-2 shadow-lg neon-glow-blue">
                Checkout Now <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const StylistSidebar = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "Welcome to the future. I am VYRON AI. Tell me, what's code for your fit today? Dark anime vibes? Industrial tech? I'm here to curate." }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const advice = await geminiService.getStylistAdvice(userMsg, products);
    setMessages(prev => [...prev, { role: 'ai', content: advice }]);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div className="fixed inset-0 bg-brand-black/80 backdrop-blur-sm z-[100]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div 
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-brand-black z-[101] shadow-2xl flex flex-col border-l border-brand-blue/20"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="p-6 border-b border-brand-blue/20 flex items-center justify-between bg-brand-charcoal">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center shadow-inner neon-glow-blue">
                  <Zap size={18} className="text-brand-blue" />
                </div>
                <h2 className="text-lg font-orbitron font-black uppercase tracking-widest text-brand-blue">AI Stylist</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:text-brand-blue"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((m, i) => (
                <motion.div 
                   key={i} 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${m.role === 'user' ? 'bg-brand-blue text-brand-black font-bold' : 'bg-brand-charcoal text-brand-white/90 border border-white/5'}`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-brand-charcoal p-4 rounded-2xl flex gap-1">
                    <motion.div className="w-1.5 h-1.5 bg-brand-blue rounded-full" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} />
                    <motion.div className="w-1.5 h-1.5 bg-brand-blue rounded-full" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} />
                    <motion.div className="w-1.5 h-1.5 bg-brand-blue rounded-full" animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-brand-charcoal border-t border-brand-blue/20">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for an outfit code..."
                  className="w-full bg-brand-black border border-white/10 rounded-full py-4 px-6 pr-14 text-sm focus:outline-none focus:border-brand-blue/50 transition-colors"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 p-2.5 bg-brand-blue text-brand-black rounded-full hover:bg-brand-white transition-colors"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [showLoading, setShowLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStylistOpen, setIsStylistOpen] = useState(false);

  return (
    <div className="relative min-h-screen selection:bg-brand-blue selection:text-brand-black">
      <AnimatePresence>
        {showLoading && <LoadingScreen onComplete={() => setShowLoading(false)} />}
      </AnimatePresence>

      {!showLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Navbar onCartOpen={() => setIsCartOpen(true)} onStylistOpen={() => setIsStylistOpen(true)} />
          
          {/* Main Content */}
          <main>
            {/* Hero Section */}
            <section className="relative min-h-screen grid grid-cols-12 overflow-hidden items-stretch">
              {/* Left Column: Content */}
              <div className="col-span-12 lg:col-span-6 flex flex-col justify-center px-6 lg:px-20 pt-32 pb-20 relative z-10 bg-brand-black">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1 }}
                >
                  <span className="inline-block px-4 py-1 border border-brand-blue text-brand-blue text-[10px] tracking-[0.3em] uppercase rounded-full mb-10 font-bold">
                    SYSTEM_v2.5 // NEW ERA 2025
                  </span>
                  <h1 className="text-[70px] md:text-[110px] leading-[0.85] font-black tracking-tighter uppercase mb-8">
                    Future<br/>
                    <span className="stroke-text">Of</span><br/>
                    Street
                  </h1>
                  <p className="max-w-md text-sm md:text-base opacity-60 leading-relaxed font-light tracking-wide lg:pr-12">
                    Merging artificial intelligence with avant-garde tailoring. VYRON isn't just clothing; it's a digital-physical synthesis for the next generation of urban explorers.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-12">
                    <button className="px-12 py-5 bg-brand-white text-brand-black text-[12px] font-black uppercase tracking-[0.2em] rounded-none hover:bg-brand-blue transition-all transform hover:-translate-y-1">
                      Shop Now
                    </button>
                    <button className="px-12 py-5 border border-white/20 text-brand-white text-[12px] font-black uppercase tracking-[0.2em] rounded-none hover:border-brand-blue hover:text-brand-blue transition-all">
                      Explore Drops
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Visual */}
              <div className="col-span-12 lg:col-span-6 relative flex items-center justify-center min-h-[500px] lg:min-h-screen bg-brand-charcoal overflow-hidden pt-20 lg:pt-0">
                <motion.div 
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 z-0"
                >
                  <img 
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2000" 
                    className="w-full h-full object-cover grayscale opacity-40 mix-blend-overlay"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-brand-black/50 via-transparent to-transparent" />
                </motion.div>

                {/* Editorial Visual Layout */}
                <div className="relative z-10 w-full max-w-md px-6">
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="relative aspect-[3/4] bg-neutral-900 border border-white/5 overflow-hidden group shadow-2xl"
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=2000" 
                      className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 group-hover:opacity-40 transition-opacity"></div>
                    
                    {/* Floating Product Label */}
                    <div className="absolute bottom-10 left-10 z-20">
                      <span className="text-[10px] text-white/50 block font-mono tracking-widest mb-1 italic">DROP_091 // NEO_TOKYO</span>
                      <span className="text-2xl font-black uppercase tracking-tighter block">CYBER-HOOD V3</span>
                      <span className="block text-brand-blue text-lg font-orbitron font-bold mt-1">$240.00</span>
                    </div>

                    {/* Cyber Accents */}
                    <div className="absolute top-1/4 left-0 w-20 h-px bg-brand-blue/50 shadow-[0_0_15px_rgba(0,194,255,0.5)] z-20"></div>
                  </motion.div>

                  {/* AI Stylist Prompt overlay */}
                  <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute -bottom-10 -right-4 lg:-right-12 w-64 bg-brand-black border border-white/10 p-6 backdrop-blur-xl shadow-2xl skew-x-[-2deg]"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse shadow-[0_0_8px_#00C2FF]"></div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-blue">AI STYLIST ACTIVE</span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-80 font-space uppercase italic">
                      "Analyzing silhouette... recommended integration: <span className="text-brand-blue font-bold">Aegis Shell v2</span> for optimal environment synchronization."
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <button onClick={() => setIsStylistOpen(true)} className="text-[10px] uppercase tracking-widest font-black text-brand-white/40 hover:text-brand-blue transition-colors">
                        ASK STYLIST...
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Stats / Features */}
            <section className="bg-brand-charcoal py-12 border-y border-white/5">
              <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "Active Drops", value: "24" },
                  { label: "Next Drop", value: "02:14:45" },
                  { label: "Global Users", value: "1.2M" },
                  { label: "AI Precision", value: "99.8%" }
                ].map((stat, i) => (
                  <div key={i} className="text-center group cursor-crosshair">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-brand-blue/50 mb-1">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-orbitron font-black group-hover:text-brand-blue transition-colors">{stat.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Trending Collection */}
            <section className="py-24 container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 tracking-tighter">Current <span className="text-brand-blue">Evolutions</span></h2>
                  <p className="text-brand-white/40 font-space uppercase tracking-widest text-xs">High-capacity streetwear designed for urban mobility.</p>
                </div>
                <a href="#" className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] hover:text-brand-blue transition-colors">
                  View All Collection <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>

            {/* AI Experience Banner */}
            <section className="py-24 relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-blue opacity-[0.03]" />
              <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="aspect-square rounded-3xl overflow-hidden bg-brand-charcoal shadow-2xl skew-y-3">
                        <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                     </div>
                     <div className="aspect-square rounded-3xl overflow-hidden bg-brand-charcoal shadow-2xl -translate-y-8 -skew-y-3">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                     </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-5xl font-black mb-8 leading-tight">AI GUIDED <br /> <span className="text-brand-blue">STYLING</span></h2>
                  <p className="text-brand-white/60 mb-10 text-lg leading-relaxed">
                    Upload your silhouette or type your vibe. Our neural net curates the perfect technical fit for your environment.
                  </p>
                  <ul className="space-y-6 mb-12">
                     <li className="flex items-start gap-4">
                        <div className="mt-1 p-1 rounded-full bg-brand-blue/20 text-brand-blue"><Zap size={14} /></div>
                        <div>
                          <h4 className="font-bold uppercase text-sm">Smart Recommendations</h4>
                          <p className="text-xs text-brand-white/40 mt-1 uppercase tracking-widest">Personalized based on your biometric data.</p>
                        </div>
                     </li>
                     <li className="flex items-start gap-4">
                        <div className="mt-1 p-1 rounded-full bg-brand-purple/20 text-brand-purple"><Zap size={14} /></div>
                        <div>
                          <h4 className="font-bold uppercase text-sm">Virtual Try-On</h4>
                          <p className="text-xs text-brand-white/40 mt-1 uppercase tracking-widest">Real-time AR projection into the digital void.</p>
                        </div>
                     </li>
                  </ul>
                  <button onClick={() => setIsStylistOpen(true)} className="px-10 py-5 bg-brand-blue text-brand-black font-black uppercase tracking-[0.2em] text-sm rounded-sm hover:bg-brand-white transition-all neon-glow-blue">
                    Launch Stylist
                  </button>
                </div>
              </div>
            </section>

            {/* Newsletter */}
            <section className="py-24 border-t border-white/5">
              <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto bg-brand-charcoal p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-blue to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
                  <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tighter">Join the <span className="stroke-text text-transparent border border-white/20" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Resistance</span></h2>
                  <p className="text-brand-white/50 uppercase tracking-[0.3em] text-[10px] mb-10">Get limited access to rare drops and system updates.</p>
                  <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <input 
                      type="email" 
                      placeholder="ACCESS_CODE@EMAIL.COM" 
                      className="flex-1 bg-brand-black border border-white/10 px-8 py-5 rounded-sm focus:outline-none focus:border-brand-blue/40 text-xs font-space tracking-widest text-center"
                    />
                    <button className="px-10 py-5 bg-brand-white text-brand-black font-black uppercase tracking-widest text-xs hover:bg-brand-blue transition-colors">
                      Initialize
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer className="bg-brand-black border-t border-white/10">
            <div className="h-20 lg:h-16 flex flex-col lg:flex-row items-center justify-between px-10 gap-4 py-4 lg:py-0">
              <div className="flex gap-8 items-center">
                <span className="text-[10px] opacity-40 uppercase tracking-widest">© 2026 VYRON LABS.</span>
                <span className="hidden md:inline text-[10px] text-brand-blue font-mono tracking-tighter uppercase">LATENCY: 12ms / SYSTEM: OPTIMAL</span>
              </div>
              <div className="flex gap-12 text-center md:text-left">
                <div className="flex flex-col">
                  <span className="text-[8px] opacity-40 uppercase tracking-tighter">Next Drop</span>
                  <span className="text-xs font-mono tracking-tighter">04:12:59:02</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] opacity-40 uppercase tracking-tighter">Stock Capacity</span>
                  <span className="text-xs font-mono text-orange-500 tracking-tighter">9.4% REMAINING</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] opacity-40 uppercase tracking-tighter">Social Connection</span>
                  <span className="text-xs font-mono uppercase underline decoration-brand-blue/30 tracking-tighter hover:text-brand-blue transition-colors">@VYRON.LABS</span>
                </div>
              </div>
            </div>
          </footer>

          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <StylistSidebar isOpen={isStylistOpen} onClose={() => setIsStylistOpen(false)} />
          
          {/* Floating Action Button */}
          <motion.button 
            onClick={() => setIsStylistOpen(true)}
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1 }}
            className="fixed bottom-8 right-8 w-14 h-14 bg-brand-blue text-brand-black rounded-full flex items-center justify-center shadow-2xl z-40 neon-glow-blue"
          >
            <MessageSquare size={24} />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
