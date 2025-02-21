import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import pool from '../../../../../lib/db'; // Correctly import your pool



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    const adminResult = await pool.query('SELECT * FROM "Admin" WHERE username = $1', [username]);

    if (adminResult.rows.length === 0) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 401 });
    }

    const admin = adminResult.rows[0];
    const isValid = await compare(password, admin.password);

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 401 });
    }

    const jwtSecretKey = process.env.JWT_SECRET_KEY;

    if (!jwtSecretKey) {
      throw new Error('JWT_SECRET_KEY is not defined');
    }

    const token = sign({ id: admin.id }, jwtSecretKey, {
      expiresIn: '1d',
    });

    // Include the username in the response along with the token
    return NextResponse.json({ message: 'Login successful', token, username }, { status: 200 });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { message: 'Error logging in', error: (error as Error).message },
      { status: 500 }
    );
  }
}
