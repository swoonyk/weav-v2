"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import Header from '@/components/Header';
import Friend from '@/components/friend';
import Outing from '@/components/Outing';
import { CalendarPlus, Users, X } from 'lucide-react';

interface FriendType {
  name: string;
  email: string;
}

interface OutingType {
  id: string;
  name: string;
  description: string;
  userEmail: string;
  startTime: string;
  endTime: string;
  participants: string[];
}

interface UserDataType {
  email: string | undefined;
}

const HomePage = () => {
  const { user } = useUser();
  const [friends, setFriends] = useState<FriendType[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<FriendType[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<OutingType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock outings for demonstration
  const mockOutings: OutingType[] = [
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
    }
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // This should be an API call to your backend to get user details, including friends
          // For now, using mock friends
          const mockFriends: FriendType[] = [
            { name: "Alex Johnson", email: "alex@example.com" }, 
            { name: "Maria Garcia", email: "maria@example.com" },
            { name: "John Smith", email: "john@example.com" },
            { name: "Sam Taylor", email: "sam@example.com" },
            { name: "Taylor Swift", email: "taylor@example.com" }
          ];
          setFriends(mockFriends);
          setUserData({ email: user.primaryEmailAddress?.emailAddress });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleFriendClick = (friend: FriendType) => {
    setSelectedFriends((prevSelectedFriends) => {
      if (prevSelectedFriends.some(f => f.email === friend.email)) {
        return prevSelectedFriends.filter((f) => f.email !== friend.email);
      } else {
        return [...prevSelectedFriends, friend];
      }
    });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setSelectedFriends([]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      console.error("You must be logged in to plan an event.");
      return;
    }
    setIsLoading(true);

    // Assuming friends' emails are their calendar IDs for Google Calendar
    const calendarIds = [userData?.email, ...selectedFriends.map(f => f.email)];

    const payload = {
      calendars: calendarIds,
      preferences: {}, // Preferences can be added later
    };

    try {
      // Mock API call - replace with actual API call
      console.log("Sending payload:", payload);
      
      // Mock response after 1 second
      setTimeout(() => {
        setRecommendedEvents(mockOutings);
        setIsLoading(false);
        toggleModal();
      }, 1000);
      
      // Actual API call would look like this:
      /*
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch recommendations.');
      }

      const data = await response.json();
      setRecommendedEvents(data.recommended_events || []);
      setIsLoading(false);
      toggleModal();
      */
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="page-container">
      <Header />
      
      {/* Plan Wevent Button */}
      <div className="container-fluid mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Your Wevents</h2>
          <button
            onClick={toggleModal}
            className="btn btn-primary flex items-center gap-2"
          >
            <CalendarPlus className="h-5 w-5" />
            <span>Plan Wevent</span>
          </button>
        </div>
        
        {/* Outings List */}
        <div className="mt-8">
          {recommendedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendedEvents.map((event) => (
                <Outing key={event.id} {...event} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <h3 className="text-xl font-medium mb-4">No Wevents Planned Yet</h3>
              <p className="text-muted-foreground mb-6">
                Start planning your first Wevent by clicking the &quot;Plan Wevent&quot; button.
              </p>
              <button
                onClick={toggleModal}
                className="btn btn-primary mx-auto"
              >
                Plan Your First Wevent
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
          <div className="card w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="card-header flex justify-between items-center">
              <h2 className="text-2xl font-bold">Plan Your Wevent</h2>
              <button 
                onClick={toggleModal}
                className="p-2 rounded-full hover:bg-secondary/80"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="card-content">
              <h3 className="text-lg font-medium mb-4">Select Friends</h3>
              
              {/* Friends List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                {friends.map((friend) => (
                  <Friend
                    key={friend.email}
                    name={friend.name}
                    email={friend.email}
                    isSelected={selectedFriends.some(f => f.email === friend.email)}
                    onClick={() => handleFriendClick(friend)}
                  />
                ))}
              </div>
              
              {/* Selected Friends Summary */}
              {selectedFriends.length > 0 && (
                <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{selectedFriends.length} Friends Selected</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFriends.map(friend => (
                      <div 
                        key={friend.email}
                        className="bg-background px-3 py-1 rounded-full text-sm flex items-center gap-1"
                      >
                        <span>{friend.name}</span>
                        <button 
                          onClick={() => handleFriendClick(friend)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="card-footer flex-between border-t">
              <button 
                onClick={toggleModal}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={isLoading || selectedFriends.length === 0}
              >
                {isLoading ? 'Weaving...' : 'Weav Your Outing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage; 