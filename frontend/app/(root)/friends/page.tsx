"use client";

import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

const FriendPage = (pid: string) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const { getToken } = useAuth();
  const { isLoaded, user } = useUser();

  const postFriendData = async (newFriend: any) => {
    try {
      const token = await getToken();
      
      const response = await fetch('/api/users?action=friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFriend),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding friend:', error);
      throw error;
    }
  };

  const getFriendData = async (friendId?: string) => {
    try {
      // Make sure user is loaded before proceeding
      if (!isLoaded || !user) {
        return;
      }
      
      const token = await getToken();
      const baseUrl = '/api/users';
      const url = friendId 
        ? `${baseUrl}/${friendId}?action=friends`
        : `${baseUrl}?action=friends`;
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error('Error getting friends:', error);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      getFriendData();
    }
  }, [isLoaded, user]);

  const handleAddFriend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newFriend = { 
      userId: user?.id,
      targetEmail: newFriendEmail 
    };
    try {
      const addedFriend = await postFriendData(newFriend);
      setFriends([...friends, addedFriend]);
      setNewFriendEmail('');
      (document.getElementById('my_modal_1') as HTMLDialogElement)?.close();
    } catch (error) {
      // Handle error if needed
      console.error('Error adding friend:', error);
    }
  };

  const handleRefresh = () => {
    getFriendData();
  };

  // If user is not loaded yet, show loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div className="ml-20 bg-slate-50 color" style={{ width: 'calc(100% - 80px)' }}>
        <section className="px-4 py-10">
          <div className="container-xl lg:container m-auto">
            {/* Page Heading, Add Friend Button, Refresh Friends Button */}
            <div className="flex items-center justify-between px-4 mb-6">
              {/* Your Friends Heading */}
              <h2 className="text-3xl font-bold text-emerald-400">
                Your Friends
              </h2>

              {/* Button Group */}
              <div className="flex gap-4">
                {/* Add Friend Button */}
                <button 
                  className="btn border-emerald-400 bg-emerald-400 text-white hover:border-emerald-700 hover:bg-emerald-700 px-4 py-2 rounded-md shadow-md" 
                  onClick={() => (document.getElementById('my_modal_1') as HTMLDialogElement)?.showModal()}
                >
                  Add Friend
                </button>
                {/* Refresh Button */}
                <button 
                  className="btn border-emerald-400 bg-emerald-400 text-white hover:border-emerald-700 hover:bg-emerald-700 px-4 py-2 rounded-md shadow-md" 
                  onClick={handleRefresh}
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Friends List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {friends.length > 0 ? (
                friends.map((friend, index) => (
                  <div key={index} className="card bg-white shadow-lg rounded-lg overflow-hidden">
                    <div className="p-6">
                      <h3 className="font-bold text-xl mb-2">{friend.firstName} {friend.lastName}</h3>
                      <p className="text-gray-700">{friend.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No friends found. Add some friends to get started!</p>
                </div>
              )}
            </div>

            {/* Add Friend Modal */}
            <dialog 
              id="my_modal_1" 
              className="modal"
            >
              <div 
                className="modal-box bg-gray-200 p-6 rounded-md shadow-lg"
              >
                <h3 className="font-bold text-lg text-emerald-500">
                  Add Friend
                </h3>
                <form onSubmit={handleAddFriend}>
                  <div className="flex flex-col w-full">
                    <label 
                      htmlFor="friendEmail" 
                      className="text-sm font-medium text-gray-700 mb-2"
                    >
                      Enter your friend's email address
                    </label>
                    <input
                      type="email"
                      id="friendEmail"
                      value={newFriendEmail}
                      onChange={(e) => setNewFriendEmail(e.target.value)}
                      required
                      placeholder="Enter email address"
                      className="border border-gray-400 bg-gray-200 rounded-md p-2 w-full focus:ring-emerald-400 focus:border-emerald-400 mt-3"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="bg-emerald-400 text-white px-4 py-2 rounded-md shadow-md hover:bg-emerald-500 focus:outline-none focus:ring focus:ring-emerald-300 mt-4"
                  >
                    Submit
                  </button>
                </form>
                <div className="modal-action">
                  <form method="dialog">
                    <button className="btn">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FriendPage;