import productos from "../models/productos.js";

export const obtenerProducto = async (req, res) => {
    try{
        const listarProductos = await productos.find();
        res.status(201).json(listarProductos);
    } catch {
        res.satus(500).json({message: "Error al obtener productos"});
    }
};
