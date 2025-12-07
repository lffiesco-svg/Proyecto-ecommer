import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import user from "../models/usuarios.js";
import dotenv from "dotenv";

dotenv.config();

// ========== ALMACENAR CÓDIGOS TEMPORALMENTE ==========
// En producción usa Redis o una base de datos
const codigosVerificacion = new Map();

// ========== CONFIGURAR NODEMAILER ==========
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user:  process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ========== FUNCIÓN: SOLICITAR CÓDIGO DE VERIFICACIÓN ==========
export const solicitarCodigo = async (req, res) => {
    try {
        const { email } = req.body;

        // Validar que el email venga en la petición
        if (!email) {
            return res.status(400).json({ message: "El email es requerido" });
        }

        // Verificar que el usuario exista en la base de datos
        const usuario = await user.findOne({ email: email });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Generar código de 6 dígitos
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        // Guardar el código temporalmente (expira en 10 minutos)
        codigosVerificacion.set(email, {
            codigo: codigo,
            expira: Date.now() + 10 * 60 * 1000 // 10 minutos
        });

        // Configurar el correo
        const mailOptions = {
            from: process.env.EMAIL_USER, // ← Tu email
            to: usuario.email,
            subject: "🔐 Código de Verificación - TechStore Pro",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #4F46E5; margin: 0;">TechStore Pro</h2>
    </div>

    <h3 style="color: #333;">🔒Recuperación de Contraseña</h3>

    <p>Hola <strong>${usuario.name}</strong>,</p>

    <p>Recibimos una solicitud para restablecer tu contraseña.</p>

    <p>Tu código de verificación es:</p>

    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                margin: 30px 0;">
        <h1 style="color: black;
                font-size: 36px;
                letter-spacing: 8px;
                margin: 0;
                font-family: monospace;">
            ${codigo}
        </h1>
    </div>

    <p style="color: #666; font-size: 14px;">
        Este código expirará en <strong>15 minutos</strong>.
    </p>

    <p style="color: #666; font-size: 14px;">
        Si no solicitaste este cambio, ignora este email y tu contraseña permanecerá segura.
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

    <p style="color: #999; font-size: 12px; text-align: center;">
        © 2025 TechStore Pro — Tu tienda de tecnología de confianza
    </p>
</div>
        `};

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Código de verificación enviado al correo",
            email: email
        });

    } catch (error) {
        console.error("Error al solicitar código:", error);
        res.status(500).json({
            message: "Error al enviar código de verificación",
            error: error.message
        });
    }
};

// ========== FUNCIÓN: VERIFICAR CÓDIGO Y CAMBIAR CONTRASEÑA ==========
export const cambiarContrasena = async (req, res) => {
    try {
        const { email, codigo, nuevaContrasena } = req.body;

        // Validar campos obligatorios
        if (!email || !codigo || !nuevaContrasena) {
            return res.status(400).json({
                message: "Email, código y nueva contraseña son requeridos"
            });
        }

        // Validar longitud de contraseña
        if (nuevaContrasena.length < 6) {
            return res.status(400).json({
                message: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        // Verificar que el código existe y no ha expirado
        const codigoGuardado = codigosVerificacion.get(email);
        
        if (!codigoGuardado) {
            return res.status(400).json({
                message: "No se ha solicitado un código para este email"
            });
        }

        // Verificar si el código ha expirado
        if (Date.now() > codigoGuardado.expira) {
            codigosVerificacion.delete(email);
            return res.status(400).json({
                message: "El código ha expirado. Solicita uno nuevo"
            });
        }

        // Verificar que el código sea correcto
        if (codigoGuardado.codigo !== codigo) {
            return res.status(400).json({
                message: "Código de verificación incorrecto"
            });
        }

        // Buscar el usuario
        const usuario = await user.findOne({ email: email });
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(nuevaContrasena, salt);

        // Actualizar la contraseña en la base de datos
        usuario.pass = contrasenaEncriptada;
        await usuario.save();

        // Eliminar el código usado
        codigosVerificacion.delete(email);

        // Enviar correo de confirmación
        const mailOptions = {
            from: "lffiesco@gmail.com", // ← Tu email
            to: usuario.email,
            subject: "✅ Contraseña Actualizada - TechStore Pro",
            html: `
               <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;">
    </div>
    <div style="text-align: center; margin-bottom: 30px;">
        <span style="color: white; font-size: 30px;"></span>
        <h2 style="color: #4F46E5; margin: 0;">🔐Contraseña Actualizada</h2>
    </div>

    <p>Hola <strong>${usuario.name}</strong>,</p>

    <p>Tu contraseña ha sido actualizada exitosamente.</p>

    <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>

    <div style="text-align: center; margin: 30px 0;">
        <a href="http://127.0.0.1:5500/src/pages/login.html"
            style="background: linear-gradient(to right, #4F46E5 , #7C3AED);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;">
            Iniciar Sesión
        </a>
    </div>

    <p style="color: #d62626; font-size: 14px;">
        ⚠️ Si no realizaste este cambio, contacta a soporte inmediatamente.
    </p>

    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

    <p style="color: #999; font-size: 12px; text-align: center;">
        © 2025 TechStore Pro — Tu tienda de tecnología de confianza
    </p>
</div>

            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Contraseña actualizada correctamente",
            usuario: {
                name: usuario.name,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        res.status(500).json({
            message: "Error al cambiar la contraseña",
            error: error.message
        });
    }
};