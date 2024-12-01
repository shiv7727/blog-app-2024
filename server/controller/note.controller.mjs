import Note from '../models/Notes.model.mjs';
export const createNote = async (req, res) => {
	const { title, description } = req.body;
	console.log("yes ")
	if (!title) {
		return res.status(400).json({
			error: 'title is required',
		});
	}
	const newNote = new Note({
		title,
		description,
	});
	await newNote.save();

	return res.status(201).json({
		message: 'Note created Successfully !!',
		note: newNote,
	});
};
