import validator from "validator";
import bcrypt, { hash } from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

//API for adding doctors
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file

        //checkimg for all data to ad doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing details" })
        }
        //validationg email format 
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "please Enter a valid email" })
        }
        //validating strong passowrd
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }
        //bcrypt hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //upload image to cludimnary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: "Doctor Added" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//API for the admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Ïnvalid Credentials" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//api to get all doctors list 
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {

        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//API TO GET ALL APPOINTMENT LIST - FIXED
const appointmentAdmin = async (req, res) => {
    try {
        // ✅ FIX: Only get non-cancelled appointments
        const appointments = await appointmentModel.find({ cancelled: { $ne: true } });
        
        console.log(`📊 Admin appointments fetched: ${appointments.length} (excluding cancelled)`);
        
        res.json({ success: true, appointments });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.json({
            success: false, message: error.message
        });
    }
};

// API to get dashboard data for admin panel - UPDATED
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const allAppointments = await appointmentModel.find({})
        
        // ✅ FIX: Filter out cancelled appointments for active counts
        const activeAppointments = allAppointments.filter(apt => !apt.cancelled);
        const cancelledAppointments = allAppointments.filter(apt => apt.cancelled);

        const dashData = {
            doctors: doctors.length,
            appointments: activeAppointments.length, // Only active appointments
            patients: users.length,
            cancelledAppointments: cancelledAppointments.length, // Add cancelled count
            latestAppointments: activeAppointments.reverse().slice(0,5) // Only show active in latest
        }

        console.log(`📊 Dashboard: ${activeAppointments.length} active, ${cancelledAppointments.length} cancelled`);

        res.json({success: true, dashData})

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message })
    }
}

//API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        //releasing doctor slot
        const { docID, slotDate, slotTime } = appointmentData;

        const doctorData = await doctorModel.findById(docID);

        if (doctorData && doctorData.slots_booked && doctorData.slots_booked[slotDate]) {
            let slots_booked = doctorData.slots_booked;
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

            await doctorModel.findByIdAndUpdate(docID, { slots_booked });
        }

        return res.json({ success: true, message: 'Appointment cancelled' });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

export { addDoctor, loginAdmin, allDoctors, appointmentAdmin, adminDashboard, appointmentCancel }