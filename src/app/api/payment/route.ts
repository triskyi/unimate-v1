import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // PostgreSQL connection

// POST route to save payment transaction
export async function POST(req: NextRequest) {
  try {
    // Parse the request body as JSON
    const body = await req.json();
    const { userId, paymentStatus, transactionId } = body;

    // Validate required fields
    if (!userId || !paymentStatus || !transactionId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save the transaction to the database
    const result = await pool.query(
      `INSERT INTO "PaymentTransaction" ("transaction_ref", "status", "amount", "userId", "createdAt")
       VALUES ($1, $2, $3, $4, $5)`,
      [transactionId, paymentStatus, 500, userId, new Date()]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: 'Failed to save payment transaction' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      { message: 'Payment transaction saved successfully!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving payment transaction:', error);
    return NextResponse.json(
      {
        message: 'An unexpected error occurred',
        error:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

// Handling GET requests to fetch payment transactions
export async function GET() {
  try {
    // Fetch payment transactions
    const paymentResult = await pool.query(
      'SELECT * FROM "PaymentTransaction" ORDER BY "createdAt" DESC'
    );
    const payments = paymentResult.rows;

    // Fetch user count
    const userCountResult = await pool.query('SELECT COUNT(*) AS user_count FROM "User"');
    const userCount = userCountResult.rows[0].user_count;

    // Fetch payment transaction count
    const paymentCountResult = await pool.query('SELECT COUNT(*) AS payment_count FROM "PaymentTransaction"');
    const paymentCount = paymentCountResult.rows[0].payment_count;

    // Return payments and counts in the response
    return NextResponse.json(
      {
        payments,
        userCount,
        paymentCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching payment data:', error);
    return NextResponse.json(
      {
        message: 'An unexpected error occurred',
        error:
          process.env.NODE_ENV === 'development'
            ? (error as Error).message
            : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
