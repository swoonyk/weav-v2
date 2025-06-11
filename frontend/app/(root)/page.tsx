"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import Image from 'next/image';

const HomePage = () => {
  const router = useRouter();

  const handleGetStartedClick = () => {
    router.push('/events');
  };

  const handleLearnMoreClick = () => {
    router.push('/');
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 dark:from-primary/10 dark:to-background z-0"></div>
      
      <section className="relative z-10 py-16 md:py-24 container-fluid">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent weav-gradient">
              weav
            </h1>
            <p className="my-6 text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto">
              Sync your calendar with others in realtime, simplifying planning for your next outing!
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button className="btn btn-primary" onClick={handleGetStartedClick}>
                Get Started
              </button>
              <button className="btn btn-outline" onClick={handleLearnMoreClick}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 1: Real-time Calendar Sync */}
      <section className="relative z-10 py-16 md:py-24 container-fluid bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Sync Calendars <span className="text-primary-600 dark:text-primary-400">Effortlessly</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-lg md:mx-0 mx-auto">
              Weav brings all your calendars together in real-time, ensuring you're always in sync with your friends and never miss out on an event. Say goodbye to endless group chats and hello to seamless coordination.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-64 md:h-80 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden flex items-center justify-center">
              <Image 
                src="/images/calendar-sync.png" 
                alt="Calendar Sync" 
                layout="fill" 
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Simplified Planning */}
      <section className="relative z-10 py-16 md:py-24 container-fluid">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row-reverse items-center justify-between px-4">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Plan Your Next Outing <span className="text-primary-600 dark:text-primary-400">with Ease</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-lg md:mx-0 mx-auto">
              From casual meetups to grand adventures, Weav simplifies every step of event planning. Discover relevant events, invite friends, and coordinate logistics, all within one intuitive platform.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-64 md:h-80 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-xl overflow-hidden flex items-center justify-center">
              <Image
                src="/images/event-planning.png"
                alt="Event Planning"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to <span className="text-white">Weav Your Social Life?</span>
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 opacity-90">
            Join the growing community of Weav users who are transforming the way they connect and plan. It's free, fast, and fun!
          </p>
          <button className="bg-white text-primary-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1" onClick={() => router.push('/events')}>
            Join Weav Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 