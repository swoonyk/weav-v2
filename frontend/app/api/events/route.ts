import { NextResponse, NextRequest } from 'next/server';
import { fetchEvents } from "@/app/services/eventsServices";

export async function GET(request: NextRequest) {
  try {
    // Temporarily bypass userId check for debugging event display
    const events = await fetchEvents();
    console.log('Events fetched in /api/events:', events);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error in GET /api/events:', error);
    return NextResponse.json(
      { error: `Internal server error: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}