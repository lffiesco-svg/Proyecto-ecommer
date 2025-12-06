import express from "express";
import { solicitarCodigo, cambiarContrasena } from "../controllers/recuperarCon.js";

const router = express.Router();

// Ruta para solicitar código de verificación
router.post('/solicitar-codigo', solicitarCodigo);

// Ruta para verificar código y cambiar contraseña
router.post('/cambiar-contrasena', cambiarContrasena);

export default router;