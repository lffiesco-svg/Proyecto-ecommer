import express from "express";
import { login } from "../controllers/loginCon.js";

const router = express.Router();

// verificar usuario

router.post("/login", login);

export default router;