import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.tsx";
import { apiFetch } from "../lib/api.ts";
import Button from "../components/Button.tsx";
import { Plus, Users, Calendar, TrendingUp, ChevronRight, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "motion/react";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboardData = await apiFetch("/users/dashboard");
        setData(dashboardData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await apiFetch(`/events/${id}`, { method: "DELETE" });
      setData({
        ...data,
        myEvents: data.myEvents.filter((e: any) => e.id !== id),
        analytics: {
            ...data.analytics,
            totalEventsCreated: data.analytics.totalEventsCreated - 1
        }
      });
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 animate-pulse shadow-md">Loading your workspace...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">My Workspace</h1>
            <p className="text-slate-500 font-medium">Manage your events and see your impact.</p>
          </div>
          <Link to="/create-event">
            <Button size="lg" className="h-14">
              <Plus className="w-5 h-5 mr-2" /> Create New Event
            </Button>
          </Link>
        </header>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="RSVPs Received" 
            value={data.analytics.totalRsvpsReceived} 
            icon={<Users className="w-5 h-5" />} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Events Created" 
            value={data.analytics.totalEventsCreated} 
            icon={<Calendar className="w-5 h-5" />} 
            color="bg-slate-900" 
          />
          <StatCard 
            title="Events Joined" 
            value={data.analytics.totalEventsJoined} 
            icon={<TrendingUp className="w-5 h-5" />} 
            color="bg-indigo-500" 
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* My Created Events */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Events You're Hosting</h2>
              <span className="text-sm font-medium text-slate-400">{data.myEvents.length} total</span>
            </div>

            {data.myEvents.length > 0 ? (
              <div className="space-y-4">
                {data.myEvents.map((event: any) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between hover:border-slate-400 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden hidden sm:block">
                        {event.imageUrl ? (
                          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Calendar className="w-6 h-6 text-slate-200" /></div>
                        )}
                      </div>
                      <div>
                        <Link to={`/events/${event.id}`} className="font-bold text-slate-900 hover:text-blue-600 transition-colors block mb-1">
                          {event.title}
                        </Link>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {format(new Date(event.date), "MMM d, yyyy")} • {event._count.rsvps} Attendees
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => handleDelete(event.id)}
                            className="p-3 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                        <Link to={`/events/${event.id}`}>
                            <button className="p-3 bg-slate-50 text-slate-900 rounded-xl hover:bg-slate-200 transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">You haven't created any events yet.</p>
              </div>
            )}
          </div>

          {/* Recently Joined */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Recently Joined</h2>
            
            {data.myRsvps.length > 0 ? (
              <div className="space-y-4">
                {data.myRsvps.map((rsvp: any) => (
                  <Link 
                    key={rsvp.id} 
                    to={`/events/${rsvp.event.id}`}
                    className="block p-5 bg-white rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <h4 className="font-bold text-slate-900 mb-1">{rsvp.event.title}</h4>
                    <p className="text-xs text-slate-500">Host: {rsvp.event.creator.name}</p>
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">Confirmed</span>
                        <span className="text-[10px] text-slate-400 font-medium">{format(new Date(rsvp.createdAt), "MMM d")}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-100 rounded-2xl">
                <p className="text-sm text-slate-400 italic">No RSVPs yet. Explore the community!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500`} />
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`p-3 rounded-2xl ${color} text-white`}>
          {icon}
        </div>
      </div>
      <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1 relative z-10">{title}</p>
      <h3 className="text-4xl font-black text-slate-900 relative z-10">{value}</h3>
    </div>
  );
}
