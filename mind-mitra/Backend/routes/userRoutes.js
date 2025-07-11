import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/check-auth', authenticate, (req, res) => {
  res.status(200).json({ message: 'User is authenticated', userId: req.user.userId });
});
export const userRoutes=router;
