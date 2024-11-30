import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/user.route.js';
import fileUpload from 'express-fileupload';
import cloudinary from 'cloudinary';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;
const mongourl = process.env.MONGODB_URI;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/',
	}),
);

// Cloudinary setup
// Configuration
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_SECRET_KEY, // Click 'View API Keys' above to copy your API secret
});

// DB connection
mongoose
	.connect(mongourl)
	.then(() => {
		console.log('Connected to MongoDB successfully');
	})
	.catch((err) => {
		console.error('Failed to connect to MongoDB:', err);
	});

// Routes
app.get('/', (req, res) => {
	res.send('Welcome to the Blog API');
});

app.use('/api/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal Server Error';
	console.log('get err', err.message);
	res.status(statusCode).json({
		success: false,
		message,
		statusCode,
	});
});

app.listen(PORT, () => {
	console.info(`Server is running on port ${PORT}`);
});
