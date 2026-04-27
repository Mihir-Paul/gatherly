import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.tsx";
import EventCard from "../components/EventCard.tsx";
import Button from "../components/Button.tsx";
import { apiFetch } from "../lib/api.ts";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await apiFetch("/events");
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Revolutionizing Event Discovery
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tight mb-8"
          >
            EVERY MOMENT<br />
            <span className="text-blue-600 italic">DESERVES</span> A CROWD.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-slate-500 text-lg mb-10"
          >
            Gatherly is the premium platform for creating and joining meaningful events. 
            From underground gigs to tech meetups, find your tribe here.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto h-14 text-lg">
                Create Event <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </Link>
            <Link to="#events" onClick={(e) => {
                e.preventDefault();
                document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' });
            }}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 text-lg">
                Explore Events
                </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Events Grid */}
      <section id="events" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Upcoming Events</h2>
            <p className="text-slate-500">Discover experiences curated for you</p>
          </div>
          
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
            <button className="px-6 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium transition-all">All Events</button>
            <button className="px-6 py-2 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all">Today</button>
            <button className="px-6 py-2 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all">This Weekend</button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-[450px] animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No events found</h3>
            <p className="text-slate-500 mb-6">Be the first to create one!</p>
            <Link to="/create-event">
                <Button variant="outline">Create Event</Button>
            </Link>
          </div>
        )}
      </section>
      
      {/* Newsletter */}
      <section className="bg-slate-900 py-20 px-6 rounded-[3rem] mx-6 mb-20 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-blue-600/10 skew-x-[-20deg] translate-x-20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Don't miss a beat.</h2>
          <p className="text-slate-400 text-lg mb-10">Subscribe to our monthly digest of the hottest events happening around you.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 h-14 text-white focus:outline-none focus:border-blue-500 transition-all"
            />
            <Button size="lg" className="h-14">Subscribe</Button>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">Gatherly</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 Gatherly. Built for creators.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Twitter</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Instagram</a>
            <a href="#" className="text-slate-400 hover:text-slate-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple Calendar icon for fallback
function Calendar({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    );
}
