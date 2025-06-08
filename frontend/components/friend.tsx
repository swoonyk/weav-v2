"use client";

import React from 'react';
import { User, Mail, Check, Plus } from 'lucide-react';

interface FriendProps {
  name: string;
  email: string;
  isSelected: boolean;
  onClick: () => void;
}

const Friend: React.FC<FriendProps> = ({ name, email, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`card cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-primary bg-primary/10' : 'hover:border-primary/30'
      }`}
    >
      <div className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          {name ? name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
        </div>
        
        <div className="flex-grow">
          <h3 className="font-medium text-foreground">{name}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span>{email}</span>
          </div>
        </div>
        
        <div className="ml-2">
          {isSelected ? (
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <Check className="h-4 w-4" />
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full border border-border flex items-center justify-center text-muted-foreground">
              <Plus className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Friend;