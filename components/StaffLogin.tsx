import React, { useState } from 'react';

interface StaffLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

const StaffLogin: React.FC<StaffLoginProps> = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1212') {
      onLogin();
    } else {
      setError(true);
      setPassword('');
      // Shake animation effect could be added here
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cinnamon blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-coffee blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-cream rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <div className="p-8 text-center border-b border-stone-100">
            <h1 className="font-serif text-3xl text-coffee mb-2">Staff Access</h1>
            <p className="text-stone-500 text-sm tracking-widest uppercase">Cinnamon Lane Kitchen</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-400 tracking-wider mb-3 px-1">
                  Security Code
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  autoFocus
                  className={`w-full bg-stone-50 border ${error ? 'border-red-500 animate-shake' : 'border-stone-200'} rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-cinnamon/20 focus:border-cinnamon outline-none transition-all`}
                  placeholder="••••"
                />
                {error && (
                  <p className="text-red-500 text-xs font-bold mt-3 text-center uppercase tracking-tight">
                    Incorrect passkey. Please try again.
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-coffee text-white py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:bg-cinnamon transition-all transform active:scale-[0.98] shadow-lg shadow-coffee/10"
                >
                  Enter Kitchen
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full mt-4 text-stone-400 py-2 text-xs font-bold tracking-widest uppercase hover:text-coffee transition-colors"
                >
                  Return to Storefront
                </button>
              </div>
            </form>
          </div>

          <div className="p-4 bg-stone-50 border-t border-stone-100 text-center">
            <span className="text-[10px] text-stone-400 uppercase tracking-[0.2em]">Authorized Personnel Only</span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default StaffLogin;
