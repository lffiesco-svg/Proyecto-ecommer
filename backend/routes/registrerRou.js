import express from "express";
import { crearUsuario } from "../controllers/registerCon.js";

const router = express.Router();

// ruta para registrar el usuario

router.post("/register", crearUsuario);

export default router;