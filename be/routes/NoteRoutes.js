import express from "express";
import { 
  getNotes, 
  getNoteById, 
  createNote, 
  updateNote, 
  deleteNote 
} from "../controllers/NoteController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// Path sekarang relatif terhadap /api di server.js
router.get("/notes", verifyToken, getNotes);          
router.get("/notes/:id", verifyToken, getNoteById);   
router.post("/notes", verifyToken, createNote);       
router.put("/notes/:id", verifyToken, updateNote);    
router.delete("/notes/:id", verifyToken, deleteNote);  

export default router;