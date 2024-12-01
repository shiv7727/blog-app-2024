import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import connectDB from './connectDB.mjs';
import NoteRoute from './routes/Notes.route.mjs';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// DB connection
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send(' hello from express');
});

// routes
app.use('/api/note', NoteRoute);

app.get('*', (req, res) => {
	res.sendStatus(404);
});

app.listen(PORT, () => {
	console.log(`Server is running on PORT ${PORT}`);
});
