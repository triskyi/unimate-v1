import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Handle POST requests
export async function POST(request: Request) {
  // Parse the request body
  const { email } = await request.json();

  // Basic validation
  if (!email) {
    return NextResponse.json(
      { message: 'Email is required' },
      { status: 400 }
    );
  }

  // Create transporter for sending emails
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Send a confirmation email to the subscriber
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Subscription Confirmation',
      html: `
        <h3>Thank you for subscribing!</h3>
        <p>You have successfully subscribed to our newsletter.</p>
        <p>We will keep you updated with the latest news and updates.</p>
      `,
    });

    // Optionally, save the email to a database here
    // Example: await saveEmailToDatabase(email);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Error processing subscription' },
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