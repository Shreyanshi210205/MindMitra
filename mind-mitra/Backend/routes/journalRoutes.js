import express from 'express'
import { postJournal,getJournal } from '../controllers/journalController.js';

const router=express.Router();

router.post('/post-journal',postJournal)
router.get('/get-journal/:userId',getJournal)

export const journalRoutes=router;
