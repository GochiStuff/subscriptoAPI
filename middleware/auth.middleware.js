import { JWT_SECRET } from "../config/env.js";
import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
    try {
        let token;

        // Check if authorization header exists and starts with Bearer
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // If no token found
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        //  use jwt.verify not JWT_EXPIRES_IN
        const decoded = jwt.verify(token, JWT_SECRET);

        // jwt payload usually has "id" not "userId"
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Attach user to request object
        req.user = user;

        next();

    } catch (error) {
        res.status(401).json({
            message: "Unauthorized",
            error: error.message
        });
    }
};

export default authorize;
