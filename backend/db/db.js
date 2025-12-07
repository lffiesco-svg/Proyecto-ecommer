import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => console.log("✅ Conectado a la base de datos"))
    .catch(error => console.log("❌ Error al conectar la base de datos", error));

