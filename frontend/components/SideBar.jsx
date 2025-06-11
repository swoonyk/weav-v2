"use client";

import React, { useState } from 'react';
import ActiveLink from './ActiveLink';
import { Calendar, Home, Users, User, Menu, X } from 'lucide-react';
import { useUser } from "@clerk/nextjs";

const SideBar = () => {
  const { user } = useUser();
  const [, setUserData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Friends', path: '/friends', icon: Users },
    { name: 'Events', path: '/events', icon: Calendar },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: User, 
      onClick: () => {
        if (user?.id) {
          fetchUserData(user.id);
        }
      }
    },
  ];

  const fetchUserData = async (id) => {
    try {
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-background/80 backdrop-blur-sm border border-border md:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar for mobile (overlay) and desktop */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out z-40 md:relative md:w-64 h-screen bg-card border-r border-border`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent weav-gradient">weav</h1>
          </div>
          
          <nav className="flex-grow overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <ActiveLink 
                      href={item.path} 
                      onClick={item.onClick}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-accent/10 transition-colors text-foreground"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </ActiveLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm md:hidden z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default SideBar;