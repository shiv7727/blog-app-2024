import cloudinary from 'cloudinary';
import { User } from '../models/user.model.js';
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
	console.log(cloudinaryResponse);
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
		password,
	});
	await newUser.save();

	if (newUser) {
		return res.status(201).json({
			message: 'User registered successfully !',
			user: newUser,
		});
	}

	res.send('Hello from register controller');
};
