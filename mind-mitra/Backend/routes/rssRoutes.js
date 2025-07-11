import express from 'express';
import { getArticles } from '../controllers/rssController.js';

const router = express.Router();

router.get('/mindful', getArticles)
export const rssRoutes=router;
