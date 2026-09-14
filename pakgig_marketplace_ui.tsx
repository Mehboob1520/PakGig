import React, { useState, useMemo } from 'react';
import {
  Search, Shield, CheckCircle, Wallet, ArrowRight, Star, UserCheck, 
  Sparkles, Layers, DollarSign, ChevronRight, X, Upload, Copy, 
  Check, Lock, Menu, Heart, Zap, AlertCircle, FileText, TrendingUp
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: Layers },
  { id: 'web-dev', name: 'Web & App Dev', icon: Zap },
  { id: 'design', name: 'Graphics & Design', icon: Sparkles },
  { id: 'ai-tech', name: 'AI & Automation', icon: TrendingUp },
  { id: 'writing', name: 'Writing & Translation', icon: FileText }
];

const INITIAL_GIGS = [
  {
    id: 1,
    category: 'web-dev',
    title: 'I will build a high-converting Next.js & Tailwind CSS website for your startup',
    sellerName: 'Hamza Farooq',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    verified: true,
    badge: 'Level 2 Seller',
    rating: 4.9,
    reviewsCount: 128,
    startingPricePKR: 14000,
    startingPriceUSD: 50,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
    deliveryTime: '2 Days Delivery',
    revisions: 'Unlimited'
  },
  {
    id: 2,
    category: 'design',
    title: 'I will design a modern minimalist luxury logo and brand identity package',
    sellerName: 'Ayesha Malik',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    verified: true,
    badge: 'Top Rated',
    rating: 5.0,
    reviewsCount: 210,
    startingPricePKR: 8400,
    startingPriceUSD: 30,
    coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600',
    deliveryTime: '1 Day Delivery',
    revisions: '3 Revisions'
  },
  {
    id: 3,
    category: 'ai-tech',
    title: 'I will build custom OpenAI & Gemini AI chatbots with Python and LangChain',
    sellerName: 'Zain Ul Abideen',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    verified: true,
    badge: 'Pro Verified',
    rating: 4.8,
    reviewsCount: 64,
    startingPricePKR: 22400,
    startingPriceUSD: 80,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=600',
    deliveryTime: '3 Days Delivery',
    revisions: '5 Revisions'
  },
  {
    id: 4,
    category: 'web-dev',
    title: 'I will develop full-stack React & Node.js web applications with payment integration',
    sellerName: 'Usman Ali',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    verified: true,
    badge: 'Rising Talent',
    rating: 4.9,
    reviewsCount: 42,
    startingPricePKR: 28000,
    startingPriceUSD: 100,
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
    deliveryTime: '4 Days Delivery',
    revisions: 'Unlimited'
  },
  {
    id: 5,
    category: 'writing',
    title: 'I will write SEO-friendly tech blogs, articles, and high-converting landing copy',
    sellerName: 'Fatima Noor',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    verified: true,
    badge: 'Level 1 Seller',
    rating: 4.9,
    reviewsCount: 89,
    startingPricePKR: 5600,
    startingPriceUSD: 20,
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
    deliveryTime: '1 Day Delivery',
    revisions: '2 Revisions'
  },
  {
    id: 6,
    category: 'design',
    title: 'I will create interactive Figma UI/UX designs for iOS and Android mobile apps',
    sellerName: 'Bilal Ahmed',
    sellerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    verified: true,
    badge: 'Level 2 Seller',
    rating: 5.0,
    reviewsCount: 156,
    startingPricePKR: 16800,
    startingPriceUSD: 60,
    coverImage: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=600',
    deliveryTime: '2 Days Delivery',
    revisions: 'Unlimited'
  }
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalGig, setActiveModalGig] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [paymentChannel, setPaymentChannel] = useState('nayapay');
  const [transactionId, setTransactionId] = useState('');
  const [paymentProofUploaded, setPaymentProofUploaded] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredGigs = useMemo(() => {
    return INITIAL_GIGS.filter(gig => {
      const matchesCategory = selectedCategory === 'all' || gig.category === selectedCategory;
      const matchesSearch = gig.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            gig.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(key);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    if (!transactionId) return;
    setOrderSubmitted(true);
  };

  const resetOrderState = () => {
    setActiveModalGig(null);
    setTransactionId('');
    setPaymentProofUploaded(false);
    setOrderSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      
      {}
      <div className="bg-slate-900 text-white text-xs md:text-sm py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-[11px] border border-emerald-500/30 uppercase tracking-wider">
              Zero Budget Fair Marketplace
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Only <strong className="text-emerald-400 font-semibold">5% Platform Fee</strong> (vs Fiverr's 20%). Native payouts via NayaPay, JazzCash & EasyPaisa.
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> 100% CNIC Verified Freelancers
            </span>
          </div>
        </div>
      </div>

      {}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* PakGig Brand Logo */}
            <div className="flex items-center gap-6">
              <a href="#" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                  PG
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                    Pak<span className="text-emerald-600">Gig</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">Local Escrow • 5% Fee</span>
                </div>
              </a>

              {/* Desktop Search */}
              <div className="hidden lg:flex items-center relative w-80">
                <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search services or sellers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-sm rounded-full border border-transparent focus:border-emerald-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <a href="#explore" className="text-slate-600 hover:text-emerald-600 transition-colors">Explore Services</a>
              <a href="#why-us" className="text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-1">
                <span>Why PakGig</span>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">5% Fee</span>
              </a>
              <a href="#escrow-info" className="text-slate-600 hover:text-emerald-600 transition-colors">Local Escrow</a>
              
              <div className="h-4 w-px bg-slate-200"></div>

              <button 
                onClick={() => { setAuthMode('signin'); setShowAuthModal(true); }}
                className="text-slate-700 hover:text-emerald-600 font-semibold transition-colors"
              >
                Sign In
              </button>

              <button 
                onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/25 active:scale-95"
              >
                Join PakGig
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-3">
            <div className="relative w-full mb-2">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 text-sm rounded-lg border border-slate-200"
              />
            </div>
            <a href="#explore" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-600 font-medium">Explore Services</a>
            <a href="#why-us" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-600 font-medium">Why 5% Fee Matters</a>
            <a href="#escrow-info" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-slate-600 font-medium">Local Escrow Protection</a>
            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <button 
                onClick={() => { setAuthMode('signin'); setShowAuthModal(true); setMobileMenuOpen(false); }}
                className="w-1/2 py-2 border border-slate-300 font-semibold text-slate-700 rounded-lg text-sm"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setShowAuthModal(true); setMobileMenuOpen(false); }}
                className="w-1/2 py-2 bg-emerald-600 text-white font-semibold rounded-lg text-sm"
              >
                Join
              </button>
            </div>
          </div>
        )}
      </header>

      {}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 lg:py-24">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Headline Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Empowering Top Pakistani Tech Talent Globally</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Hire Verified Pakistani Freelancers on <span className="text-emerald-400 underline decoration-emerald-500/50">PakGig with Zero Overpriced Fees</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                PakGig empowers international & local buyers to hire CNIC-verified talent with a fair <strong className="text-emerald-400">5% platform fee</strong>, secured via native Pakistani escrow channels (NayaPay, JazzCash & EasyPaisa).
              </p>

              {/* Search Bar */}
              <div className="bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto lg:mx-0">
                <div className="flex items-center gap-3 px-3 w-full text-slate-800">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Try 'Web Development' or 'Logo Design'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2.5 text-sm sm:text-base focus:outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <button 
                  onClick={() => {
                    const el = document.getElementById('explore');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
                >
                  <span>Find Talent</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Tag Pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-300 pt-2">
                <span className="font-semibold text-slate-400">Popular Services:</span>
                {['Web Dev', 'Logo Design', 'AI Automation', 'SEO Writing'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      const el = document.getElementById('explore');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700/60 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Stat Highlight Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700/70 p-6 sm:p-8 space-y-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">CNIC Verified Sellers</h3>
                      <p className="text-xs text-slate-400">Authentic talent identity guarantee</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                    Active
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                    <span className="text-xs text-slate-400 block mb-1">Platform Commission</span>
                    <span className="text-2xl font-black text-emerald-400">5% Only</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Save 15% vs Fiverr</span>
                  </div>

                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
                    <span className="text-xs text-slate-400 block mb-1">Escrow Safety</span>
                    <span className="text-2xl font-black text-white">100% Secure</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Funds released on approval</span>
                  </div>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-800/40 p-4 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
                  <Wallet className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Instant native payouts directly into NayaPay, JazzCash, and EasyPaisa wallets.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {}
      <section id="why-us" className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-2">Fair Economy For Pakistani Talent</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why Buyers & Freelancers Choose PakGig
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/70 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Flat 5% Platform Fee</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Traditional platforms like Fiverr take 20% from freelancers. PakGig charges only 5% to keep operations running smoothly.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/70 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold mb-4">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Native Local Payouts</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                No foreign card hassle for local clients. Pay seamlessly using NayaPay IBAN, JazzCash, or EasyPaisa with instant proofing.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/70 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Local Escrow Guarantee</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Client funds are safely held in PakGig escrow until work is delivered and approved by the buyer.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/70 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold mb-4">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">CNIC Verified Badge</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sellers undergo CNIC identity checks to ensure authenticity, eliminating scam profiles and guaranteeing reliable work quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section id="explore" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Popular Services on PakGig
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Find top-rated Pakistani experts ready to deliver high quality work.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {filteredGigs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Services Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              We couldn't find any gigs matching your search "{searchQuery}". Try searching for another skill like 'Web' or 'Design'.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map((gig) => (
              <div 
                key={gig.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={gig.coverImage}
                    alt={gig.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {gig.badge}
                  </div>
                  <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-slate-600 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={gig.sellerAvatar}
                        alt={gig.sellerName}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-900">{gig.sellerName}</span>
                          {gig.verified && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" title="CNIC Verified Seller" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block">{gig.deliveryTime}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 hover:text-emerald-600 cursor-pointer transition-colors leading-snug">
                    {gig.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-900">{gig.rating}</span>
                    <span className="text-slate-400">({gig.reviewsCount} reviews)</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block">STARTING AT</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-black text-slate-900">PKR {gig.startingPricePKR.toLocaleString()}</span>
                        <span className="text-xs text-slate-400">(${gig.startingPriceUSD})</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveModalGig(gig)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95"
                    >
                      <span>Order via Escrow</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {}
      <section id="escrow-info" className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
              100% Protection For Buyer & Seller
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3">
              How PakGig Escrow Payment Works
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Simple 4-step workflow ensuring buyers get quality work and Pakistani freelancers get paid fairly.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-900 font-extrabold text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h3 className="font-bold text-white mb-2">Select & Pay Escrow</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Buyer deposits order funds into PakGig NayaPay IBAN or JazzCash escrow account and submits payment TRX ID.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-900 font-extrabold text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h3 className="font-bold text-white mb-2">Admin Verifies TRX</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                PakGig Admin verifies payment proof and marks status as 'In Progress'. Seller is notified to start work.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-900 font-extrabold text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h3 className="font-bold text-white mb-2">Work Delivery</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Freelancer completes work and uploads files to the platform dashboard for buyer review.
              </p>
            </div>

            <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 relative">
              <span className="w-8 h-8 rounded-full bg-emerald-500 text-slate-900 font-extrabold text-sm flex items-center justify-center mb-4">
                4
              </span>
              <h3 className="font-bold text-white mb-2">Instant 95% Payout</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Buyer approves delivery. PakGig deducts 5% platform fee and transfers 95% into seller's wallet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-16 bg-emerald-600 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-3xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
            Are You a Pakistani Freelancer? Stop Giving Away 20%!
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg mb-8 leading-relaxed">
            Join PakGig today. Get CNIC verified, enjoy a flat 5% platform commission, and receive direct payouts to your NayaPay, JazzCash or EasyPaisa account.
          </p>
          <button 
            onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-8 py-4 rounded-xl shadow-xl transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
          >
            <span>Start Selling on PakGig (5% Fee)</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-base">
                PG
              </div>
              <span className="text-lg font-bold text-white">PakGig</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Zero-budget, low-fee Pakistani freelance marketplace prioritizing local talent and secure escrow payouts.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-emerald-400">Web Development</a></li>
              <li><a href="#" className="hover:text-emerald-400">Graphic Design</a></li>
              <li><a href="#" className="hover:text-emerald-400">AI & Automation</a></li>
              <li><a href="#" className="hover:text-emerald-400">SEO Writing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Escrow Channels</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="text-slate-400">NayaPay (IBAN)</span></li>
              <li><span className="text-slate-400">JazzCash Merchant</span></li>
              <li><span className="text-slate-400">EasyPaisa Wallet</span></li>
              <li><span className="text-slate-400">Wise / Remitly Direct</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Compliance & FBR</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" /> FBR Active NTN Registered
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400">
                <Shield className="w-3.5 h-3.5" /> CNIC Identity Standard
              </li>
              <li className="text-slate-500 mt-2">© 2026 PakGig Inc. All rights reserved.</li>
            </ul>
          </div>

        </div>
      </footer>

      {}
      {activeModalGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-lg">PakGig Local Escrow Checkout</h3>
              </div>
              <button 
                onClick={resetOrderState}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {orderSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900">Payment Proof Submitted!</h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Your Transaction ID <strong className="text-slate-900">{transactionId}</strong> has been sent to PakGig admin for escrow verification. You will receive an update shortly.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={resetOrderState}
                      className="bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm"
                    >
                      Return to Marketplace
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex gap-4">
                    <img
                      src={activeModalGig.coverImage}
                      alt={activeModalGig.title}
                      className="w-20 h-20 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-2">{activeModalGig.title}</h4>
                      <p className="text-xs text-slate-500">Seller: <strong>{activeModalGig.sellerName}</strong> (CNIC Verified)</p>
                      <div className="flex items-center gap-2 text-xs pt-1">
                        <span className="font-bold text-emerald-600">PKR {activeModalGig.startingPricePKR.toLocaleString()}</span>
                        <span className="text-slate-400">(${activeModalGig.startingPriceUSD})</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 space-y-2 text-xs bg-white">
                    <div className="flex justify-between text-slate-600">
                      <span>Service Price:</span>
                      <span className="font-semibold text-slate-900">PKR {activeModalGig.startingPricePKR.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>PakGig Escrow Fee (5%):</span>
                      <span className="font-semibold text-emerald-600">Included in Price</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between text-sm font-bold text-slate-900">
                      <span>Total Deposit Required:</span>
                      <span className="text-emerald-600">PKR {activeModalGig.startingPricePKR.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Select Deposit Escrow Account:
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentChannel('nayapay')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          paymentChannel === 'nayapay'
                            ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-xs">NayaPay IBAN</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setPaymentChannel('jazzcash')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          paymentChannel === 'jazzcash'
                            ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-xs">JazzCash</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentChannel('easypaisa')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          paymentChannel === 'easypaisa'
                            ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 font-bold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="block text-xs">EasyPaisa</span>
                      </button>
                    </div>

                    <div className="bg-slate-900 text-white p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>PakGig Official Escrow Deposit Details:</span>
                        <span className="text-emerald-400 font-bold uppercase">{paymentChannel}</span>
                      </div>

                      {paymentChannel === 'nayapay' && (
                        <div className="space-y-1">
                          <div className="text-xs text-slate-300">Account Title: <strong>PakGig Escrow Admin</strong></div>
                          <div className="flex items-center justify-between bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                            <code className="text-xs font-mono text-emerald-400">PK00 NAYA 1234 5678 9012 3456</code>
                            <button
                              onClick={() => handleCopy('PK00 NAYA 1234 5678 9012 3456', 'iban')}
                              className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
                            >
                              {copiedAccount === 'iban' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedAccount === 'iban' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 pt-1">
                            *Overseas buyers can transfer via Wise / Remitly directly using this NayaPay IBAN.
                          </p>
                        </div>
                      )}

                      {paymentChannel === 'jazzcash' && (
                        <div className="space-y-1">
                          <div className="text-xs text-slate-300">JazzCash Title: <strong>PakGig Admin</strong></div>
                          <div className="flex items-center justify-between bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                            <code className="text-xs font-mono text-emerald-400">0300 1234567</code>
                            <button
                              onClick={() => handleCopy('03001234567', 'jazz')}
                              className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
                            >
                              {copiedAccount === 'jazz' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedAccount === 'jazz' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {paymentChannel === 'easypaisa' && (
                        <div className="space-y-1">
                          <div className="text-xs text-slate-300">EasyPaisa Title: <strong>PakGig Admin</strong></div>
                          <div className="flex items-center justify-between bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                            <code className="text-xs font-mono text-emerald-400">0345 1234567</code>
                            <button
                              onClick={() => handleCopy('03451234567', 'easy')}
                              className="text-xs text-slate-300 hover:text-white flex items-center gap-1"
                            >
                              {copiedAccount === 'easy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedAccount === 'easy' ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleOrderSubmit} className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Transaction Reference ID (TRX ID):
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 102938484930"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Payment Screenshot / Proof:
                      </label>
                      <div 
                        onClick={() => setPaymentProofUploaded(!paymentProofUploaded)}
                        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                          paymentProofUploaded 
                            ? 'border-emerald-500 bg-emerald-50/30 text-emerald-700' 
                            : 'border-slate-300 hover:border-emerald-500 text-slate-500'
                        }`}
                      >
                        <Upload className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                        <span className="text-xs block font-semibold">
                          {paymentProofUploaded ? '✓ Screenshot Attached (Click to change)' : 'Click to upload payment receipt screenshot'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 text-sm"
                    >
                      Submit Order & Lock Escrow
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 mb-6">
              <h3 className="text-xl font-bold text-slate-900">
                {authMode === 'signin' ? 'Welcome Back to PakGig' : 'Join PakGig Today'}
              </h3>
              <p className="text-xs text-slate-500">
                {authMode === 'signin' ? 'Sign in to manage orders & escrow balance' : 'Start buying or selling with a low 5% fee'}
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setShowAuthModal(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
                />
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">I want to join as a:</label>
                  <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-600">
                    <option value="seller">Freelancer / Seller (5% Fee)</option>
                    <option value="buyer">Client / Buyer</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm"
              >
                {authMode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
              {authMode === 'signin' ? (
                <span>
                  Don't have an account?{' '}
                  <button onClick={() => setAuthMode('signup')} className="text-emerald-600 font-bold hover:underline">
                    Sign Up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button onClick={() => setAuthMode('signin')} className="text-emerald-600 font-bold hover:underline">
                    Sign In
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}