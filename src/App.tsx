import { useState, useEffect } from 'react';
import { 
  Search, 
  Scan, 
  Users, 
  Receipt, 
  Smartphone, 
  CreditCard, 
  History, 
  Gift, 
  Home, 
  ArrowUpRight, 
  ArrowDownLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  X,
  CheckCircle2,
  ArrowLeft,
  Filter,
  Download,
  QrCode,
  Phone,
  Zap,
  Tv,
  Wifi,
  Fingerprint,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';

// Mock Data
const TRANSACTIONS = [
  { id: 1, name: 'Starbucks Coffee', amount: -5.40, date: 'Today, 10:24 AM', type: 'debit', category: 'Food' },
  { id: 2, name: 'Alice Johnson', amount: 25.00, date: 'Yesterday, 6:15 PM', type: 'credit', category: 'Transfer' },
  { id: 3, name: 'Electric Bill', amount: -84.20, date: 'Mar 8', type: 'debit', category: 'Bills' },
  { id: 4, name: 'Amazon Store', amount: -12.99, date: 'Mar 7', type: 'debit', category: 'Shopping' },
  { id: 5, name: 'Bob Smith', amount: 15.00, date: 'Mar 6', type: 'credit', category: 'Transfer' },
  { id: 6, name: 'Netflix Subscription', amount: -15.99, date: 'Mar 5', type: 'debit', category: 'Entertainment' },
  { id: 7, name: 'Salary Deposit', amount: 3200.00, date: 'Mar 1', type: 'credit', category: 'Income' },
  { id: 8, name: 'Uber Ride', amount: -22.50, date: 'Feb 28', type: 'debit', category: 'Travel' },
  { id: 9, name: 'Grocery Mart', amount: -65.30, date: 'Feb 27', type: 'debit', category: 'Food' },
  { id: 10, name: 'Charlie Brown', amount: 10.00, date: 'Feb 25', type: 'credit', category: 'Transfer' },
];

const CONTACTS = [
  { id: 1, name: 'Alice', initial: 'A', color: 'bg-blue-500' },
  { id: 2, name: 'Bob', initial: 'B', color: 'bg-green-500' },
  { id: 3, name: 'Charlie', initial: 'C', color: 'bg-purple-500' },
  { id: 4, name: 'David', initial: 'D', color: 'bg-orange-500' },
  { id: 5, name: 'Eve', initial: 'E', color: 'bg-pink-500' },
];

type Tab = 'home' | 'rewards' | 'history' | 'more';

export default function App() {
  const [isAppLocked, setIsAppLocked] = useState(true);
  const [appPin, setAppPin] = useState('');
  const [currentTab, setCurrentTab] = useState<Tab>('home');
  const [isPaying, setIsPaying] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isRecharging, setIsRecharging] = useState(false);
  const [isManualInput, setIsManualInput] = useState(false);
  const [manualType, setManualType] = useState<'number' | 'name'>('number');
  const [manualValue, setManualValue] = useState('');
  const [paymentStep, setPaymentStep] = useState<'input' | 'auth' | 'processing' | 'success'>('input');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(CONTACTS[0]);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'paid' | 'received'>('all');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // PWA Install Logic
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  // Sound Effect for successful payment
  useEffect(() => {
    if (paymentStep === 'success') {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Audio playback failed:', err));
    }
  }, [paymentStep]);

  const handlePay = () => {
    if (!amount) return;
    setPaymentStep('auth');
  };

  const confirmAuth = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        setIsPaying(false);
        setPaymentStep('input');
        setAmount('');
        setPin('');
        setManualValue('');
      }, 2000);
    }, 1500);
  };

  const startManualPay = (type: 'number' | 'name') => {
    setManualType(type);
    setIsManualInput(true);
  };

  const confirmManualPay = () => {
    if (!manualValue) return;
    setSelectedContact({
      name: manualValue,
      initial: manualValue.charAt(0).toUpperCase(),
      color: manualType === 'number' ? 'bg-slate-700' : 'bg-indigo-600',
      isManual: true,
      type: manualType
    });
    setIsManualInput(false);
    setIsPaying(true);
  };

  const filteredTransactions = TRANSACTIONS.filter(tx => {
    if (historyFilter === 'paid') return tx.amount < 0;
    if (historyFilter === 'received') return tx.amount > 0;
    return true;
  });

  if (isAppLocked) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-brand-surface font-sans flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-12 text-center"
        >
          <div className="space-y-4">
            <div className="w-20 h-20 bg-brand-blue rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-100">
              <Lock size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Google Pay</h1>
            <p className="text-slate-500 font-medium">Locked for your security</p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    appPin.length >= i ? 'bg-brand-blue border-brand-blue scale-110' : 'border-slate-300'
                  }`}
                ></div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-[280px] mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button 
                  key={num}
                  onClick={() => appPin.length < 4 && setAppPin(prev => prev + num)}
                  className="h-16 rounded-2xl bg-white shadow-sm font-bold text-2xl text-slate-700 hover:bg-slate-50 active:scale-90 transition-all"
                >
                  {num}
                </button>
              ))}
              <button 
                onClick={() => setAppPin('')}
                className="h-16 rounded-2xl bg-white shadow-sm font-medium text-sm text-slate-500 hover:bg-slate-50 active:scale-90 transition-all"
              >
                Clear
              </button>
              <button 
                onClick={() => appPin.length < 4 && setAppPin(prev => prev + '0')}
                className="h-16 rounded-2xl bg-white shadow-sm font-bold text-2xl text-slate-700 hover:bg-slate-50 active:scale-90 transition-all"
              >
                0
              </button>
              <button 
                onClick={() => appPin.length > 0 && setAppPin(prev => prev.slice(0, -1))}
                className="h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-500 hover:bg-slate-50 active:scale-90 transition-all"
              >
                <ArrowLeft size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => appPin.length === 4 && setIsAppLocked(false)}
                disabled={appPin.length < 4}
                className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
              >
                Unlock with PIN
              </button>
              
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button 
                onClick={() => setIsAppLocked(false)}
                className="w-full bg-white border-2 border-slate-100 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                <Fingerprint size={28} className="text-brand-blue" />
                Unlock with Fingerprint
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-brand-surface pb-24 font-sans relative overflow-hidden">
      <AnimatePresence mode="wait">
        {currentTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full"
          >
            {/* Header */}
            <header className="sticky top-0 z-10 bg-brand-surface/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-sm flex-1 mr-4">
                <Search size={20} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Pay friends and businesses" 
                  className="bg-transparent border-none outline-none text-sm w-full"
                />
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white font-bold shadow-sm cursor-pointer">
                JD
              </div>
            </header>

            <main className="px-4 py-6 space-y-8">
              {/* PWA Install Banner */}
              {showInstallBanner && (
                <motion.section 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-indigo-600 rounded-3xl p-6 text-white flex items-center justify-between shadow-lg shadow-indigo-200"
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">Install GPay Clone</h3>
                    <p className="text-indigo-100 text-xs">Access GPay faster from your home screen</p>
                  </div>
                  <button 
                    onClick={handleInstallApp}
                    className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform"
                  >
                    Install
                  </button>
                </motion.section>
              )}

              {/* Balance Card */}
              <section className="bg-white rounded-3xl p-6 card-shadow space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Total Balance</p>
                    <h2 className="text-3xl font-bold mt-1">$1,240.50</h2>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-xl">
                    <CreditCard className="text-brand-blue" size={24} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-brand-blue text-white py-3 rounded-2xl font-semibold text-sm hover:bg-blue-700 transition-colors">
                    Add Money
                  </button>
                  <button className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-2xl font-semibold text-sm hover:bg-slate-200 transition-colors">
                    Transfer
                  </button>
                </div>
              </section>

              {/* Quick Actions */}
              <section className="grid grid-cols-4 gap-4">
                {[
                  { icon: Scan, label: 'Scan QR', color: 'text-blue-600', bg: 'bg-blue-100', action: () => setIsScanning(true) },
                  { icon: Phone, label: 'Pay Number', color: 'text-green-600', bg: 'bg-green-100', action: () => startManualPay('number') },
                  { icon: Users, label: 'Pay Name', color: 'text-orange-600', bg: 'bg-orange-100', action: () => startManualPay('name') },
                  { icon: Smartphone, label: 'Recharge', color: 'text-purple-600', bg: 'bg-purple-100', action: () => setIsRecharging(true) },
                ].map((action, idx) => (
                  <button 
                    key={idx} 
                    className="flex flex-col items-center gap-2 group"
                    onClick={action.action}
                  >
                    <div className={`${action.bg} ${action.color} p-4 rounded-2xl group-active:scale-95 transition-transform shadow-sm`}>
                      <action.icon size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{action.label}</span>
                  </button>
                ))}
              </section>

              {/* People */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">People</h3>
                  <button className="text-brand-blue text-sm font-semibold">View all</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  <button className="flex flex-col items-center gap-2 shrink-0">
                    <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                      <Plus size={24} />
                    </div>
                    <span className="text-xs font-medium text-slate-600">New</span>
                  </button>
                  {CONTACTS.map((contact) => (
                    <button 
                      key={contact.id} 
                      className="flex flex-col items-center gap-2 shrink-0"
                      onClick={() => {
                        setSelectedContact(contact);
                        setIsPaying(true);
                      }}
                    >
                      <div className={`w-14 h-14 rounded-full ${contact.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                        {contact.initial}
                      </div>
                      <span className="text-xs font-medium text-slate-600">{contact.name}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Recent Activity Mini */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Recent Activity</h3>
                  <button 
                    onClick={() => setCurrentTab('history')}
                    className="text-brand-blue text-sm font-semibold"
                  >
                    See history
                  </button>
                </div>
                <div className="space-y-3">
                  {TRANSACTIONS.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="bg-white p-4 rounded-2xl flex items-center justify-between card-shadow">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${tx.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'}`}>
                          {tx.amount > 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{tx.name}</p>
                          <p className="text-xs text-slate-400">{tx.date}</p>
                        </div>
                      </div>
                      <p className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </motion.div>
        )}

        {currentTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full min-h-screen bg-white"
          >
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 py-6 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-4">
                <button onClick={() => setCurrentTab('home')} className="p-1">
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-bold">Transaction History</h2>
              </div>
              <button className="p-2 bg-slate-50 rounded-full">
                <Download size={20} className="text-slate-600" />
              </button>
            </header>

            <div className="px-4 py-4 space-y-6">
              {/* Search & Filter */}
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-50 rounded-xl px-4 py-2 flex items-center gap-2">
                  <Search size={18} className="text-slate-400" />
                  <input type="text" placeholder="Search history" className="bg-transparent border-none outline-none text-sm w-full" />
                </div>
                <button className="p-2 bg-slate-50 rounded-xl">
                  <Filter size={20} className="text-slate-600" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                {['all', 'paid', 'received'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setHistoryFilter(f as any)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${
                      historyFilter === f ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Transaction List */}
              <div className="space-y-4">
                {filteredTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-2 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                        tx.amount > 0 ? 'bg-green-500' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {tx.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{tx.name}</p>
                        <p className="text-xs text-slate-400">{tx.date} • {tx.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-slate-400">Success</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {currentTab === 'more' && (
          <motion.div
            key="more"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full min-h-screen bg-brand-surface p-6 space-y-8"
          >
            <header className="flex items-center gap-4">
              <button onClick={() => setCurrentTab('home')} className="p-1">
                <ArrowLeft size={24} />
              </button>
              <h2 className="text-2xl font-bold">Settings & More</h2>
            </header>

            <div className="space-y-6">
              <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">App Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-brand-blue rounded-xl">
                        <Lock size={20} />
                      </div>
                      <span className="font-medium">App Lock</span>
                    </div>
                    <div className="w-12 h-6 bg-brand-blue rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                        <Zap size={20} />
                      </div>
                      <span className="font-medium">Notifications</span>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">PWA Features</h3>
                <div className="space-y-4">
                  <button 
                    onClick={handleInstallApp}
                    disabled={!deferredPrompt}
                    className="w-full flex items-center justify-between group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Download size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Install App</p>
                        <p className="text-xs text-slate-400">Add to your home screen</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </button>
                </div>
              </section>

              <section className="bg-white rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">About</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Version</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Build</span>
                    <span className="font-medium">2026.03.14</span>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-slate-100 px-8 py-4 flex justify-between items-center z-20">
        <button 
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'home' ? 'text-brand-blue' : 'text-slate-400'}`}
        >
          <Home size={24} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button 
          onClick={() => setCurrentTab('rewards')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'rewards' ? 'text-brand-blue' : 'text-slate-400'}`}
        >
          <Gift size={24} />
          <span className="text-[10px] font-medium">Rewards</span>
        </button>
        <button 
          onClick={() => setCurrentTab('history')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'history' ? 'text-brand-blue' : 'text-slate-400'}`}
        >
          <History size={24} />
          <span className="text-[10px] font-medium">History</span>
        </button>
        <button 
          onClick={() => setCurrentTab('more')}
          className={`flex flex-col items-center gap-1 ${currentTab === 'more' ? 'text-brand-blue' : 'text-slate-400'}`}
        >
          <MoreHorizontal size={24} />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </nav>

      {/* Manual Input Modal */}
      <AnimatePresence>
        {isManualInput && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-t-[32px] p-6 pb-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl">Pay by {manualType === 'number' ? 'Number' : 'Name'}</h3>
                <button 
                  onClick={() => setIsManualInput(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border border-slate-100">
                  {manualType === 'number' ? <Phone className="text-slate-400" size={24} /> : <Users className="text-slate-400" size={24} />}
                  <input 
                    type={manualType === 'number' ? 'tel' : 'text'} 
                    placeholder={manualType === 'number' ? 'Enter mobile number' : 'Enter recipient name'} 
                    value={manualValue}
                    onChange={(e) => setManualValue(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none font-bold text-lg"
                    autoFocus
                  />
                </div>

                <button 
                  onClick={confirmManualPay}
                  disabled={!manualValue}
                  className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Scanner Screen */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col"
          >
            <header className="p-6 flex justify-between items-center">
              <button onClick={() => setIsScanning(false)} className="p-2 bg-white/10 rounded-full">
                <X size={24} />
              </button>
              <h3 className="font-bold text-lg">Scan QR Code</h3>
              <button className="p-2 bg-white/10 rounded-full">
                <QrCode size={24} />
              </button>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
              <div className="relative w-64 h-64">
                {/* Scanner Frame */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-blue rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-blue rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-blue rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-blue rounded-br-lg"></div>
                
                {/* Scanning Line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-1 bg-brand-blue/50 shadow-[0_0_15px_rgba(26,115,232,0.8)] z-10"
                ></motion.div>

                <div className="w-full h-full bg-white/5 rounded-lg flex items-center justify-center">
                  <Scan size={48} className="text-white/20" />
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-slate-400">Align QR code within the frame to scan</p>
                <div className="bg-white p-6 rounded-3xl inline-block">
                  <QRCodeSVG value="https://gpay.clone/user/jdoe" size={120} />
                  <p className="text-slate-900 text-xs font-bold mt-4">MY QR CODE</p>
                </div>
              </div>
            </div>

            <footer className="p-8 flex justify-center gap-8">
              <button className="flex flex-col items-center gap-2">
                <div className="p-4 bg-white/10 rounded-2xl"><Users size={24} /></div>
                <span className="text-xs">Contacts</span>
              </button>
              <button className="flex flex-col items-center gap-2">
                <div className="p-4 bg-white/10 rounded-2xl"><Smartphone size={24} /></div>
                <span className="text-xs">Number</span>
              </button>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recharge Screen */}
      <AnimatePresence>
        {isRecharging && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-50 bg-brand-surface flex flex-col"
          >
            <header className="bg-white p-6 flex items-center gap-4 border-b border-slate-100">
              <button onClick={() => setIsRecharging(false)} className="p-1">
                <ArrowLeft size={24} />
              </button>
              <h3 className="font-bold text-xl">Recharge & Pay Bills</h3>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-8">
              {/* Search Number */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl card-shadow flex items-center gap-4">
                  <Phone className="text-slate-400" size={24} />
                  <input type="tel" placeholder="Enter mobile number" className="flex-1 bg-transparent border-none outline-none font-bold text-lg" />
                </div>
                <button className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-lg shadow-sm active:scale-95 transition-transform">
                  Proceed to Recharge
                </button>
              </div>

              {/* Categories */}
              <section className="space-y-4">
                <h4 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Categories</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { icon: Smartphone, label: 'Mobile', color: 'bg-blue-50 text-blue-600' },
                    { icon: Zap, label: 'Electricity', color: 'bg-yellow-50 text-yellow-600' },
                    { icon: Tv, label: 'DTH', color: 'bg-red-50 text-red-600' },
                    { icon: Wifi, label: 'Broadband', color: 'bg-green-50 text-green-600' },
                  ].map((cat, i) => (
                    <button key={i} className="flex flex-col items-center gap-2">
                      <div className={`${cat.color} p-4 rounded-2xl shadow-sm`}>
                        <cat.icon size={24} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Recent Recharges */}
              <section className="space-y-4">
                <h4 className="font-bold text-slate-500 text-sm uppercase tracking-wider">Recent Recharges</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Mom', number: '+1 555-0123', provider: 'Verizon' },
                    { name: 'Self', number: '+1 555-9876', provider: 'AT&T' },
                  ].map((r, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl flex items-center justify-between card-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                          {r.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{r.name}</p>
                          <p className="text-xs text-slate-400">{r.number} • {r.provider}</p>
                        </div>
                      </div>
                      <button className="text-brand-blue font-bold text-sm">Repeat</button>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal (Existing) */}
      <AnimatePresence>
        {isPaying && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-t-[32px] p-6 pb-10 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl">Pay</h3>
                <button 
                  onClick={() => setIsPaying(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {paymentStep === 'input' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full ${selectedContact.color} flex items-center justify-center text-white font-bold text-2xl shadow-sm`}>
                      {selectedContact.initial}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{selectedContact.name}</p>
                      <p className="text-sm text-slate-500">+1 (555) 000-0000</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center text-5xl font-bold text-slate-900">
                      <span className="text-2xl mr-1">$</span>
                      <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="bg-transparent border-none outline-none w-32 text-center"
                        autoFocus
                      />
                    </div>
                    <p className="text-sm text-slate-400 font-medium">Add a note</p>
                  </div>

                  <button 
                    onClick={handlePay}
                    disabled={!amount}
                    className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                  >
                    Pay ${amount || '0'}
                  </button>
                </div>
              )}

              {paymentStep === 'auth' && (
                <div className="space-y-8 py-4">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-brand-blue">
                      <Lock size={32} />
                    </div>
                    <h4 className="font-bold text-xl">Security Check</h4>
                    <p className="text-sm text-slate-500">Enter your 4-digit PIN or use Fingerprint</p>
                  </div>

                  <div className="flex justify-center gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                          pin.length >= i ? 'bg-brand-blue border-brand-blue scale-110' : 'border-slate-200'
                        }`}
                      ></div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button 
                        key={num}
                        onClick={() => pin.length < 4 && setPin(prev => prev + num)}
                        className="h-14 rounded-2xl bg-slate-50 font-bold text-xl hover:bg-slate-100 active:scale-90 transition-all"
                      >
                        {num}
                      </button>
                    ))}
                    <button 
                      onClick={() => setPin('')}
                      className="h-14 rounded-2xl bg-slate-50 font-medium text-sm hover:bg-slate-100 active:scale-90 transition-all"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={() => pin.length < 4 && setPin(prev => prev + '0')}
                      className="h-14 rounded-2xl bg-slate-50 font-bold text-xl hover:bg-slate-100 active:scale-90 transition-all"
                    >
                      0
                    </button>
                    <button 
                      onClick={() => pin.length > 0 && setPin(prev => prev.slice(0, -1))}
                      className="h-14 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 active:scale-90 transition-all"
                    >
                      <ArrowLeft size={20} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={confirmAuth}
                      disabled={pin.length < 4}
                      className="w-full bg-brand-blue text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                    >
                      Confirm PIN
                    </button>
                    
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-slate-100"></div>
                      <span className="flex-shrink mx-4 text-xs text-slate-400 font-medium uppercase tracking-widest">OR</span>
                      <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    <button 
                      onClick={confirmAuth}
                      className="w-full bg-white border-2 border-slate-100 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95"
                    >
                      <Fingerprint size={24} className="text-brand-blue" />
                      Use Fingerprint
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === 'processing' && (
                <div className="py-12 flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-slate-100 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-brand-blue border-t-transparent rounded-full animate-spin absolute top-0"></div>
                  </div>
                  <p className="font-bold text-lg animate-pulse">Processing payment...</p>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="py-12 flex flex-col items-center gap-6">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-500"
                  >
                    <CheckCircle2 size={80} />
                  </motion.div>
                  <div className="text-center space-y-1">
                    <p className="font-bold text-2xl">Payment Successful!</p>
                    <p className="text-slate-500">Sent ${amount} to {selectedContact.name}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
