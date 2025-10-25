// middleware/authUser.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const authUser = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization || req.headers.Authorization;
        
        console.log('🔐 Auth Header:', authHeader); // Debug log
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Please login again."
            });
        }

        const token = authHeader.replace('Bearer ', '');
        console.log('🔐 Token received:', token); // Debug log
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Please login again."
            });
        }

        // Verify the token
        console.log('🔐 Verifying token with secret...');
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        console.log('🔐 Token decoded:', token_decode); // Debug log
        
        // Check if the token has the user ID
        if (!token_decode.id) {
            console.log('❌ Token missing user ID');
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again."
            });
        }

        // Verify user exists in database
        console.log('🔐 Finding user with ID:', token_decode.id);
        const user = await User.findById(token_decode.id);
        if (!user) {
            console.log('❌ User not found in database');
            return res.status(401).json({
                success: false,
                message: "User not found. Please login again."
            });
        }

        console.log('✅ User authenticated:', user.email);
        
        // Add user ID to request
        req.user = { id: token_decode.id };
        
        next();
    } catch (error) {
        console.log('💥 Auth middleware error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again."
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            });
        }

        return res.status(500).json({
            success: false,
            message: "Authentication failed. Please try again."
        });
    }
};

export default authUser;