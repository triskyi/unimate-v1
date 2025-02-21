import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../../lib/db'; // PostgreSQL connection
import bcrypt from 'bcrypt'; // For password hashing
import jwt from 'jsonwebtoken'; // For JWT
import dotenv from 'dotenv';
import path from 'path'; // For handling file paths
import fs from 'fs'; // For file system operations

dotenv.config(); // Load environment variables from .env file

const saltRounds = 10; // Number of rounds for bcrypt

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // Signup action
    if (action === 'signup') {
      const formData = await req.formData();
      const username = formData.get('username')?.toString();
      const password = formData.get('password')?.toString();
      const university = formData.get('university')?.toString();
      const gender = formData.get('gender')?.toString();
      const nationality = formData.get('nationality')?.toString();
      const phone = formData.get('phone')?.toString();
      const file = formData.get('profileImage') as File | null;

      // Validation: Ensure all required fields are present
      if (!username || !password || !gender || !university || !nationality || !phone) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }

      // Handle profile image upload
      let imageUrl = '';
      if (file) {
        const validTypes = ['image/jpeg','image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          return NextResponse.json({ message: 'Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed.' }, { status: 400 });
        }
  
        const uploadPath = path.join(process.cwd(), 'public/uploads', file.name);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
  
        await fs.writeFile(uploadPath, buffer, (err) => {
          if (err) throw err;
        });
        imageUrl = `/uploads/${file.name}`;
      }

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert the new user into the PostgreSQL database
      await pool.query(
        'INSERT INTO "User" (username, password, university, gender, nationality, phone, "profileImage", "isOnline") VALUES ($1, $2, $3, $4, $5, $6, $7, false)',
        [username, hashedPassword, university, gender, nationality, phone,  imageUrl]
      );

      return NextResponse.json({
        message: 'Signup successful. Please log in to continue.',
      }, { status: 201 });
    } 

    // Login action
    else if (action === 'login') {
      if (req.headers.get('Content-Type') !== 'application/json') {
        return NextResponse.json({ message: 'Content-Type must be application/json' }, { status: 400 });
      }

      const { username, password } = await req.json(); // Parse JSON body

      // Validate credentials
      if (!username || !password) {
        return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
      }

      // Fetch user from the database
      const { rows } = await pool.query('SELECT * FROM "User" WHERE username = $1', [username]);

      if (rows.length > 0) {
        const user = rows[0];

        // Compare provided password with the hashed password
        const match = await bcrypt.compare(password, user.password);

        if (match) {
          // Generate a JWT token
          const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET_KEY as string, // Ensure you have this in your .env
            { expiresIn: '24h' } // Token expiration
          );

          // Mark user as online in the database
          await pool.query('UPDATE "User" SET "isOnline" = true WHERE id = $1', [user.id]);

          return NextResponse.json({
            message: 'Login successful!',
            user: {
              id: user.id,
              username: user.username,
              token, // Include the token in the response
              isOnline: true, // Include the online status
              profileImage: user.profileImage, // Include the profile image path
            },
          }, { status: 200 });
        } else {
          return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }
      } else {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }
    } 

    // Invalid action
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