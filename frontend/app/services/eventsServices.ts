import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { Event as EventType } from '@/lib/types';

const fetchEvents = async (/* userId: string, */ eventId?: string) => {
  try {
    // Construct the path to the mock data file
    const filePath = path.join(process.cwd(), 'mock_data', 'outings.json');
    // Read the file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    // Parse the JSON content
    const eventsData: EventType[] = JSON.parse(fileContent);

    // Map the data to ensure it conforms to the EventType, assuming the structure is compatible
    const events: EventType[] = eventsData.map((event) => ({
      ...event,
      // Ensure all fields from EventType are present, with defaults if necessary
      id: event.id || '',
      name: event.name || 'No Name',
      description: event.description || 'No Description',
      startTime: event.startTime || new Date().toISOString(),
      endTime: event.endTime || new Date().toISOString(),
      location: event.location || 'No Location',
      price: event.price || 'Free',
      category: event.category || 'General',
      imageUrl: event.imageUrl || '',
      organizer: event.organizer || 'Unknown',
      attendeeCount: event.attendeeCount || 0,
      tags: event.tags || [],
      isFree: event.isFree === undefined ? true : event.isFree,
    }));

    console.log('Fetched events from mock data:', events);

    return events;
  } catch (error) {
    console.error('Error fetching events from mock data:', error);
    throw new Error('Failed to fetch events');
  }
};

async function toggleEventLike(userId: string, eventId: string) {
  try {
    const userIdBigInt = BigInt(userId);
    const eventIdBigInt = BigInt(eventId);

    const existingLike = await prisma.userEventLike.findUnique({
      where: {
        userId_eventId: {
          userId: userIdBigInt,
          eventId: eventIdBigInt,
        },
      },
    });

    if (existingLike) {
      // Unlike the event
      await prisma.userEventLike.delete({
        where: {
          userId_eventId: {
            userId: userIdBigInt,
            eventId: eventIdBigInt,
          },
        },
      });
      return { isLiked: false };
    } else {
      // Like the event
      await prisma.userEventLike.create({
        data: {
          userId: userIdBigInt,
          eventId: eventIdBigInt,
        },
      });
      return { isLiked: true };
    }
  } catch (error) {
    console.error('Error toggling event like:', error);
    throw new Error('Failed to toggle event like');
  }
}

export {
  fetchEvents,
  toggleEventLike
}