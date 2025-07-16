import express from 'express'
import { getSummary,getWeekMood } from '../controllers/summaryController.js'
import { authenticate } from '../middlewares/authenticate.js';

const router=express.Router()

router.get('/summary',authenticate,getSummary)
router.get('/week-mood',authenticate,getWeekMood)

export const summaryRoutes=router;