

const Note = require('../models/Note');

// @desc    Get all notes for logged in user
// @route   GET /api/notes
const getNotes = async (req, res) => {
  try {
   
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Could not fetch notes" });
  }
};

// @desc    Create a note
// @route   POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    const note = new Note({
      user: req.user._id,
      title,
      content,
    });

    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Could not create note" });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Security Check: Kya ye note isi user ka hai?
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized to update this note" });
    }

    note.title = title || note.title;
    note.content = content || note.content;

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: "Server Error: Could not update note" });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Security Check: Kya ye note isi user ka hai?
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await note.deleteOne();
    res.status(200).json({ message: 'Note removed successfully' });
  } catch (error) {
    res.status(500).json({ message: "Server Error: Could not delete note" });
  }
};

module.exports = { getNotes, createNote, deleteNote, updateNote };