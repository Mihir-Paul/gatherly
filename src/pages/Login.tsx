import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api.ts";
import Button from "../components/Button.tsx";
import { Calendar, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative p-12 overflow-hidden items-end">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,#3b82f6,transparent_40%)] opacity-30" />
        <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-24">
                <ArrowLeft className="w-4 h-4" /> Back to Explore
            </Link>
          <h1 className="text-6xl font-black text-white leading-tight mb-6">
            WELCOME<br />BACK.
          </h1>
          <p className="text-slate-400 text-lg max-w-sm">
            Log in to manage your events, respond to invitations, and see what's happening.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Gatherly</span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">Log in</h2>
          <p className="text-slate-500 mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-medium border border-red-100 italic">
                {error}
              </div>
            )}
            <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 h-14 text-slate-900 focus:outline-none focus:border-blue-600 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 h-14 text-slate-900 focus:outline-none focus:border-blue-600 transition-all"
                placeholder="••••••••"
              />
            </div>

            <Button isLoading={loading} className="w-full h-14 text-lg">Log in</Button>
          </form>

          <p className="text-center mt-8 text-slate-500 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
