import express from "express";
import {crearProducto} from "../controllers/createProdCon.js";

const router = express.Router()

// ruta para registrar el producto

router.post("/add", crearProducto);

// obtener
// router.get("/", obtenerProducto);

// cambiar


// eliminar


export default router;