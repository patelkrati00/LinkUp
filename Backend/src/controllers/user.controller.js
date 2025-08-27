import httpStatus from 'http-status';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'please provide' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'User Not Found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = crypto.randomBytes(16).toString('hex');
            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ message: 'Login Successful', token });
        } else {
            // 👇 Handle wrong password
            return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Incorrect Password' });
        }

    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e.message}` });
    }
}

const register = async (req, res) => {
    const { name, username, password } = req.body;

    try {

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });
        await newUser.save();
        res.status(httpStatus.CREATED).json({ message: 'User registered successfully' });
    } catch (e) {
        res.json({ message: `Something went wrong ${e.message}` })
    }
}

export { login, register };