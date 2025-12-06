import express from "express";
import {
    crearPedido,
    obtenerPedido,
    obtenerTodos,
    actualizarEstado,
    eliminarPedido
} from "../controllers/pedidos.js";

const router = express.Router();

// Crear un nuevo pedido
router.post("/crear", crearPedido);

// Obtener un pedido por productId
router.post("/obtener", obtenerPedido);

// Obtener todos los pedidos
router.get("/todos", obtenerTodos);

// Actualizar estado del pedido
router.put("/actualizar-estado", actualizarEstado);

// Eliminar pedido
router.delete("/eliminar", eliminarPedido);

export default router;
