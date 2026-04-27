import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.tsx";
import Button from "../components/Button.tsx";
import { apiFetch } from "../lib/api.ts";
import { Calendar, MapPin, Users, Share2, ArrowLeft, CheckCircle2, Mail, MessageSquare, Zap, Copy } from "lucide-react";
import { format } from "date-fns";
import { motion } from "motion/react";
import QRCode from "qrcode";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [isRsvpd, setIsRsvpd] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [qrCode, setQrCode] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await apiFetch(`/events/${id}`);
        setEvent(data);
        
        // Generate QR code for event URL
        const eventUrl = `${window.location.origin}/events/${id}`;
        const qrDataUrl = await QRCode.toDataURL(eventUrl);
        setQrCode(qrDataUrl);
        
        const user = localStorage.getItem("user");
        if (user) {
          const userId = JSON.parse(user).id;
          setIsRsvpd(data.rsvps.some((r: any) => r.userId === userId));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  const handleRsvp = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setRsvpLoading(true);
    try {
      await apiFetch(`/events/${id}/rsvp`, { method: "POST" });
      setIsRsvpd(true);
      setEvent({ ...event, _count: { ...event._count, rsvps: event._count.rsvps + 1 } });
    } catch (err: any) {
        alert(err.message);
    } finally {
      setRsvpLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = `You're invited to: ${event.title}`;
    const body = `Check out this event: ${window.location.href}\n\n${event.title}\n${format(new Date(event.date), "EEEE, MMMM do, yyyy")}\n${event.location}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareViaWhatsApp = () => {
    const text = `Check out this event: ${event.title}! 🎉\n\n📅 ${format(new Date(event.date), "EEEE, MMMM do, yyyy")}\n📍 ${event.location}\n\nJoin me: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareViaTwitter = () => {
    const text = `I'm attending "${event.title}" 🎉\n\n📅 ${format(new Date(event.date), "MMMM do, yyyy")}\n📍 ${event.location}\n\nJoin me: ${window.location.href}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, "_blank");
  };

  const downloadCal = () => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    const formatICSDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, "");
    
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      `SUMMARY:${event.title}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `LOCATION:${event.location}`,
      `DESCRIPTION:${event.description}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-400">Opening Event...</div>;
  if (!event) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-red-400">Event Not Found</div>;

  return (
    <div className="min-h-screen bg-white pb-32">
      <Navbar />

      {/* Hero Header */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-10 max-w-7xl mx-auto md:left-1/2 md:-translate-x-1/2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <button 
                onClick={() => navigate(-1)} 
                className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 font-medium text-sm transition-colors"
                >
                <ArrowLeft className="w-4 h-4" /> Go back
                </button>
                <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4 leading-[0.9]">
                {event.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white/80">
                    <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-400" /> {format(new Date(event.date), "EEEE, MMMM do, yyyy")}</div>
                    <div className="flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-400" /> {event.location}</div>
                </div>
            </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 mt-12 grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          {/* About */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6">About the Event</h2>
            <div className="text-xl text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
              {event.description}
            </div>
          </section>

          {/* Attendees */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Looking Forward To ({event._count.rsvps})</h2>
            <div className="flex flex-wrap gap-4">
                {event.rsvps.length > 0 ? (
                    event.rsvps.map((rsvp: any) => (
                        <div key={rsvp.id} className="flex flex-col items-center gap-2">
                             <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl border border-slate-200">
                                {rsvp.user.name.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-slate-500">{rsvp.user.name.split(' ')[0]}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-400 italic">No one here yet. Be the first!</p>
                )}
            </div>
          </section>
        </div>

        {/* Sidebar / Sidebar Sticky */}
        <div className="relative">
          <div className="sticky top-32 bg-slate-50 p-8 rounded-[2rem] border border-slate-200 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
                    <p className="text-lg font-bold text-slate-900">Registration Open</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-2xl">
                    <Users className="w-6 h-6 text-blue-600" />
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center italic">Join the experience</p>
                {isRsvpd ? (
                    <Link to={`/events/${id}/ticket`} className="block">
                        <Button variant="secondary" className="w-full h-16 text-lg border-2 border-slate-200">
                            <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" /> View My Ticket
                        </Button>
                    </Link>
                ) : (
                    <Button 
                        onClick={handleRsvp} 
                        isLoading={rsvpLoading}
                        className="w-full h-16 text-lg shadow-xl shadow-blue-100"
                    >
                        RSVP Now
                    </Button>
                )}
                
                <Button variant="outline" className="w-full h-16 text-lg" onClick={downloadCal}>
                    <Calendar className="w-5 h-5 mr-2" /> Add to Calendar
                </Button>
                
                <Button variant="outline" className="w-full h-16 text-lg" onClick={() => setShowShareModal(true)}>
                    <Share2 className="w-5 h-5 mr-2" /> Share Event
                </Button>
            </div>

            <div className="pt-6 border-t border-slate-200">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Hosted by</p>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold">
                        {event.creator.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 leading-none mb-1">{event.creator.name}</p>
                        <p className="text-xs text-slate-500 font-medium">Official Host</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-xl"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Share This Event</h2>
            
            {/* QR Code */}
            {qrCode && (
              <div className="flex justify-center mb-8 p-4 bg-slate-50 rounded-xl">
                <img src={qrCode} alt="Event QR Code" className="w-40 h-40" />
              </div>
            )}
            
            {/* Copy Link */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl">
                <input 
                  type="text" 
                  value={window.location.href} 
                  readOnly
                  className="flex-1 bg-transparent text-sm text-slate-600 outline-none"
                />
                <button
                  onClick={copyLink}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-slate-400" />}
                </button>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="space-y-3 mb-8">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Share On</p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={shareViaEmail}
                >
                  <Mail className="w-4 h-4 mr-2" /> Email
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={shareViaWhatsApp}
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={shareViaTwitter}
                >
                  <Zap className="w-4 h-4 mr-2" /> Twitter
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={shareViaFacebook}
                >
                  <Share2 className="w-4 h-4 mr-2" /> Facebook
                </Button>
              </div>
            </div>

            <Button 
              variant="ghost"
              className="w-full"
              onClick={() => setShowShareModal(false)}
            >
              Close
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
