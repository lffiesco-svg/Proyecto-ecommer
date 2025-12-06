import mongoose from "mongoose";

const uri = "mongodb+srv://adsotarde:ADSOTARDE@ecommerce.yejpgs0.mongodb.net/Tienda?retryWrites=true&w=majority";

mongoose.connect(uri)

.then(() => console.log("✅ conectado a la base de datos"))

.catch(error => console.log("error al conectar la base de datos", error));