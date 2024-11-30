import cloudinary from 'cloudinary';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import createTokenAndSaveCookie from '../jwt/AuthToken.js';

// register controller func
export const register = async (req, res, next) => {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).json({
			message: 'No file uploaded photo is required ',
		});
	}

	const photo = req.files.photo;

	const allowedFormats = ['image/jpeg', 'image/png', 'image/jpeg'];

	if (!allowedFormats.includes(photo.mimetype)) {
		return res.status(400).json({
			message: 'Invalid photo format. Only jpg and png allowed ',
		});
	}

	const { email, name, password, phone, education, role } = req.body;
	if (!email || !name || !password || !phone || !education || !role || !photo) {
		return res.status(400).json({
			message: 'All Fields are required',
		});
	}

	const user = await User.findOne({ email });
	if (user) {
		return res.status(400).json({
			message: 'User already exists!!',
		});
	}

	// Upload an image
	const cloudinaryResponse = await cloudinary.uploader.upload(
		photo.tempFilePath,
	);

	if (!cloudinaryResponse || cloudinary.error) {
		console.log(cloudinaryResponse.error);
		return;
	}

	const hashPassword = await bcrypt.hash(password, 10);

	const newUser = new User({
		email,
		name,
		photo: {
			public_id: cloudinaryResponse.public_id,
			url: cloudinaryResponse.url,
		},
		phone,
		education,
		role,
		password: hashPassword,
	});
	await newUser.save();

	if (newUser) {
		const token = await createTokenAndSaveCookie(newUser._id, res);
		return res.status(201).json({
			message: 'User registered successfully !',
			user: newUser,
			token,
		});
	}

	res.send('Hello from register controller');
};

// login controller function

export const login = async (req, res, next) => {
	const { email, password, role } = req.body;

	try {
		if (!email || !password || !role) {
			return res.status(400).json({
				message: 'Please fill required fields',
			});
		}
		const user = await User.findOne({ email }).select('+password');

		if (!user.password) {
			return res.status(400).json({
				message: 'User password is missing',
			});
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!user || !isMatch) {
			return res.status(403).json({
				message: 'Inavlid email or password',
			});
		}

		if (user.role !== role) {
			return res.status(400).json({
				message: `Give role ${role} not found `,
			});
		}

		const token = await createTokenAndSaveCookie(user._id, res);
		res.status(200).json({
			message: 'User is loggen in successfully !!',
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				education: user.education,
				token: token,
			},
		});
	} catch (error) {
		console.log('error', error);
		return res.status(500).json({
			message: 'Internal server error',
		});
	}
};
