import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api.ts";
import Button from "../components/Button.tsx";
import { Calendar, ArrowLeft } from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
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
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative p-12 overflow-hidden items-end">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,#3b82f6,transparent_40%)] opacity-30" />
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-24">
            <ArrowLeft className="w-4 h-4" /> Back to Explore
          </Link>
          <h1 className="text-6xl font-black text-white leading-tight mb-6">
            START YOUR<br />JOURNEY.
          </h1>
          <p className="text-slate-400 text-lg max-w-sm">
            Join thousands of event creators and enthusiasts. Experience life, together.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Create account</h2>
          <p className="text-slate-500 mb-8">Join the Gatherly community today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-medium border border-red-100 italic">
                {error}
              </div>
            )}
            <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 h-14 text-slate-900 focus:outline-none focus:border-blue-600 transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 h-14 text-slate-900 focus:outline-none focus:border-blue-600 transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5 focus-within:text-blue-600 transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 h-14 text-slate-900 focus:outline-none focus:border-blue-600 transition-all"
                placeholder="Min 6 characters"
                minLength={6}
              />
            </div>

            <Button isLoading={loading} className="w-full h-14 text-lg">Sign up</Button>
          </form>

          <p className="text-center mt-8 text-slate-500 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
