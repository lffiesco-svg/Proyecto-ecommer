import pedidos from "../models/pedidos.js";

// Crear nuevo pedido
export const crearPedido = async (req, res) => {
    try {
        const {
            productId,
            nombreproducto,
            descripcion,
            precio,
            imagen,
            nombrecliente,
            telefono,
            edad,
            email,
            sexo,
            ciudad,
            codigopostal,
            direccion,
            fechaentrega,
            metodoPago,
            estado
        } = req.body;

        // Validación simple
        if (!productId || !nombreproducto || !precio || !nombrecliente) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        // Verificar si el pedido ya existe
        const existePedido = await pedidos.findOne({ productId });
        if (existePedido) {
            return res.status(400).json({ message: "Este ID de producto ya está registrado" });
        }

        const nuevoPedido = new pedidos({
            productId,
            nombreproducto,
            descripcion,
            precio,
            imagen,
            nombrecliente,
            telefono,
            edad,
            email,
            sexo,
            ciudad,
            codigopostal,
            direccion,
            fechaentrega,
            metodoPago,
            estado
        });

        await nuevoPedido.save();

        res.status(201).json({
            message: "Pedido creado correctamente",
            pedido: nuevoPedido
        });

    } catch (error) {
        res.status(500).json({ message: "Error al crear pedido", error: error.message });
    }
};


// Obtener un pedido por ID
export const obtenerPedido = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId es requerido" });
        }

        const pedido = await pedidos.findOne({ productId });

        if (!pedido) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json({ pedido });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener el pedido", error: error.message });
    }
};


// Obtener todos los pedidos
export const obtenerTodos = async (req, res) => {
    try {
        const lista = await pedidos.find();

        res.status(200).json({ pedidos: lista });

    } catch (error) {
        res.status(500).json({ message: "Error al obtener los pedidos", error: error.message });
    }
};


// Actualizar estado del pedido
export const actualizarEstado = async (req, res) => {
    try {
        const { productId, nuevoEstado } = req.body;

        if (!productId || !nuevoEstado) {
            return res.status(400).json({ message: "productId y nuevoEstado son requeridos" });
        }

        const pedidoActualizado = await pedidos.findOneAndUpdate(
            { productId },
            { estado: nuevoEstado },
            { new: true }
        );

        if (!pedidoActualizado) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json({
            message: "Estado actualizado correctamente",
            pedido: pedidoActualizado
        });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar estado", error: error.message });
    }
};


// Eliminar pedido
export const eliminarPedido = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "productId es requerido" });
        }

        const eliminado = await pedidos.findOneAndDelete({ productId });

        if (!eliminado) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }

        res.status(200).json({ message: "Pedido eliminado correctamente" });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar pedido", error: error.message });
    }
};
