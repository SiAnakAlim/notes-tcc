import Note from "../models/NoteModel.js";

// Ambil semua notes
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.findAll({ where: { userId: req.user.userId } });
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
    const { title, content } = req.body;
    try {
        const note = await Note.create({
            title,
            content,
            userId: req.user.userId
        });
        res.status(201).json(note);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update note berdasarkan ID
export const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const note = await Note.findOne({ where: { id, userId: req.user.userId } });
        if (!note) return res.status(404).json({ message: "Note not found" });
        note.title = title;
        note.content = content;
        await note.save();
        res.json(note);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Hapus note berdasarkan ID
export const deleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findOne({ where: { id, userId: req.user.userId } });
        if (!note) return res.status(404).json({ message: "Note not found" });
        await note.destroy();
        res.json({ message: "Note deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
