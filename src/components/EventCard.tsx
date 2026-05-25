import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "motion/react";
import React from "react";

interface EventCardProps {
  key?: React.Key;
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl?: string | null;
    creator: { name: string };
    _count: { rsvps: number };
  };
}

export default function EventCard({ event }: EventCardProps) {
  const formattedDate = format(new Date(event.date), "EEE, MMM do • h:mm a");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/events/${event.id}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          {event.imageUrl ? (
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-50">
                <Calendar className="w-12 h-12 text-slate-200" />
            </div>
          )}
          <div className="absolute top-4 left-4">
            <span className="glass px-3 py-1 rounded-full text-xs font-semibold text-slate-900 shadow-sm">
                By {event.creator.name}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-[13px] font-semibold">{formattedDate}</span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          
          <p className="text-slate-500 text-sm line-clamp-2 mb-6 min-h-[40px]">
            {event.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-600">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-medium truncate max-w-[120px]">{event.location}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-slate-600">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">{event._count.rsvps} going</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
