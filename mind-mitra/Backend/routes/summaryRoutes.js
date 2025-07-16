import express from 'express'
import { getSummary } from '../controllers/summaryController.js'
import { authenticate } from '../middlewares/authenticate.js';

const router=express.Router()

router.get('/summary',getSummary)

export const summaryRoutes=router;