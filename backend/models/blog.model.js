import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
	title: {
		type: String,
	},
	blogImage: {
		public_id: {
			type: String,
			required: true,
		},
		url: {
			type: String,
			required: true,
		},
	},
	category: {
		type: String,
	},
	about: {
		type: String,
		minlength: [20, 'Should contain atleast 200 characters'],
	},
	adminName: {
		type: String,
		// required: true,
	},
	adminPhoto: {
		type: String,
		// required: true,
	},
	createdBy: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
	},
});

export const Blog = new mongoose.model('Blog', blogSchema);
