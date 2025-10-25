import validator from 'validator';
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { json, response } from 'express';
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, password, email } = req.body;

        if (!name || !password || !email) {
            return res.json({ success: false, message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email format" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.json({ success: false, message: "Enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({ name, email, password: hashedPassword });
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Registration failed" });
    }
};

// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

            // Return user data along with token
            return res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    image: user.image || null,
                    phone: user.phone || null,
                    address: user.address || null,
                    dob: user.dob || null,
                    gender: user.gender || null
                }
            });
        } else {
            return res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Login failed" });
    }
};

//API to get user profile data - FIXED
const getProfile = async (req, res) => {
    try {
        console.log('🔍 getProfile called - req.user:', req.user); // Debug log

        // ✅ FIX: Get userID from req.user (set by auth middleware)
        const userID = req.user.id;

        if (!userID) {
            console.log('❌ No user ID in req.user');
            return res.status(400).json({
                success: false,
                message: "User ID not found"
            });
        }

        console.log('🔍 Finding user with ID:', userID);
        const userData = await userModel.findById(userID).select('-password');

        if (!userData) {
            console.log('❌ User not found in database for ID:', userID);
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.log('✅ User found:', userData.email);

        return res.json({
            success: true,
            user: {
                id: userData._id,
                name: userData.name,
                email: userData.email,
                image: userData.image || null,
                phone: userData.phone || null,
                address: userData.address || null,
                dob: userData.dob || null,
                gender: userData.gender || null
            }
        });

    } catch (error) {
        console.log('💥 getProfile error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to get profile"
        });
    }
}

//API to update user profile - FIXED
const updateProfile = async (req, res) => {
    try {
        const userID = req.user.id;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        console.log('🔄 Update profile request received');
        console.log('📦 Request body:', { name, phone, address, dob, gender });

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" });
        }

        const updateData = { name, phone, dob, gender };

        // ✅ FIX: Use JSON.parse (capital JSON)
        if (address) {
            try {
                updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
                console.log('✅ Address parsed successfully');
            } catch (error) {
                console.log('❌ Address parsing error:', error);
                return res.json({ success: false, message: "Invalid address format" });
            }
        }

        if (imageFile) {
            try {
                console.log('📤 Uploading image to Cloudinary...');
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
                const imageURL = imageUpload.secure_url;
                updateData.image = imageURL;
                console.log('✅ Image uploaded:', imageURL);
            } catch (uploadError) {
                console.log('❌ Image upload failed:', uploadError);
                return res.json({ success: false, message: "Image upload failed" });
            }
        }

        console.log('💾 Updating user with data:', updateData);
        await userModel.findByIdAndUpdate(userID, updateData);

        return res.json({ success: true, message: "Profile Updated" });

    } catch (error) {
        console.log('💥 Update profile error:', error);
        return res.json({ success: false, message: "Profile update failed" });
    }
}

// API to book appointment - UPDATED
const bookAppointment = async (req, res) => {
    try {
        const userID = req.user.id; // Get from auth middleware
        const { docID, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docID).select('-password');

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not available' });
        }

        let slots_booked = docData.slots_booked || {};

        //checking for slots availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }

        const userData = await userModel.findById(userID).select('-password');

        // Create simplified data for appointment
        const appointmentUserData = {
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone
        };

        const appointmentDocData = {
            _id: docData._id,
            name: docData.name,
            specialization: docData.specialization,
            fees: docData.fees,
            image: docData.image, // ✅ Add this
            address: docData.address // ✅ Add this
        };

        const appointmentData = {
            userID,
            docID,
            userData: appointmentUserData,
            docData: appointmentDocData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        //save new slots data in docData
        await doctorModel.findByIdAndUpdate(docID, { slots_booked });

        return res.json({ success: true, message: 'Appointment Booked' });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Appointment booking failed" });
    }
}

// API to get user appointment for frontend my-appointment page - UPDATED
const listAppointment = async (req, res) => {
    try {
        const userID = req.user.id; // Get from auth middleware
        const appointments = await appointmentModel.find({ userID });

        return res.json({ success: true, appointments });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Failed to fetch appointments" });
    }
}

//API to cancel appointment - UPDATED
const cancelAppointment = async (req, res) => {
    try {
        const userID = req.user.id; // Get from auth middleware
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        //verify appointment user
        if (appointmentData.userID.toString() !== userID) {
            return res.json({ success: false, message: "Unauthorized to cancel this appointment" });
        }

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

export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment
};