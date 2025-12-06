import express from 'express';
import cors from 'cors';
import "./db/db.js";
import createProd from './routes/createProdRou.js';
import register from './routes/registrerRou.js';
import login from './routes/loginRou.js';
import showProd from './routes/productosRou.js';
import PerfilRouter from './routes/perfil.js'; 
import pedidosRoutes from "./routes/pedidos.js";
import recuperarRoutes from "./routes/recuperarRou.js";


const app = express();

app.use(express.json());
// habilitar todas las rutas

app.use(cors());

// primera ruta

app.get('/', (req, res) => {
    res.send('Bienvenido al curso de node express');
});

app.use("/api/", createProd);
app.use("/api/", register);
app.use("/api/", login);
app.use("/api/", showProd);
app.use("/api/", PerfilRouter);
app.use("/api/pedidos", pedidosRoutes);
app.use('/api/recuperar', recuperarRoutes);



app.listen(8081, () => console.log('servidor corriendo en http://localhost:8081'));