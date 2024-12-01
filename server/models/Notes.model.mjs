import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
});

const Note = mongoose.model('Note', NoteSchema);
export default Note;
