import Note from "../models/NoteModel.js";

// Ambil semua notes
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.findAll();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ambil satu note berdasarkan ID
export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tambah note baru
export const createNote = async (req, res) => {
    try {
        const newNote = await Note.create(req.body);
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update note berdasarkan ID
export const updateNote = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        await note.update(req.body);
        res.json({ message: "Note updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hapus note berdasarkan ID
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findByPk(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        await note.destroy();
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
