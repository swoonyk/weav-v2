import {
    addFriendData,
    updateUserData,
    fetchUserProfileByEmail,
    fetchUserFriends
  } from "@/app/services/userServices";
import { auth, clerkClient } from '@clerk/nextjs/server';
  
// app/api/users/route.ts - For non-dynamic POST requests
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Use async auth pattern for Clerk v6
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if there's an action parameter
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    
    // If the action is 'friends', return the user's friends
    if (action === 'friends') {
      const friends = await fetchUserFriends(userId);
      return NextResponse.json(friends || []);
    }
    
    // Get the Clerk client instance
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    
    if (!email) {
      return NextResponse.json({ error: "User has no primary email address" }, { status: 400 });
    }
    
    // Fetch the user profile from the database
    const userProfile = await fetchUserProfileByEmail(email);
    
    if (!userProfile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }
    
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Use async auth pattern for Clerk v6
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the action type from the URL parameters
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const body = await request.json();

    switch (action) {
      case 'friend': {
        const { targetEmail } = body;
        // Use the authenticated userId instead of the one from the request
        await addFriendData(userId, targetEmail);
        return NextResponse.json({ success: true });
      }
      
      case 'profile': {
        // Handle profile update logic
        return NextResponse.json({ success: true });
      }
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Ensure user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userDataFromBody = await request.json(); // Renamed to avoid conflict
    await updateUserData(userDataFromBody);
    
    return NextResponse.json({
      success: true,
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}