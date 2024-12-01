import express from 'express';
import { createNote } from '../controller/note.controller.mjs';

const router = express.Router();

router.post('/create', createNote);

export default router;
