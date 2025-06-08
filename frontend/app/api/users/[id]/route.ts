import {
  fetchUserProfile,
  fetchUserFriends
} from "@/app/services/userServices";
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate the request
    const { userId: authenticatedUserId } = await auth();
    
    if (!authenticatedUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Extract the user ID from the URL parameters
    const { id } = await params;
    
    // Get the action type from the search parameters
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    switch (action) {
      case 'profile': {
        // Fetch basic profile information
        const profileData = await fetchUserProfile(id);
        if (!profileData) {
          return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }
        return NextResponse.json(profileData);
      }

      case 'friends': {
        // Fetch user's friend list
        const friendsList = await fetchUserFriends(id);
        return NextResponse.json(friendsList || []);
      }
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}