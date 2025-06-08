"use client";

import React from 'react';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
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
              <button className="btn btn-primary">
                Get Started
              </button>
              <button className="btn btn-outline">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Header;