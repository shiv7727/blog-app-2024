import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const createTokenAndSaveCookie = async (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
		expiresIn: '7d',
	});

	res.cookie('jwt', token, {
		httpOnly: true, // xsss
		secure: true,
		sameSite: 'strict', // csrf
	});

	await User.findByIdAndUpdate(userId, { token });
	return token;
};

export default createTokenAndSaveCookie;
