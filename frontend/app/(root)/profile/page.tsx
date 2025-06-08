"use client";

import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { User, Edit3, Save, X, Camera, Mail, Calendar, Settings } from 'lucide-react';
import Image from 'next/image';

interface ProfileData {
  id?: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePic: string;
  is_vegetarian: boolean;
  is_spicy: boolean;
  is_family: boolean;
}

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { getToken } = useAuth();
  const { isLoaded, user } = useUser();

  useEffect(() => {
    const initializeProfile = async () => {
      setIsLoading(true);
      setError(null);

      if (!isLoaded || !user) {
        setIsLoading(false);
        return;
      }

      try {
        // First try to fetch from database
        const token = await getToken();
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          setFormData(data);
        } else if (response.status === 404) {
          // User not found in database, create from Clerk data
          const fallbackProfile: ProfileData = {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            username: user.username || user.emailAddresses[0]?.emailAddress.split('@')[0] || '',
            email: user.emailAddresses[0]?.emailAddress || '',
            profilePic: user.imageUrl || '/default-avatar.png',
            is_vegetarian: false,
            is_spicy: false,
            is_family: false,
          };
          
          setProfileData(fallbackProfile);
          setFormData(fallbackProfile);
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error initializing profile:', error);
        
        // Fallback to Clerk data on any error
        if (user) {
          const fallbackProfile: ProfileData = {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            username: user.username || user.emailAddresses[0]?.emailAddress.split('@')[0] || '',
            email: user.emailAddresses[0]?.emailAddress || '',
            profilePic: user.imageUrl || '/default-avatar.png',
            is_vegetarian: false,
            is_spicy: false,
            is_family: false,
          };
          
          setProfileData(fallbackProfile);
          setFormData(fallbackProfile);
          setError('Using account information. You can edit and save to sync with our database.');
        } else {
          setError('Failed to load profile. Please try refreshing the page.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, [isLoaded, user, getToken]);

  const handleSave = async () => {
    if (!formData) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const token = await getToken();
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setProfileData(formData);
        setIsEditing(false);
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profileData) {
      setFormData(profileData);
    }
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleTagToggle = (tag: 'is_vegetarian' | 'is_spicy' | 'is_family') => {
    if (formData) {
      setFormData({
        ...formData,
        [tag]: !formData[tag]
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Profile not found</h3>
          <p className="text-muted-foreground mb-4">There was an issue loading your profile.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-outline flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="btn btn-outline flex items-center gap-2"
                disabled={saving}
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="card">
          <div className="card-content p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary">
                    <Image
                      src={profileData.profilePic || '/default-avatar.png'}
                      alt={`${profileData.firstName} ${profileData.lastName}`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="text-center mt-4">
                  <h2 className="text-xl font-semibold">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-muted-foreground">@{profileData.username}</p>
                </div>
              </div>

              {/* Form Section */}
              <div className="flex-1 space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="firstName"
                          value={formData?.firstName || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      ) : (
                        <p className="py-2 text-foreground">{profileData.firstName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="lastName"
                          value={formData?.lastName || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      ) : (
                        <p className="py-2 text-foreground">{profileData.lastName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Username</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="username"
                          value={formData?.username || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                      ) : (
                        <p className="py-2 text-foreground">@{profileData.username}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </label>
                      <p className="py-2 text-muted-foreground">{profileData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Food Preferences
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { key: 'is_vegetarian' as const, label: 'Vegetarian', emoji: '🌱' },
                      { key: 'is_spicy' as const, label: 'Loves Spicy Food', emoji: '🌶️' },
                      { key: 'is_family' as const, label: 'Family Friendly', emoji: '👨‍👩‍👧‍👦' }
                    ].map(({ key, label, emoji }) => (
                      <div key={key}>
                        {isEditing ? (
                          <button
                            onClick={() => handleTagToggle(key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                              formData?.[key]
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-foreground border-border hover:bg-secondary'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span className="text-sm">{label}</span>
                          </button>
                        ) : (
                          profileData[key] && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                              <span>{emoji}</span>
                              <span className="text-sm">{label}</span>
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                  {!isEditing && !profileData.is_vegetarian && !profileData.is_spicy && !profileData.is_family && (
                    <p className="text-muted-foreground text-sm mt-2">No preferences set. Click "Edit Profile" to add some!</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;