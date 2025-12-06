import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    productId: {type:String, required:true, unique:true},
    nombre: {type:String, required:true},
    descripcion: {type:String, required:true},
    precio: {type:Number, required:true},
    imagen: {type:String, required:true}
});

// forzar el guardado de información en la colección de productos
const productos = mongoose.model("productos", productSchema, "productos");

export default productos;
