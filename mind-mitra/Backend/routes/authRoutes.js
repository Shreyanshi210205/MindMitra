import express from "express";
import { validate } from "../middlewares/validate.js";
import { signup,login, google } from "../controllers/authController.js";
import { signupSchema,loginSchema } from "../validators/authValidate.js"; 
const router =express.Router()

router.post('/signup',validate(signupSchema),signup)
router.post('/login',validate(loginSchema),login)
router.post('/google-login',google)

export const authRoutes= router;
