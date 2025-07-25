import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config()
export const sendEmail=async(req,res)=>{
    const password=process.env.PASS;
    const transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'shreya.nshi2102@gmail.com',
            pass:password
        }
});
const {name,email,feedback}=req.body;
try {
    await transporter.sendMail({
        from:email,
        to:'shreyanshi.230101129@iiitbh.ac.in',
        subject:`Feedback for MindMitra from ${name}`,
        text:`From:${name} <${email}>\n\n${feedback}`
    })
    res.status(200).send('Email sent!');
} catch (error) {
    res.status(500).send('Failed to send email')
}


}