"use client";

import React, { useState } from 'react';
import { Calendar, Clock, Users, ChevronDown, ChevronUp } from 'lucide-react';

const Outing = ({ id, name, description, userEmail, startTime, endTime, participants }) => {
  const [showParticipants, setShowParticipants] = useState(false);

  const toggleParticipants = () => {
    setShowParticipants(!showParticipants);
  };

  // Format the dates for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="card-header bg-primary/5 pb-4">
        <h3 className="text-xl font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="card-content">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatDate(startTime)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>{formatDate(endTime)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Organized by: {userEmail}</span>
          </div>
        </div>
      </div>
      
      <div className="card-footer flex-col items-start border-t border-border pt-4">
        <button 
          onClick={toggleParticipants}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <Users className="h-4 w-4" />
          <span>
            {participants.length} Participants
          </span>
          {showParticipants ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {showParticipants && (
          <div className="mt-3 w-full space-y-1">
            {participants.map((participant, index) => (
              <div key={index} className="flex items-center gap-2 text-sm p-2 rounded-md bg-secondary/50">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  {participant.charAt(0).toUpperCase()}
                </div>
                <span>{participant}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Outing;