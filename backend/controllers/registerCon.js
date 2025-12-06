import usuarios from "../models/usuarios.js";
import bcrypt from "bcrypt";

// crear usuarios

export const crearUsuario = async (req, res) => {
    try{
        const{ name, lastName, tel, email, pass}=req.body;
        if(!name || !lastName || !tel || !email || !pass) {
            return res.status(400).json ({message: "Todos los campos son obligatorios"});
        };


        // validar usuario
        const ExistUser = await usuarios.findOne({email});
        if(ExistUser) {
            res.status(400).json({message:"Ya está registrado este correo"});
        };


        //encriptar la contraseña
        const saltRounds = 10;
        const hashedPass = await bcrypt.hash(pass, saltRounds);

        // crear usuario en la base de datos
        const newUser = new usuarios({name, lastName, tel, email, pass:hashedPass});
        await newUser.save();
        res.status(201).json({
            mesagge:"✅Usuario registrado con éxito",
            usuario:{
                name:newUser.name,
                lastName:newUser.lastName,
                email:newUser.email,
                tel:newUser.tel,
                pass:newUser.pass
            }
        
        });

    } catch (error){
        console.error(" ❗️ Error al registrar el usuario", error);
        res.status(400).json({message:"❗️ Error a registrar el usuario",error:error.message});
    };
};

/* obtener usuario

export const obtenerUsuario = async (req, res) => {
    try {
        const listarUsuarios = await usuarios.find();
        res.status(201).json(listarUsuarios);
        
    } catch (error) {
        console.error(" ❗️ Error al obtener el usuarios", error);
        res.status(400).json({message:"❗️ Error a obtener usuarios",error:error.message});
    }
} */
