import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../lib/db'; // PostgreSQL connection
import fs from 'fs/promises'; // Use the promise-based version of fs
import path from 'path'; // For handling file paths
import { verifyToken } from '../../../../lib/auth'; // Token verification function

export async function POST(req: NextRequest) {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1]; // Bearer token
    if (!token) {
      return NextResponse.json({ message: 'Authorization token missing' }, { status: 401 });
    }

    // Verify the token and get the adminId
    const adminId = await verifyToken(token);
    if (!adminId) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // Parse the form data
    const formData = await req.formData();
    const postHeader = formData.get('title')?.toString();
    const postMessage = formData.get('content')?.toString();

    const file = formData.get('image') as File | null; // Assuming the input field name is 'image'

    // Validation: Ensure all required fields are present
    if (!postHeader || !postMessage) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Handle image upload
    let imageUrl = '';
    if (file) {
      // Validate the file type (optional)
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json({ message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' }, { status: 400 });
      }

      // Define upload path
      const uploadPath = path.join(process.cwd(), 'public/post', file.name);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Write the buffer to the upload path asynchronously
      await fs.writeFile(uploadPath, buffer);
      imageUrl = `/post/${file.name}`; // Use relative path for the image URL
    }

    // Insert the new post into the PostgreSQL database
  // Insert the new post into the PostgreSQL database
const result = await pool.query(
  'INSERT INTO "Post" (title, content, "image", "username", "updatedAt") VALUES ($1, $2, $3, $4, $5)',
  [postHeader, postMessage, imageUrl, adminId, new Date()] // Set updatedAt to current time
);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Failed to create post' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Post created successfully!',
    }, { status: 201 });

  } catch (error) {
    console.error('Error during post creation:', error); // More context for the error
    return NextResponse.json({
      message: 'An unexpected error occurred',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal Server Error',
    }, { status: 500 });
  }
}

// Optional: Handling GET requests to fetch posts
export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM "Post" ORDER BY "createdAt" DESC');
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({
      message: 'An unexpected error occurred',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal Server Error',
    }, { status: 500 });
  }
}
