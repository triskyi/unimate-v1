import { NextRequest, NextResponse } from 'next/server';
import pool from '../../../../../../lib/db'; // PostgreSQL connection
import fs from 'fs/promises'; // For handling file operations
import path from 'path'; // For path handling
import { verifyToken } from '../../../../../../lib/auth'; // Token verification function

// PUT method to update a post
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Authorization token missing' }, { status: 401 });
    }

    // Verify the token and get the adminId
    const adminId = await verifyToken(token);
    if (!adminId) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // Get postId from the URL parameters
    const { id } = params;

    // Parse the form data
    const formData = await req.formData();
    const postHeader = formData.get('title')?.toString();
    const postMessage = formData.get('content')?.toString();
    const file = formData.get('image') as File | null;

    // Validate required fields
    if (!postHeader || !postMessage) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Handle image upload
    let image = ''; // New image URL if an image is provided
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json({ message: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' }, { status: 400 });
      }

      // Define the upload path
      const uploadPath = path.join(process.cwd(), 'public/post', file.name);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(uploadPath, buffer);
      image = `/post/${file.name}`;
    }

    // Update post in the PostgreSQL database
    const result = await pool.query(
      'UPDATE "Post" SET title = $1, content = $2, "image" = COALESCE($3, "image"), "updatedAt" = $4 WHERE id = $5 AND "username" = $6',
      [postHeader, postMessage, image || null, new Date(), id, adminId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Failed to update post or post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post updated successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error during post update:', error);
    return NextResponse.json({
      message: 'An unexpected error occurred',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal Server Error',
    }, { status: 500 });
  }
}

// DELETE method to delete a post
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Authorization token missing' }, { status: 401 });
    }

    const adminId = await verifyToken(token);
    if (!adminId) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // Get postId from the URL parameters
    const { id } = params;

    // Delete the post from the PostgreSQL database
    const result = await pool.query(
      'DELETE FROM "Post" WHERE id = $1 AND "username" = $2',
      [id, adminId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Failed to delete post or post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error during post deletion:', error);
    return NextResponse.json({
      message: 'An unexpected error occurred',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal Server Error',
    }, { status: 500 });
  }
}
