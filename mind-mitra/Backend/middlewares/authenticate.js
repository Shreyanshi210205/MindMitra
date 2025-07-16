import jwt from 'jsonwebtoken';
import admin from '../firebase.js'; // your configured Firebase Admin instance

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // Try verifying Firebase token first
  try {
    const decodedFirebase = await admin.auth().verifyIdToken(token);
    req.userId = decodedFirebase.uid;
    req.userEmail = decodedFirebase.email;
    return next();
  } catch (firebaseError) {
    // If Firebase verification fails, try custom JWT
    try {
      const decodedJWT = jwt.verify(token, process.env.JWT_KEY);
      req.userId = decodedJWT.userId;
      req.userEmail = decodedJWT.email;
      return next();
    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
};
