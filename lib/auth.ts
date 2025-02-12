import { verify } from 'jsonwebtoken';

const jwtSecretKey = process.env.JWT_SECRET_KEY;

if (!jwtSecretKey) {
  throw new Error('JWT_SECRET_KEY is not defined');
}

export async function verifyToken(token: string) {
  try {
    const decoded = verify(token, jwtSecretKey as string);
    return decoded; // This contains the payload (like admin ID)
  } catch (error) {
    throw new Error('Invalid token');
  }
}
