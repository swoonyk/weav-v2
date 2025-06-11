"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { CalendarPlus, Search, Calendar, X, Users, Utensils, Dumbbell, Palette, Book, Music } from 'lucide-react';
import { Event } from '@/lib/types';
import EventCard from '@/components/EventCard';
import ViewEventModal from '@/components/ViewEventModal';

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isViewEventModalOpen, setIsViewEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { getToken } = useAuth(); // Get getToken function from useAuth

  // State for new event form
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id' | 'attendeeCount' | 'isLiked' | 'organizer'>>({
    name: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    price: '',
    category: 'networking', // Default category
    imageUrl: '',
    tags: [],
    isFree: false,
  });

  const categories = [
    { id: 'all', name: 'All Events', icon: Calendar },
    { id: 'networking', name: 'Networking', icon: Users },
    { id: 'food', name: 'Food & Drink', icon: Utensils },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell },
    { id: 'arts', name: 'Arts & Culture', icon: Palette },
    { id: 'education', name: 'Education', icon: Book },
    { id: 'music', name: 'Music', icon: Music }
  ];

  useEffect(() => {
    const fetchEventsFromApi = async () => {
      try {
        setIsLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : 'http://localhost:3000';
        const url = `${baseUrl}/api/events`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data: Event[] = await response.json();
        console.log('Data received in EventsPage client:', data);

        setEvents(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Removed fallback to exampleEvents to ensure only fetched data is used.
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventsFromApi();
  }, []); // Empty dependency array means this runs once on mount

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

  const toggleLike = async (eventId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'toggleLike' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to toggle like status.');
      }

      const data = await response.json();
      setEvents(events.map(event =>
        event.id === eventId ? { ...event, isLiked: data.isLiked } : event
      ));
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  };

  const toggleAddEventModal = () => {
    setIsAddEventModalOpen(!isAddEventModalOpen);
    // Reset form when closing modal
    if (!isAddEventModalOpen) {
      setNewEvent({
        name: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        price: '',
        category: 'networking',
        imageUrl: '',
        tags: [],
        isFree: false,
      });
    }
  };

  const openViewEventModal = (event: Event) => {
    setSelectedEvent(event);
    setIsViewEventModalOpen(true);
  };

  const closeViewEventModal = () => {
    setSelectedEvent(null);
    setIsViewEventModalOpen(false);
  };

  const handleAddEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'isFree') {
      setNewEvent(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (name === 'tags') {
      setNewEvent(prev => ({ ...prev, [name]: value.split(',').map(tag => tag.trim()) }));
    } else {
      setNewEvent(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = await getToken();
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newEvent.name,
          description: newEvent.description,
          start_time: newEvent.startTime,
          end_time: newEvent.endTime,
          location: newEvent.location,
          price: newEvent.price,
          category: newEvent.category,
          imageUrl: newEvent.imageUrl,
          tags: newEvent.tags,
          isFree: newEvent.isFree,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add event.');
      }

      // Assuming the backend returns the newly created event or success message
      // For now, we'll just refetch all events to update the list
      const data = await response.json();
      console.log('Event added successfully:', data);
      
      // Refetch events to update the list
      const updatedEventsResponse = await fetch('/api/events');
      if (!updatedEventsResponse.ok) {
        throw new Error('Failed to refetch events after adding new event.');
      }
      const updatedEvents: Event[] = await updatedEventsResponse.json();
      setEvents(updatedEvents);
      setFilteredEvents(updatedEvents);

      toggleAddEventModal(); // Close modal after submission
    } catch (error) {
      console.error('Error adding event:', error);
      // Optionally, display an error message to the user
    } finally {
      setIsLoading(false);
    }
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
          
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={toggleAddEventModal}
          >
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onView={() => openViewEventModal(event)} 
                onLike={toggleLike}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="card w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="card-header flex justify-between items-center">
              <h2 className="text-2xl font-bold">Add New Event</h2>
              <button 
                onClick={toggleAddEventModal}
                className="p-2 rounded-full hover:bg-secondary/80"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="card-content">
              <form onSubmit={handleAddEventSubmit} className="space-y-4">
                <div>
                  <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">Event Name</label>
                  <input
                    type="text"
                    id="eventName"
                    name="name"
                    value={newEvent.name}
                    onChange={handleAddEventChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="eventDescription" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="eventDescription"
                    name="description"
                    value={newEvent.description}
                    onChange={handleAddEventChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="eventStartTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input
                      type="datetime-local"
                      id="eventStartTime"
                      name="startTime"
                      value={newEvent.startTime}
                      onChange={handleAddEventChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="eventEndTime" className="block text-sm font-medium text-gray-700">End Time</label>
                    <input
                      type="datetime-local"
                      id="eventEndTime"
                      name="endTime"
                      value={newEvent.endTime}
                      onChange={handleAddEventChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    id="eventLocation"
                    name="location"
                    value={newEvent.location}
                    onChange={handleAddEventChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="eventPrice" className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="text"
                    id="eventPrice"
                    name="price"
                    value={newEvent.price}
                    onChange={handleAddEventChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="eventCategory" className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    id="eventCategory"
                    name="category"
                    value={newEvent.category}
                    onChange={handleAddEventChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    {categories.filter(cat => cat.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="eventImageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input
                    type="url"
                    id="eventImageUrl"
                    name="imageUrl"
                    value={newEvent.imageUrl}
                    onChange={handleAddEventChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="eventTags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                  <input
                    type="text"
                    id="eventTags"
                    name="tags"
                    value={newEvent.tags.join(',')}
                    onChange={handleAddEventChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="eventIsFree"
                    name="isFree"
                    checked={newEvent.isFree}
                    onChange={handleAddEventChange}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <label htmlFor="eventIsFree" className="ml-2 block text-sm text-gray-900">Free Event</label>
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    type="button"
                    onClick={toggleAddEventModal}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Add Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Event Modal */}
      {isViewEventModalOpen && selectedEvent && (
        <ViewEventModal event={selectedEvent} onClose={closeViewEventModal} />
      )}
    </div>
  );
};

export default EventsPage; 