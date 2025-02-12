import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Handle POST requests
export async function POST(request: Request) {
  // Parse the request body
  const { name, email, subject, message } = await request.json();

  // Basic validation
  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h3>New Message from ${name}</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Error sending message' },
      { status: 500 }
    );
  }
}

// Optional: Handle other HTTP methods (e.g., GET, PUT, DELETE)
export async function GET() {
  return NextResponse.json(
    { message: 'GET method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { message: 'PUT method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { message: 'DELETE method not allowed' },
    { status: 405 }
  );
}