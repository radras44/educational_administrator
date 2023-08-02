import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import bodyParser from "body-parser"

//importacion de rutas
import usuarioRoutes from "./routes/usuarioRoutes"
import rolRoutes from "./routes/rolRoutes"
import authRoutes from "./routes/authRoutes"
import permisoRoutes from "./routes/permisoRoutes"
import generoRoutes from "./routes/generoRoutes"
import cursoRoutes from "./routes/cursoRoutes"
import estudianteRoutes from "./routes/estudianteRoutes"
import asignaturaRoutes from "./routes/asignaturaRoutes"
import claseRoutes from "./routes/claseRoutes"
import evaluacionRoutes from "./routes/evaluacionRoutes"
import notaRoutes from "./routes/notaRoutes"
const app = express()

//configuraciones
app.use(cors({
    origin: "http://localhost:3000",
    exposedHeaders : ["idToken","sessionToken"]
}))
app.use(bodyParser.json({limit:"10mb"}))

//usar rutas
app.use("/asignatura",asignaturaRoutes)
app.use("/estudiante",estudianteRoutes)
app.use("/curso",cursoRoutes)
app.use("/usuario",usuarioRoutes)
app.use("/rol",rolRoutes)
app.use("/auth",authRoutes)
app.use("/permiso",permisoRoutes)
app.use("/genero",generoRoutes)
app.use("/clase",claseRoutes)
app.use("/evaluacion",evaluacionRoutes)
app.use("/nota",notaRoutes)

export default app