import Note from '../models/Notes.model.mjs';
import Joi from "joi";
export const createNote = async (req, res) => {
	const noteSchema = Joi.object({
		title:Joi.string().required(),
		description:Joi.string(),
	})
	const {error} = noteSchema.validate(req.body);

	if(error){
		return res.status(400).json({ message: error.details[0].message });
	}
	const { title, description } = req.body;
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

export const getNotes = async(req,res)=>{
	try {
		const data = await Note.find();

		if(!data){
			throw new Error("An error occured while fetching notes")
		}

		res.status(200).json({
			data
		})
		
	} catch (error) {
		req.status(500).json({
			error:error
		})
	}
}

export const getNotesBy