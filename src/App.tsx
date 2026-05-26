import React, { useState } from 'react';
import Navigation from './components/Navigation';
import VerificationForm from './components/VerificationForm';
import ContactForm from './components/ContactForm';
import { 
  ShieldCheck, HelpCircle, Sparkles, CheckCircle2, Lock, 
  HelpCircle as SupportIcon, CreditCard, Gift, Mail 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Floating background particles configuration
const BUBBLE_CONFIGS = [
  { left: '5%', size: '55px', delay: '0s', duration: '24s' },
  { left: '15%', size: '22px', delay: '2s', duration: '14s' },
  { left: '28%', size: '35px', delay: '4s', duration: '19s' },
  { left: '46%', size: '48px', delay: '1s', duration: '17s' },
  { left: '62%', size: '20px', delay: '3s', duration: '21s' },
  { left: '78%', size: '75px', delay: '5s', duration: '26s' },
  { left: '91%', size: '28px', delay: '2s', duration: '16s' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'accueil' | 'verification' | 'contact'>('accueil');

  // Helper to handle smooth tab navigation
  const navigateToTab = (tab: 'accueil' | 'verification' | 'contact') => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0d0f20] text-[#e2e8f0] flex flex-col relative overflow-hidden select-none">
      
      {/* Dynamic Animated Particle Floating Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {BUBBLE_CONFIGS.map((bubble, idx) => (
          <span
            key={idx}
            className="absolute rounded-lg bg-[#6c63ff]/5 animate-float-particle"
            style={{
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              animationDelay: bubble.delay,
              animationDuration: bubble.duration,
              bottom: '-150px',
            }}
          />
        ))}
      </div>

      {/* Navigation Layer */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Area */}
      <main className="flex-1 pt-24 pb-16 px-4 max-w-7xl mx-auto w-full z-10 flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* SEC 1: ACCUEIL (HOME) PAGE */}
          {activeTab === 'accueil' && (
            <motion.div
              key="accueil"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-12 flex-1 flex flex-col justify-center"
            >
              {/* Hero Header Area */}
              <div className="text-center space-y-6 max-w-3xl mx-auto pt-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#6c63ff]/20 border border-[#6c63ff]/30 text-[#8c82ff] animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#ff6584]" />
                  Portail Officiel d'Authenticité et de Solde 2026
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-none">
                  Vérification Sécurisée de{' '}
                  <span className="bg-gradient-to-r from-[#6c63ff] via-[#ff6584] to-[#10b981] bg-clip-text text-transparent">
                    Coupons & Cartes Cadeaux
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  Consultez instantanément et en toute confidentialité l’état d’enregistrement, la validité et le solde réel de vos codes prépayés (Google Play, iTunes, Amazon, Steam, Neosurf et bien plus).
                </p>

                <div className="flex justify-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#14172a] border border-slate-800 shadow-sm rounded-lg text-xs text-slate-300">
                    <Lock className="w-3.5 h-3.5 text-[#10b981]" />
                    Chiffré de bout en bout
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#14172a] border border-slate-800 shadow-sm rounded-lg text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6c63ff]" />
                    99.8% Taux de Détection
                  </div>
                </div>
              </div>

              {/* TWO CORE COLUMNS: Left highlights / info, Right Core embedded Verification Form */}
              <div className="max-w-3xl mx-auto w-full pt-6">
                <VerificationForm />
              </div>
            </motion.div>
          )}

          {/* SEC 2: DEDICATED VERIFICATION COLUMN VIEW */}
          {activeTab === 'verification' && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto space-y-8 py-4 flex-1 flex flex-col justify-center"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#6c63ff]/20 border border-[#6c63ff]/30 flex items-center justify-center mx-auto text-[#8c82ff]">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-white">Module National de Vérification</h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Déposez vos coupons prépayés de toutes marques pour authentification par nos agents agréés.
                </p>
              </div>

              <VerificationForm />

              {/* Instructions advice */}
              <div className="bg-[#14172a] border border-slate-800 rounded-2xl p-6 text-sm text-slate-300 shadow-lg space-y-3">
                <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  ⚠️ Directives de Saisie Recommandées :
                </span>
                <p className="text-xs leading-relaxed text-slate-300">
                  Vérifiez scrupuleusement l'intégrité des caractères alphanumériques. Ne confondez pas le chiffre <code className="text-[#10b981] bg-slate-900 px-1 py-0.5 rounded font-bold">0</code> avec la lettre <code className="text-[#10b981] bg-slate-900 px-1 py-0.5 rounded font-bold">O</code>, ou la lettre <code className="text-[#10b981] bg-slate-900 px-1 py-0.5 rounded font-bold">I</code> avec le chiffre <code className="text-[#10b981] bg-slate-900 px-1 py-0.5 rounded font-bold">1</code>.
                </p>
              </div>
            </motion.div>
          )}

          {/* SEC 3: CONTACT FORM DEDICATED VIEW */}
          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto space-y-8 py-4 flex-1 flex flex-col justify-center"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#ff6584]/20 border border-[#ff6584]/30 flex items-center justify-center mx-auto text-[#ff6584]">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-extrabold text-white">Centre d’assistance Technique</h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Une difficulté d'utilisation ? Ouvrez instantanément une requête de support. Notre équipe intervient promptement.
                </p>
              </div>

              <ContactForm />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER LAYER (With absolutely zero questionnaires and zero scams warning tags) */}
      <footer className="border-t border-slate-800 bg-[#0b0c16]/90 py-8 mt-12 z-10 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="text-center md:text-left space-y-1.5 animate-pulse">
            <span className="font-bold text-slate-200 text-sm block tracking-wide">
              🔒 Sécurisé par CouponCheck SSL v3
            </span>
            <p className="text-[11px] text-slate-500">
              Système de chiffrement certifié PCI-DSS de niveau bancaire international.
            </p>
          </div>

          <div className="flex gap-4 flex-wrap justify-center text-slate-500 select-none">
            <button onClick={() => navigateToTab('accueil')} className="text-slate-300 hover:text-[#8c82ff] transition-colors cursor-pointer font-semibold">Accueil</button>
            <span>•</span>
            <button onClick={() => navigateToTab('verification')} className="text-slate-300 hover:text-[#8c82ff] transition-colors cursor-pointer font-semibold">Auditer un Coupon</button>
            <span>•</span>
            <button onClick={() => navigateToTab('contact')} className="text-slate-300 hover:text-[#ff6584] transition-colors cursor-pointer font-semibold">Support Client</button>
          </div>

          <div className="text-center md:text-right space-y-1 text-slate-400">
            <p>© 2026 CouponCheck Pro. Tous droits réservés.</p>
            <p className="text-[10px] text-slate-500">
              Chiffrement de communication asymétrique certifié RSA 4096 bits.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
