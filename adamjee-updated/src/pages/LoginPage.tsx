import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          _id: data._id,
          name: data.name,
          email: data.email,
          role: data.role
        }));
        navigate('/account');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[#fafbfc] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background 3D Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#164475] rounded-full blur-[120px] opacity-20 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#164475] rounded-full blur-[120px] opacity-20 animate-float" style={{ animationDelay: '1s' }} />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-8 relative z-10 animate-scale-in">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#164475] to-[#164475] rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0a1b2d] tracking-tight">Welcome Back</h1>
          <p className="text-[#64748b] mt-2 font-medium">Sign in to your Adamjee account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl">
            <p className="text-sm font-bold text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="group">
            <label className="block text-xs font-bold text-[#64748b] uppercase tracking-widest mb-2 group-focus-within:text-[#164475] transition-colors">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-[#e2e8f0] bg-white/50 focus:bg-white focus:ring-2 focus:ring-[#164475]/30 focus:border-[#164475] outline-none transition-all text-[#0a1b2d] font-medium"
              placeholder="you@example.com"
            />
          </div>

          <div className="group">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-[#64748b] uppercase tracking-widest group-focus-within:text-[#164475] transition-colors">Password</label>
              <Link to="#" className="text-xs text-[#164475] hover:text-[#0a1b2d] font-bold transition-colors">Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-[#e2e8f0] bg-white/50 focus:bg-white focus:ring-2 focus:ring-[#164475]/30 focus:border-[#164475] outline-none transition-all text-[#0a1b2d] font-medium"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#0a1b2d] to-[#164475] hover:from-[#164475] hover:to-[#0a1b2d] text-white font-extrabold py-4 rounded-xl transition-all duration-300 shadow-xl hover:shadow-[#164475]/30 disabled:opacity-70 flex items-center justify-center group mt-4 hover:-translate-y-1"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="flex items-center gap-2">Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#e2e8f0] text-center">
          <p className="text-[#64748b] text-sm font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#164475] font-extrabold hover:text-[#0a1b2d] transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
