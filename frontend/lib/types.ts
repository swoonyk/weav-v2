export interface Event {
  id: string;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  price: string;
  category: string;
  imageUrl: string;
  organizer: string;
  attendeeCount: number;
  maxAttendees?: number;
  tags: string[];
  isFree: boolean;
  isLiked?: boolean;
} 