import productos from "../models/productos.js";

// crear producto

export const crearProducto = async (req, res) => {
    try{
        const{productId, nombre, descripcion, precio, imagen}=req.body;

        if(!productId || !nombre || !descripcion|| !precio || !imagen) {
            return res.status(400).json ({message: "Todos los campos son obligatorios"});
        };

        const ExistProduct = await productos.findOne({nombre});
        
        if(ExistProduct) {
            res.status(400).json({message:"Ya está registrado este producto"});
        };
        
        // crear producto en la base de datos
        const newProduct=new productos({
            productId,
            nombre,
            descripcion,
            precio,
            imagen
        });

        await newProduct.save();
        res.status(201).json({mesagge:"✅producto guardado con éxito"});

    } catch (error){
        console.error(" ❗️ Error al guardar el producto", error);
        res.status(400).json({mesagge:"❗️ Error al ingresar el producto"});

    }
}

/* obtener producto

export const obtenerProducto = async (req, res) => {
    try{
        const listarProductos = await productos.find();
        res.status(201).json(listarProductos);
    } catch {
        res.satus(500).json({message: "Error al obtener productos"});
    }
};

*/
