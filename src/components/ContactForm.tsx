import React, { useState } from 'react';
import { Mail, User, ShieldCheck, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SupportContactData } from '../types';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires (nom, email, message).");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('nom', name);
      formData.append('email', email);
      formData.append('message', message);

      const response = await fetch('https://formspree.io/f/mzdwjnkv', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Une erreur est survenue lors du transfert de votre demande au support.");
      }

      // Small delay for professional feeling
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      setErrorMsg(err.message || "Impossible de joindre le serveur de support actuellement.");
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setIsSuccess(false);
    setErrorMsg('');
  };

  return (
    <div id="contact-form-container" className="w-full">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            id="support-contact-form"
            key="contact-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-[#131526]/90 border border-slate-800/80 p-6 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden"
          >
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6c63ff]/5 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff6584]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

            <div className="flex flex-col space-y-2 border-b border-slate-800 pb-6">
              <h3 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Mail className="w-6 h-6 text-[#8c82ff]" />
                Contacter le Support Client
              </h3>
              <p className="text-sm text-slate-400">
                Une question ? Notre équipe d'experts de vérification sécurisée est à votre écoute 24h/24. Vos demandes sont prises en charge de manière confidentielle.
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div id="contact-error-alert" className="p-4 bg-red-950/40 border border-red-800/85 text-red-200 rounded-xl text-sm font-semibold">
                ⚠️ <span className="font-extrabold text-[#ff6584]">Erreur :</span> {errorMsg}
              </div>
            )}

            {/* Form grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8c82ff]" />
                  Votre nom de famille & prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:bg-slate-900/40 focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 rounded-xl text-white outline-none transition-all placeholder:text-slate-500 text-sm"
                />
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
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                Votre message <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 bg-slate-900 border border-slate-800 focus:bg-slate-900/40 focus:border-[#6c63ff] focus:ring-2 focus:ring-[#6c63ff]/20 rounded-xl text-white outline-none transition-all placeholder:text-slate-500 text-sm resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#6c63ff] to-[#ff6584] hover:opacity-90 disabled:opacity-55 text-white font-extrabold rounded-2xl cursor-pointer shadow-xl shadow-[#6c63ff]/15 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Envoi sécurisé en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 stroke-[2.5]" />
                    Envoyer au Support Technique
                  </>
                )}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            id="contact-success-box"
            key="contact-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#131526]/90 border border-[#10b981]/30 p-8 sm:p-14 rounded-3xl shadow-xl text-center space-y-6 max-w-xl mx-auto"
          >
            <div className="w-16 h-16 bg-[#10b981]/10 rounded-full flex items-center justify-center text-[#10b981] border border-[#10b981]/20 mx-auto">
              <CheckCircle2 className="w-9 h-9 stroke-[2]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Message transmis avec succès</h3>
              <p className="text-sm text-slate-400">
                Votre demande d'assistance d'ID #{Math.floor(1000 + Math.random() * 9000)} a été enregistrée de manière sécurisée.
              </p>
            </div>

            <div className="p-5 bg-slate-900/60 rounded-xl text-left border border-slate-800">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Notre équipe technique dédiée examine actuellement votre dossier. <strong className="text-white font-extrabold">Un agent du support de CouponCheck Pro vous contactera confidentiellement à l'adresse email indiquée ({email})</strong> afin de résoudre toute difficulté. Ce retour a généralement lieu sous une heure.
              </p>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-lg cursor-pointer transition-all text-xs border border-slate-800"
              >
                Envoyer un nouveau message
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
