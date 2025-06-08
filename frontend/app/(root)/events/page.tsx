"use client";

import React, { useState } from 'react';
import { Calendar, CalendarPlus } from 'lucide-react';
import Outing from '@/components/Outing';

const EventsPage = () => {
  // Sample events data
  const events = [
    {
      id: '1',
      name: 'Weekend Hike',
      description: 'Trail hike at the national park',
      userEmail: 'user@example.com',
      startTime: '2023-07-22T09:00:00',
      endTime: '2023-07-22T15:00:00',
      participants: ['alex@example.com', 'maria@example.com', 'john@example.com']
    },
    {
      id: '2',
      name: 'Dinner Party',
      description: 'Italian dinner at Mario\'s',
      userEmail: 'user@example.com',
      startTime: '2023-07-25T19:00:00',
      endTime: '2023-07-25T22:00:00',
      participants: ['sam@example.com', 'taylor@example.com']
    },
    {
      id: '3',
      name: 'Team Meeting',
      description: 'Weekly project sync',
      userEmail: 'user@example.com',
      startTime: '2023-07-20T10:00:00',
      endTime: '2023-07-20T11:30:00',
      participants: ['alex@example.com', 'maria@example.com', 'john@example.com', 'sam@example.com']
    }
  ];

  return (
    <div className="container-fluid py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Events</h1>
        <button className="btn btn-primary flex items-center gap-2">
          <CalendarPlus className="h-5 w-5" />
          <span>Add Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {events.map((event) => (
          <Outing key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
};

export default EventsPage; 