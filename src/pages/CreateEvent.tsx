import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Button from "../components/Button.tsx";
import { apiFetch } from "../lib/api.ts";
import { Calendar, MapPin, Image as ImageIcon, Layout, ArrowLeft } from "lucide-react";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-6 pt-32">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-8 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100">
          <header className="mb-10 text-center">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Create New Event</h1>
            <p className="text-slate-500">Fill in the details to launch your experience.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-sm font-medium border border-red-100 italic">{error}</div>}

            <div className="space-y-6">
              {/* Event Title */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Layout className="w-4 h-4" /> Event Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Underground Techno Night"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 h-14 text-slate-900 focus:outline-none focus:border-blue-600 transition-all font-medium"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what makes this event special..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 focus:outline-none focus:border-blue-600 transition-all font-medium resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Calendar className="w-4 h-4" /> Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 h-14 text-slate-900 focus:outline-none focus:border-blue-600 transition-all font-medium"
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <MapPin className="w-4 h-4" /> Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Physical address or link"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 h-14 text-slate-900 focus:outline-none focus:border-blue-600 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <ImageIcon className="w-4 h-4" /> Header Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 h-14 text-slate-900 focus:outline-none focus:border-blue-600 transition-all font-medium"
                />
              </div>
            </div>

            <Button isLoading={loading} className="w-full h-16 text-lg font-bold shadow-lg shadow-blue-200">
                Launch Event 🔥
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
