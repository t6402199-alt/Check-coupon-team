import React, { useState } from 'react';
import { Menu, X, ShieldCheck, Mail, Home, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  activeTab: 'accueil' | 'verification' | 'contact';
  setActiveTab: (tab: 'accueil' | 'verification' | 'contact') => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'accueil' as const, label: 'Accueil', icon: Home },
    { id: 'verification' as const, label: 'Vérification', icon: ShieldCheck },
    { id: 'contact' as const, label: 'Contact Support', icon: Mail },
  ];

  const handleNavClick = (tabId: 'accueil' | 'verification' | 'contact') => {
    setActiveTab(tabId);
    setIsOpen(false);
    
    // Smooth scroll to top when changing page tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0d0f20]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu on Left */}
          <button
            id="menu-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
            aria-label="Menu principal"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('accueil')}>
            <div className="w-9 h-9 bg-gradient-to-br from-[#6c63ff] to-[#ff6584] rounded-lg flex items-center justify-center shadow-lg shadow-[#6c63ff]/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-[#6c63ff] via-[#ff6584] to-[#43e97b] bg-clip-text text-transparent">
              CouponCheck Pro
            </span>
          </div>
        </div>

        {/* Desktop Quick Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-[#14172a] p-1 rounded-full border border-slate-800/80">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`desktop-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#6c63ff] text-white shadow-md shadow-[#6c63ff]/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/55'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* High-trust Top Badge */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#10b981]/10 text-[#047857] border border-[#10b981]/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Certifié SSL 256-bit
          </span>
        </div>
      </nav>

      {/* Slide-out Sidebar Drawer (from Left) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              id="sidebar-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/85 z-50 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              id="sidebar-menu-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 bg-[#0d0f20] z-50 shadow-2xl border-r border-slate-800 flex flex-col pt-4"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between px-6 pb-6 border-b border-slate-800/85">
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg text-white">Navigation</span>
                  <span className="text-xs text-slate-400">Portail Privé CouponCheck</span>
                </div>
                <button
                  id="menu-close-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items list */}
              <div className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-nav-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#6c63ff] to-[#ff6584]/80 text-white shadow-lg shadow-[#6c63ff]/30 font-bold'
                          : 'text-slate-300 hover:text-white hover:bg-[#14172a] font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-[#14172a]'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sticky bottom information */}
              <div className="p-6 border-t border-slate-800 bg-[#14172a] space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#6c63ff]/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#8c82ff]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Vérification Sécurisée</h4>
                    <p className="text-xs text-slate-400">Algorithme de validation 2026</p>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal text-center bg-[#0d0f20]/65 p-2.5 rounded-lg">
                  © 2026 CouponCheck Pro. Tous droits réservés. Vos validations sont chiffrées de bout en bout de manière strictement confidentielle.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
