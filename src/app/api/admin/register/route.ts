import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import pool from '../../../../../lib/db'; // Ensure this exports your pg Pool

export const config = {
  api: {
    bodyParser: false, // BodyParser is not needed when using req.json()
  },
};

export async function POST(req: Request) {
  try {
    // Parse the request body as JSON
    const body = await req.json();
    console.log('Incoming data:', body);

    const { username, password, email, phone } = body;

    // Validate if all required fields are present
    if (!username || !password || !email || !phone) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Hash the password before storing
    const hashedPassword = await hash(password, 10);

    // Insert into the database using your PostgreSQL pool
    const result = await pool.query(
      'INSERT INTO "Admin" (username, password, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, hashedPassword, email, phone]
    );

    // Return success response with the newly created admin details
    return NextResponse.json(
      { message: 'Admin registered successfully', admin: result.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering admin:', error);
    return NextResponse.json(
      { message: 'Error registering admin', error: (error as Error).message },
      { status: 500 }
    );
  }
}
