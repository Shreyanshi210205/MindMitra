//all dashboard routes
import express from 'express'
import { getSummary,getWeekMood,getMoodDays,getMoodTrend, getJournalDays, getJournalEntries } from '../controllers/summaryController.js'
import { authenticate } from '../middlewares/authenticate.js';

const router=express.Router()

router.get('/summary',authenticate,getSummary)
router.get('/week-mood',authenticate,getWeekMood)
router.get('/get-moodDays/:userId',getMoodDays);
router.get('/get-moodTrend/:userId',getMoodTrend);
router.get('/get-journalTrend/:userId',getJournalDays)
router.get('/get-journalEntries/:userId',getJournalEntries)

export const summaryRoutes=router;