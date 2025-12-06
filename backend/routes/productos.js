import express from "express";
import { CrearProducto ,obtenerProductos} from "../controllers/Productos.js";
const router = express.Router();

//Ruta para crear productos
router.post("/", CrearProducto);
// ruta ara obtener todos los productos
router.get("/", obtenerProductos);

