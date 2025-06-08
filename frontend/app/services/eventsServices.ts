import { PrismaClient } from '@prisma/client';

import path from 'path';
import { prisma } from '@/lib/prisma';

interface PythonResponse {
  success: boolean;
  data: object | null;
  error?: string;
}

export async function executePythonScript(inputData: object): Promise<PythonResponse> {
  // In production (Vercel), we can't execute Python scripts
  // Return mock data instead
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    console.log('Running in production environment, returning mock data');
    return {
      success: true,
      data: {
        message: "This is mock data since Python execution is not available in production",
        input: inputData
      }
    };
  }
  
  // Only execute Python in development
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    const scriptPath = path.join(process.cwd(), 'python', 'script.py');
    const jsonString = JSON.stringify(inputData).replace(/"/g, '\\"');
    const { stdout, stderr } = await execAsync(`python3 "${scriptPath}" "${jsonString}"`);
    
    if (stderr) {
      throw new Error(stderr);
    }

    return {
      success: true,
      data: JSON.parse(stdout) as object
    };
  } catch (error) {
    console.error('Python execution error:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

const fetchEvents = async (userId: string, eventId?: string) => {
  try {
    const userIdBigInt = BigInt(userId);

    const events: {
      id: bigint,
      title: string,
      description: string,
      start_time: Date,
      end_time: Date,
      creator: {
        email: string
      },
      participants: {
        user: {
          email: string,
          firstName: string,
          lastName: string
        }
      }[]
    }[] = await prisma.event.findMany({
      where: {
        // Only include eventId filter if it's provided
        ...(eventId ? { id: BigInt(eventId) } : {}),
        OR: [
          // Events where user is creator
          { creator_id: userIdBigInt },
          // Events where user is participant
          {
            participants: {
              some: {
                user_id: userIdBigInt
              }
            }
          }
        ]
      },
      select: {
        id: true,
        title: true,
        description: true,
        start_time: true,
        end_time: true,
        creator: {
          select: {
            email: true
          }
        },
        participants: {
          select: {
            user: {
              select: {
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    return events.map(event => ({
      eventId: event.id.toString(),
      title: event.title,
      description: event.description,
      startTime: event.start_time,
      endTime: event.end_time,
      creatorEmail: event.creator.email,
      participants: event.participants.map(p => ({
        email: p.user.email,
        name: `${p.user.firstName} ${p.user.lastName}`
      }))
    }));

  } catch (error) {
    console.error('Error fetching events:', error);
    throw new Error('Failed to fetch events');
  }
};

export {
  fetchEvents
}