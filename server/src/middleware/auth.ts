import type { Request } from 'express';
import type { Response } from 'express';
import type { NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
  email: string;
}

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    console.error('JWT_SECRET_KEY is missing from environment variables');
    return res.status(500).json({ message: 'Internal server error, secret key missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    if (decoded && typeof decoded === 'object' && 'id' in decoded && 'email' in decoded) {
      req.user = decoded as JwtPayload;
      return next();
    } else {
      console.error('Malformed token payload');
      return res.status(403).json({ message: 'Malformed token payload' });
    }
    
  });
};
