import { NextResponse } from 'next/server';

interface EventbriteApiEvent {
  id: string;
  name: { text: string; html: string; };
  description: { text: string | null; html: string | null; };
  start: { utc: string; };
  end: { utc: string; };
  url: string;
  venue: { address: { localized_address_display: string; }; } | null;
  is_free: boolean;
  ticket_classes?: Array<{ cost: { value: number; }; }>;
  category_id: string | null;
  logo: { url: string; } | null;
  organizer: { name: string; } | null;
  capacity_is_custom: boolean;
  capacity: number;
  num_attendees: number;
  tags?: Array<{ tag: string; }>;
  summary?: string;
}

export async function OPTIONS() {
  return NextResponse.json(
    {}, 
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
          : 'http://localhost:3000', // Or specify '*' for wider access, but use with caution
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    console.log('Raw request body for recommendations:', requestBody);

    const { calendars = {}, preferences = {} } = requestBody;

    console.log('Received request for recommendations:', { calendars, preferences });

    // --- Start Eventbrite API Integration --- //
    const EVENTBRITE_API_KEY = process.env.EVENTBRITE_API_KEY;
    const EVENTBRITE_BASE_URL = 'https://www.eventbriteapi.com/v3/'; // Verify this URL

    if (!EVENTBRITE_API_KEY) {
      return NextResponse.json({ error: "Eventbrite API key not configured." }, { status: 500 });
    }

    // Construct query parameters for Eventbrite API (customize as needed)
    const queryParams = new URLSearchParams({
      token: EVENTBRITE_API_KEY,
      'location.address': 'online', // Example: search for online events
      sort_by: 'date', // Example: sort by date
      'event.keyword': 'tech', // Example: search for tech events
      // Add more parameters based on preferences or user input
    }).toString();

    const eventbriteUrl = `${EVENTBRITE_BASE_URL}events/search/?${queryParams}`;
    console.log('Fetching events from Eventbrite URL:', eventbriteUrl);

    const eventbriteResponse = await fetch(eventbriteUrl, {
      headers: {
        'Authorization': `Bearer ${EVENTBRITE_API_KEY}` // Eventbrite often uses Bearer token in header
      }
    });

    if (!eventbriteResponse.ok) {
      const errorText = await eventbriteResponse.text();
      console.error('Eventbrite API non-OK response:', eventbriteResponse.status, errorText);
      throw new Error(`Eventbrite API error: ${eventbriteResponse.status} - ${errorText}`);
    }

    const eventbriteData = await eventbriteResponse.json();
    console.log('Data received from Eventbrite API:', eventbriteData);

    // Map Eventbrite response to your EventbriteEventType interface
    const recommended_events = eventbriteData.events.map((event: EventbriteApiEvent) => ({
      id: event.id,
      name: event.name.text,
      description: event.description.text || event.summary || 'No description available.',
      startTime: event.start.utc,
      endTime: event.end.utc,
      location: event.venue ? event.venue.address.localized_address_display : 'Online',
      price: event.is_free ? 'Free' : (event.ticket_classes && event.ticket_classes.length > 0 ? `$${event.ticket_classes[0].cost.value / 100}` : 'N/A'),
      category: event.category_id || 'general', // You might need to map category IDs to names
      imageUrl: event.logo ? event.logo.url : '/images/default-event-image.jpg',
      organizer: event.organizer ? event.organizer.name : 'Unknown Organizer',
      attendeeCount: event.capacity_is_custom ? event.capacity - event.num_attendees : event.num_attendees || 0,
      maxAttendees: event.capacity_is_custom ? event.capacity : undefined,
      tags: event.tags ? event.tags.map((tag: { tag: string }) => tag.tag) : [],
      isFree: event.is_free,
    }));

    // --- End Eventbrite API Integration --- //

    console.log('Sending recommended events:', recommended_events);
    return NextResponse.json({ recommended_events });
  } catch (error) {
    console.error('Error in recommend API:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations.' }, { status: 500 });
  }
} 