// importamos el modelo de la base de datos

import user from "../models/usuarios.js";

//Obtener perfil del usuario de la base de datos
export const obtenerPerfil= async (req, res)=>{
    try {
        const {email} =req.body;
        if(!email){
            return res.status(400).json({message:"Email es requerido"})
        }
// traer el correo del usuario de la base de datos
const usuario = await user.findOne({email:email}).select('-pass');
if(!usuario) {
    return res.status(400).json({message:"Usuario no encontrado"});
}
res.status(200).json({
    usuario:{
           name: usuario.name,
           lastName: usuario.lastName,
           tel: usuario.tel,
            email: usuario.email,
           pass: usuario.pass
    }
})
        
    } catch (error) {
        res.status(500).json({message:"Error al obtener el perfil", error: error.message});
    }
};

//Actualizar perfil del usuario
export const actualizarPerfil= async (req, res)=>{
    try {
        const {email, name, lastName, tel} =req.body;

        //Validar campos obligatorios
        if (!email){
            return res.status(400).json({message:"Email es requerido"});
        }
        
        if (!name || !lastName || !tel){
            return res.status(400).json({message:"Todos los campos son obligatorios"});
        }

        //Buscar y actulizar usuario
        const usuarioActualizado = await user.findOneAndUpdate(
            {email: email},
            {name: name, 
            lastName: lastName, 
            tel: tel
        },
            {new: true}

            //No va selecionar el campo pass
        ).select('-pass');

        if(!usuarioActualizado){
            return res.status(400).json({message:"Usuario no encontrado"});
        }

   res.status(200).json({
    message:"Usuario actualizado correctamente",
   usuario:{
    id: usuarioActualizado._id,
    name: usuarioActualizado.name,
    lastName: usuarioActualizado.lastName,
    email: usuarioActualizado.email,
    tel: usuarioActualizado.tel
    
   }});

    } catch (error) {
        res.status(500).json({message:"Error al actualizar el perfil", error: error.message});
        
    }
};

// Eleminar perfil del usuario
export const eliminarPerfil= async (req, res)=>{
    try {
        const {email} =req.body;

        //validar que el email este presente
        if(!email){
            return res.status(400).json({message:"Email es requerido"});
        }
        //Buscar y eliminar usuario
        const usuarioEliminado = await user.findOneAndDelete({email: email});
        if(!usuarioEliminado){
            return res.status(400).json({message:"Usuario no encontrado"});
        }
       res.status(200).json({
        message:"Usuario eliminado correctamente",
        usuario:{
            id: usuarioEliminado._id,
            name: usuarioEliminado.name,
            lastName: usuarioEliminado.lastName,
            email: usuarioEliminado.email,
            tel: usuarioEliminado.tel
        }
    });
        
    } catch (error) {
        res.status(500).json({message:"Error al eliminar el perfil", error: error.message});
        
    }
};

