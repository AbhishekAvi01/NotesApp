
const express = require('express');
const {
  getNotes,
  createNote,
  deleteNote,
  updateNote, 
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Base routes: /api/notes/
router.route('/')
  .get(protect, getNotes)
  .post(protect, createNote);

// ID specific routes: /api/notes/:id
router.route('/:id')
  .delete(protect, deleteNote)
  .put(protect, updateNote); 

module.exports = router;