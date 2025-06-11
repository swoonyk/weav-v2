"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Clock, MapPin, Users, Tag, Share2 } from 'lucide-react';
import { Event } from '@/lib/types';

interface ViewEventModalProps {
  event: Event;
  onClose: () => void;
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({ event, onClose }) => {
  const [imageSrc, setImageSrc] = useState(event.imageUrl);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageSrc(event.imageUrl);
    setImageError(false);
  }, [event.imageUrl]);

  const handleImageError = () => {
    if (!imageError) {
      setImageSrc('/images/default-event-image.jpg');
      setImageError(true);
    }
  };

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
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm" onClick={onClose}>
      <div className="card w-full max-w-4xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <div className="card-header flex justify-between items-center">
          <h2 className="text-2xl font-bold">{event.name}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary/80"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="card-content space-y-4">
          <div className="relative h-64 bg-secondary rounded-lg overflow-hidden">
            <Image
              src={imageSrc}
              alt={event.name}
              fill
              className="object-cover"
              onError={handleImageError}
            />
            {event.isFree && (
              <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                FREE EVENT
              </div>
            )}
          </div>

          <p className="text-lg text-foreground">{event.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>
                {formatDate(event.startTime)} • {formatTime(event.startTime)} - 
                {formatTime(event.endTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>
                {event.attendeeCount} attending
                {event.maxAttendees && ` / ${event.maxAttendees} max`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              <span>Category: {event.category}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {event.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Organized by <span className="font-semibold text-foreground">{event.organizer}</span>
            </p>
            <p className="text-xl font-bold text-right mt-2">{event.price}</p>
          </div>
        </div>
        
        <div className="card-footer flex justify-between border-t">
          <button
            onClick={onClose}
            className="btn btn-outline"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: event.name,
                  text: event.description,
                  url: window.location.href, // Current page URL for sharing
                }).catch((error) => console.error('Error sharing:', error));
              } else {
                // Fallback for browsers that don't support Web Share API
                navigator.clipboard.writeText(window.location.href + '#' + event.id)
                  .then(() => alert('Event link copied to clipboard!'))
                  .catch((error) => console.error('Error copying link:', error));
              }
            }}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEventModal; 