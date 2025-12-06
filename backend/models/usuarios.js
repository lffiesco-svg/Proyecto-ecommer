import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: {type:String, required:true},
    lastName: {type:String, required:true},
    tel: {type:String, required:true},
    email: {type:String, required:true, unique:true},
    pass: {type:String, required:true}
});

const usuarios = mongoose.model("usuarios", UserSchema, "usuarios");


export default usuarios;