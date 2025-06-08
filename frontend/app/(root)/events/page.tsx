"use client";

import React, { useState, useEffect } from 'react';
import { CalendarPlus, MapPin, Clock, Users, Search, Filter, Calendar, Tag, Heart, Share2, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Event {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  price: string;
  category: string;
  imageUrl: string;
  organizer: string;
  attendeeCount: number;
  maxAttendees?: number;
  tags: string[];
  isFree: boolean;
  isLiked?: boolean;
}

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock event data with Eventbrite-style content
  const mockEvents: Event[] = [
    {
      id: '1',
      name: 'Tech Startup Networking Mixer',
      description: 'Connect with fellow entrepreneurs, developers, and investors in the local tech scene. Light refreshments and networking activities included.',
      startTime: '2024-01-15T18:00:00',
      endTime: '2024-01-15T21:00:00',
      location: 'WeWork Downtown, 123 Innovation St',
      price: 'Free',
      category: 'networking',
      imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop&auto=format',
      organizer: 'TechHub Collective',
      attendeeCount: 127,
      maxAttendees: 200,
      tags: ['Networking', 'Tech', 'Startups'],
      isFree: true,
      isLiked: false
    },
    {
      id: '2', 
      name: 'Weekend Food Festival',
      description: 'Discover amazing local cuisine from over 50 food vendors. Live music, cooking demonstrations, and family-friendly activities.',
      startTime: '2024-01-20T11:00:00',
      endTime: '2024-01-21T22:00:00',
      location: 'City Central Park',
      price: '$25',
      category: 'food',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=250&fit=crop&auto=format',
      organizer: 'City Events Co.',
      attendeeCount: 2450,
      maxAttendees: 5000,
      tags: ['Food', 'Music', 'Family'],
      isFree: false,
      isLiked: true
    },
    {
      id: '3',
      name: 'Morning Yoga in the Park',
      description: 'Start your day with mindful movement and meditation. All levels welcome. Bring your own mat.',
      startTime: '2024-01-16T07:00:00',
      endTime: '2024-01-16T08:30:00',
      location: 'Riverside Park Pavilion',
      price: '$15',
      category: 'fitness',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=250&fit=crop&auto=format',
      organizer: 'Zen Wellness Studio',
      attendeeCount: 24,
      maxAttendees: 30,
      tags: ['Yoga', 'Wellness', 'Morning'],
      isFree: false,
      isLiked: false
    },
    {
      id: '4',
      name: 'Art Gallery Opening Night',
      description: 'Exclusive preview of "Modern Perspectives" exhibition featuring local contemporary artists. Wine and appetizers served.',
      startTime: '2024-01-18T19:00:00',
      endTime: '2024-01-18T22:00:00',
      location: 'Metropolitan Art Gallery',
      price: 'Free',
      category: 'arts',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop&auto=format',
      organizer: 'Metro Arts Society',
      attendeeCount: 89,
      maxAttendees: 150,
      tags: ['Art', 'Culture', 'Wine'],
      isFree: true,
      isLiked: false
    },
    {
      id: '5',
      name: 'JavaScript Bootcamp Workshop',
      description: 'Intensive hands-on workshop covering modern JavaScript fundamentals. Perfect for beginners and intermediate developers.',
      startTime: '2024-01-22T09:00:00',
      endTime: '2024-01-22T17:00:00',
      location: 'Code Academy Downtown',
      price: '$150',
      category: 'education',
      imageUrl: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop&auto=format',
      organizer: 'Code Academy',
      attendeeCount: 42,
      maxAttendees: 50,
      tags: ['Programming', 'JavaScript', 'Workshop'],
      isFree: false,
      isLiked: true
    },
    {
      id: '6',
      name: 'Live Jazz Night',
      description: 'Enjoy an evening of smooth jazz featuring the Mike Johnson Quartet. Premium cocktails and small plates available.',
      startTime: '2024-01-19T20:00:00',
      endTime: '2024-01-19T23:30:00',
      location: 'Blue Note Lounge',
      price: '$35',
      category: 'music',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop&auto=format',
      organizer: 'Blue Note Entertainment',
      attendeeCount: 156,
      maxAttendees: 200,
      tags: ['Jazz', 'Music', 'Cocktails'],
      isFree: false,
      isLiked: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Events', icon: Calendar },
    { id: 'networking', name: 'Networking', icon: Users },
    { id: 'food', name: 'Food & Drink', icon: '🍕' as const },
    { id: 'fitness', name: 'Fitness', icon: '💪' as const },
    { id: 'arts', name: 'Arts & Culture', icon: '🎨' as const },
    { id: 'education', name: 'Education', icon: '📚' as const },
    { id: 'music', name: 'Music', icon: '🎵' as const }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Price filter
    if (priceFilter === 'free') {
      filtered = filtered.filter(event => event.isFree);
    } else if (priceFilter === 'paid') {
      filtered = filtered.filter(event => !event.isFree);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory, priceFilter]);

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

  const toggleLike = (eventId: string) => {
    setEvents(events.map(event =>
      event.id === eventId ? { ...event, isLiked: !event.isLiked } : event
    ));
  };

  if (isLoading) {
    return (
      <div className="container-fluid py-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Discovering amazing events near you...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Discover Events</h1>
            <p className="text-muted-foreground">
              Find amazing events happening near you • {filteredEvents.length} events available
            </p>
          </div>
          
          <button className="btn btn-primary flex items-center gap-2">
            <CalendarPlus className="h-5 w-5" />
            <span>Add Event</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events by name, location, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = typeof category.icon !== 'string' ? category.icon : null;
              const emoji = typeof category.icon === 'string' ? category.icon : null;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-border hover:bg-secondary'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {emoji && <span>{emoji}</span>}
                  <span className="text-sm">{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* Price Filter */}
          <div className="flex gap-2">
            {[
              { id: 'all', name: 'All Prices' },
              { id: 'free', name: 'Free Events' },
              { id: 'paid', name: 'Paid Events' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setPriceFilter(filter.id)}
                className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                  priceFilter === filter.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:bg-secondary'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters to find more events.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setPriceFilter('all');
              }}
              className="btn btn-outline"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="card overflow-hidden hover:shadow-lg transition-shadow">
                {/* Event Image */}
                <div className="relative h-48 bg-secondary">
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => toggleLike(event.id)}
                      className={`p-2 rounded-full transition-colors ${
                        event.isLiked
                          ? 'bg-red-500 text-white'
                          : 'bg-black/20 text-white hover:bg-black/40'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${event.isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                  {event.isFree && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      FREE
                    </div>
                  )}
                </div>

                {/* Event Content */}
                <div className="card-content p-4">
                  {/* Date and Time */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(event.startTime)} • {formatTime(event.startTime)}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.name}</h3>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {event.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {event.attendeeCount} attending
                        {event.maxAttendees && ` • ${event.maxAttendees - event.attendeeCount} spots left`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{event.price}</span>
                      <button className="btn btn-primary btn-sm flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        View
                      </button>
                    </div>
                  </div>

                  {/* Organizer */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Organized by <span className="font-medium">{event.organizer}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage; 