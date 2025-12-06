import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    productId: {type:String, required:true, unique:true},
    nombreproducto: {type:String, required:true},
    descripcion: {type:String, required:true},
    precio: {type:Number, required:true},
    imagen: {type:String, required:true},
    nombrecliente: {type:String, required:true},
    telefono: {type:String, required:true},
    email: {type:String, required:true},
    sexo: {type:String, required:true},
    direccion: {type:String, required:true},
    fechaentrega: {type:Date, required:true},
    metodoPago: {type:String, required:true},
    estado: {type:String, required:true},
});

// forzar el guardado de información en la colección de productos
const pedidos = mongoose.model("pedidos", productSchema, "pedidos");

export default pedidos;