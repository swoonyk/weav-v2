import { prisma } from '@/lib/prisma';

interface UserData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  gcal_permission: boolean;
  profilePic: string;
}

const addUserData = async ({ firstName, lastName, userName, email, gcal_permission, profilePic }: UserData) => {
  return await prisma.user.create({
    data: {
      firstName: firstName,
      lastName: lastName,
      username: userName,
      profilePic: profilePic,
      email: email,
      is_vegetarian: false,
      is_spicy: false,
      is_family: false,
      gcal_permission: gcal_permission
    }
  })
}

interface UpdateUserData {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  is_vegetarian?: boolean;
  is_spicy?: boolean;
  is_family?: boolean;
  gcal_permission?: boolean;
}

const updateUserData = async (userData: UpdateUserData) => {
  try {
    const userIdBigInt = BigInt(userData.id);
    
    return await prisma.user.update({
      where: {
        id: userIdBigInt
      },
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        is_vegetarian: userData.is_vegetarian,
        is_spicy: userData.is_spicy,
        is_family: userData.is_family,
        gcal_permission: userData.gcal_permission
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
};

const addFriendData = async (userId: string, targetEmail: string) => {
  try {
    const userIdBigInt = BigInt(userId);
    
    // Find target user by email
    const targetUser = await prisma.user.findUnique({
      where: {
        email: targetEmail
      },
      select: {
        id: true
      }
    });

    if (!targetUser) {
      throw new Error('Target user not found');
    }

    const friendship = await prisma.friend.create({
      data: {
        user_id: userIdBigInt,
        friend_id: targetUser.id
      }
    });

    return friendship;
    
  } catch (error) {
    console.error('Error adding friend connection:', error);
    throw new Error('Failed to add friend connection');
  }
};

const fetchUserProfileByEmail = async (email: string) => {
  try {
    const userData = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        email: true,
        username: true,
        profilePic: true,
        firstName: true,
        lastName: true,
        is_vegetarian: true,
        is_spicy: true,
        is_family: true,
        gcal_permission: true,
      },
    });

    if (!userData) {
      return null;
    }

    return {
      ...userData,
      id: userData.id.toString(),
    };
  } catch (error) {
    console.error('Error fetching user profile by email:', error);
    throw new Error('Failed to fetch user profile by email');
  }
};

const fetchUserProfile = async (userId: string) => {
  try {
    const userIdBigInt = BigInt(userId);
    const userData = await prisma.user.findUnique({
      where: {
        id: userIdBigInt,
      },
      select: {
        id: true,
        email: true,
        username: true,
        profilePic: true,
        firstName: true,
        lastName: true,
        is_vegetarian: true,
        is_spicy: true,
        is_family: true,
        gcal_permission: true,
      },
    });

    if (!userData) {
      return null;
    }

    return {
      ...userData,
      id: userData.id.toString(),
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
};

async function fetchUserFriends(userId: string) {
  try {
    const userIdBigInt = BigInt(userId);

    // Get all friend relationships where user is either initiator or receiver
    const friendships = await prisma.friend.findMany({
      where: {
        OR: [
          { user_id: userIdBigInt },
          { friend_id: userIdBigInt }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            profilePic: true
          }
        },
        friend: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            profilePic: true
          }
        }
      }
    });

    const friendDetails = friendships.map(fs => {
      if (fs.user_id === userIdBigInt) {
        // Current user is the initiator, return details of the friend
        return {
          id: fs.friend.id.toString(),
          firstName: fs.friend.firstName,
          lastName: fs.friend.lastName,
          username: fs.friend.username,
          email: fs.friend.email,
          profilePic: fs.friend.profilePic,
          status: fs.user_id === userIdBigInt && fs.friend_id === userIdBigInt ? 'confirmed' : 'pending_sent'
        };
      } else {
        // Current user is the receiver, return details of the user who sent the request
        return {
          id: fs.user.id.toString(),
          firstName: fs.user.firstName,
          lastName: fs.user.lastName,
          username: fs.user.username,
          email: fs.user.email,
          profilePic: fs.user.profilePic,
          status: 'pending_received'
        };
      }
    });

    return friendDetails;
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error;
  }
}

export {
  addUserData,
  fetchUserProfile,
  fetchUserProfileByEmail,
  fetchUserFriends,
  addFriendData,
  updateUserData
}