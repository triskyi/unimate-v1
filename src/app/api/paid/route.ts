import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // PostgreSQL connection
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // Check Payment Status action
    if (action === 'check-payment-status') {
      const formData = await req.formData();
      const userId = formData.get('userId')?.toString();

      if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
      }

      // Query to check if the user has paid
      const { rows } = await pool.query(`
        SELECT "hasPaid" 
        FROM "User" 
        WHERE "id" = $1
      `, [userId]);

      if (rows.length === 0) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      const hasPaid = rows[0].hasPaid;

      return NextResponse.json({
        hasPaid,
        message: hasPaid ? 'User has a valid payment' : 'User has no valid payments',
      }, { status: 200 });
    }

    // Other actions (signup, login, etc.) would go here
    else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      message: 'An unexpected error occurred',
      error: (error as Error).message,
    }, { status: 500 });
  }
}
