"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Clock, Heart, Share2 } from 'lucide-react';
import { Event } from '@/lib/types';

interface EventCardProps {
  event: Event;
  onLike: (eventId: string) => void;
  onView: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onLike, onView }) => {
  const [imageSrc, setImageSrc] = useState(event.imageUrl);
  const [imageError, setImageError] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageSrc('/images/default-event-image.jpg');
      setImageError(true);
    }
  };

  return (
    <div key={event.id} className="bg-card text-card-foreground rounded-lg border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(event)}>
      {/* Event Image */}
      <div className="relative h-48">
        <Image
          src={imageSrc}
          alt={event.name}
          fill
          className="object-cover"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={(e) => {
                e.stopPropagation();
                onLike(event.id);
            }}
            className={`p-2 rounded-full transition-colors ${
              event.isLiked
                ? 'bg-red-500/90 text-white'
                : 'bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm'
            }`}
          >
            <Heart className={`h-5 w-5 ${event.isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={(e) => e.stopPropagation()} 
            className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition-colors">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
        {event.isFree && (
          <div className="absolute top-3 left-3 bg-green-600/90 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            FREE
          </div>
        )}
      </div>

      {/* Event Content */}
      <div className="p-4">
        {/* Date and Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Clock className="h-4 w-4" />
          <span>{formatDate(event.startTime)} • {formatTime(event.startTime)}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-xl mb-2 line-clamp-2 leading-tight">{event.name}</h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          <span>{event.location}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.slice(0, 3).map((tag) => (
            <div key={tag} className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
              {tag}
            </div>
          ))}
        </div>
        
        <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
          <div>
              <p className="text-sm text-muted-foreground">Organized by</p>
              <p className="font-semibold text-base">{event.organizer}</p>
          </div>
          <div className="text-right">
              {event.isFree ? (
                  <p className="text-lg font-bold text-green-600">Free</p>
              ) : (
                  <p className="text-lg font-bold text-primary">{event.price}</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 