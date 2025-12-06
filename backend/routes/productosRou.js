import express from "express";
import { obtenerProducto } from "../controllers/productosCon.js";

const router = express.Router()


router.get("/productos", obtenerProducto);

export default router;
