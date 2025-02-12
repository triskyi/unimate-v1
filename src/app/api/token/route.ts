import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // PostgreSQL connection
import jwt from 'jsonwebtoken';
import { StreamChat } from 'stream-chat';

// Initialize StreamChat server client using your API key and secret
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEYY as string;
const apiSecret = process.env.STREAM_API_SECRET as string;
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export async function GET(req: Request) {
  try {
    // Extract the JWT token from the 'Authorization' header
    const token = req.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Token missing' }, { status: 401 });
    }

    // Verify the JWT token to extract user details
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Extract userId from the decoded JWT and ensure it's treated as a string
    const userId = String((decoded as jwt.JwtPayload).id);

    if (!userId) {
      return NextResponse.json({ error: 'User ID missing from token' }, { status: 400 });
    }

    // Fetch users from the database, excluding the logged-in user
    const { rows } = await pool.query('SELECT id, username FROM "User" WHERE id != $1', [userId]);

    // Generate a token for StreamChat using the userId with the appropriate role
    const chatToken = serverClient.createToken(userId); // Ensure role is defined

    // Create user list with basic data (no separate token for users)
    const usersWithStatus = rows.map(user => ({
      id: user.id.toString(), // Ensure IDs are strings
      name: user.username,
      isOnline: checkOnlineStatus(user.id), // Placeholder logic for online status
    }));

    // Return users and the StreamChat token
    return NextResponse.json({ users: usersWithStatus, chatToken });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

// Placeholder function to determine if a user is online
function checkOnlineStatus(userId: string): boolean {
  console.log(`Checking online status for user: ${userId}`);
  return Math.random() < 0.5; // Randomized online status for demonstration
}
