import { useState, useEffect } from 'react';
import { X, Monitor, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 border border-slate-100">
            {/* Monitor with Download Arrow Icon */}
            <div className="relative w-14 h-14 shrink-0">
              <div className="absolute inset-0 bg-slate-100 rounded-xl flex items-center justify-center">
                <Monitor size={28} className="text-slate-600" strokeWidth={1.5} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-blue rounded-full flex items-center justify-center shadow-lg">
                <ArrowDown size={14} className="text-white" strokeWidth={3} />
              </div>
            </div>
            
            <div className="flex-1">
              <p className="font-bold text-sm">Install App</p>
              <p className="text-xs text-slate-500">Add to home screen for quick access</p>
            </div>
            
            <button
              onClick={handleInstall}
              className="bg-brand-blue text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors active:scale-95"
            >
              Install
            </button>
            
            <button
              onClick={handleDismiss}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
