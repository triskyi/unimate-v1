import { NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // Import your PostgreSQL connection
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken

// GET method to fetch all users from the same university excluding the current user
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    let currentUserId = null; // Initialize current user ID

    // Check if token exists and extract the current user ID
    if (token) {
      const secretKey = process.env.JWT_SECRET_KEY;
      if (!secretKey) {
        throw new Error('JWT secret key is not defined');
      }

      try {
        const decoded = jwt.verify(token, secretKey) as { id: number };
        currentUserId = decoded.id; // Get current user ID from the token
      } catch (error) {
        console.error('Token verification error:', error);
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }

    // Fetch all users from the database
    const { rows } = await pool.query(
      `SELECT id, username, "isOnline", university,"profileImage"
       FROM "User" 
       WHERE id != $1`, // Exclude the current user
      [currentUserId]
    );

    console.log('Fetched Users:', rows);

    const usersWithStatus = rows.map(user => ({
      ...user,
      isOnline: user.isOnline === true, // Ensure boolean value for isOnline
    }));

    return NextResponse.json(usersWithStatus);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
