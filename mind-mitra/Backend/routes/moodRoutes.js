import express from "express";
import { getMood, postMood } from "../controllers/moodControllers.js";

const router=express.Router()

router.get('/get-mood/:userId',getMood)
router.post('/post-mood',postMood)

export const moodRoutes=router