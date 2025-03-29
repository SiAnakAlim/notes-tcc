import express from "express";
import { 
  getNotes, 
  getNoteById, 
  createNote, 
  updateNote, 
  deleteNote 
} from "../controller/NoteController.js";

const router = express.Router();

// Path sekarang relatif terhadap /api di server.js
router.get("/notes", getNotes);        
router.get("/notes/:id", getNoteById); 
router.post("/notes", createNote);     
router.put("/notes/:id", updateNote);  
router.delete("/notes/:id", deleteNote); 

export default router;