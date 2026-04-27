import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../lib/api.ts";
import Navbar from "../components/Navbar.tsx";
import Button from "../components/Button.tsx";
import QRCode from "qrcode";
import { format } from "date-fns";
import { ArrowLeft, Download, MapPin, Calendar, User } from "lucide-react";
import { motion } from "motion/react";

export default function Ticket() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          navigate("/login");
          return;
        }
        setUser(JSON.parse(storedUser));

        const eventData = await apiFetch(`/events/${id}`);
        setEvent(eventData);

        // Generate QR Code
        const ticketInfo = JSON.stringify({
          ticketId: `${id}-${JSON.parse(storedUser).id}`,
          event: eventData.title,
          attendee: JSON.parse(storedUser).name
        });
        const url = await QRCode.toDataURL(ticketInfo, {
          width: 300,
          margin: 2,
          color: { dark: "#0f172a", light: "#ffffff" }
        });
        setQrCodeData(url);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold text-slate-400 italic">Generating your ticket...</div>;
  if (!event) return <div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold text-red-400">Error generating ticket</div>;

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-6 pt-32">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-8 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Event
        </button>

        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 border border-white"
        >
          {/* Ticket Header */}
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-20 rounded-full translate-x-10 -translate-y-10" />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Official Admission</p>
                <h1 className="text-3xl font-black tracking-tight uppercase leading-none">{event.title}</h1>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="mt-10 flex flex-wrap gap-8 relative z-10">
                <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Date</p>
                    <p className="text-sm font-bold">{format(new Date(event.date), "MMM d, yyyy")}</p>
                </div>
                <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Time</p>
                    <p className="text-sm font-bold">{format(new Date(event.date), "h:mm a")}</p>
                </div>
                <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Location</p>
                    <p className="text-sm font-bold truncate max-w-[150px]">{event.location}</p>
                </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-10 flex flex-col items-center">
            <div className="w-full flex items-center justify-center mb-10 pt-4 relative">
                <div className="absolute left-[-40px] w-5 h-10 bg-slate-100 rounded-r-full border-y border-r border-slate-200" />
                <div className="absolute right-[-40px] w-5 h-10 bg-slate-100 rounded-l-full border-y border-l border-slate-200" />
                <div className="border-t-2 border-dashed border-slate-100 w-full" />
            </div>

            <div className="text-center mb-10">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Attendee</p>
                <h3 className="text-2xl font-black text-slate-900 uppercase">{user.name}</h3>
                <p className="text-slate-400 text-xs font-semibold">{user.email}</p>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-10">
              {qrCodeData && (
                <img src={qrCodeData} alt="Ticket QR Code" className="w-48 h-48 mix-blend-multiply" />
              )}
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-3">
                <Button variant="primary" className="flex-1 h-14" onClick={() => window.print()}>
                    <Download className="w-4 h-4 mr-2" /> Print Ticket
                </Button>
                <Button variant="outline" className="flex-1 h-14" onClick={() => navigate("/")}>
                   Explore more
                </Button>
            </div>
            <p className="mt-8 text-[10px] text-slate-300 font-bold uppercase tracking-widest">Powered by Gatherly Engine • Security ID: AIS-{id?.slice(-6)}</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
