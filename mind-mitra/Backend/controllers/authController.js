import {User} from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admin from "../firebase.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email :req.body.email});
    if (userExists)
      return res.status(400).json({ error: "User already exists" });
    const hashedPass = await bcrypt.hash(password, 10);
    const user = User.create({ email, password: hashedPass });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, {
      expiresIn: "12h",
    });
    res.status(201).json({ message: "Signup Successful", token });
  } catch (err) {
    res.status(500), json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists)
      return res.status(400).json({ error: "User doesnt exist" });
    const match = await bcrypt.compare(req.body.password, userExists.password);
    if (!match) return res.status(400).json({ error: "Password incorrect" });
    const token = jwt.sign({ userId: userExists._id }, process.env.JWT_KEY, {
      expiresIn: "12h",
    });
    res.status(201).json({ message: "Login successful",token});
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const google=async(req,res)=>{
  const idToken = req.headers.authorization?.split(' ')[1] ;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userExists = await User.findOne({ email: decodedToken.email });
    if(!userExists) await User.create({email:decodedToken.email})

    res.json({ uid, email: decodedToken.email, name: decodedToken.name });
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

