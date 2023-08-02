import {DataSource} from "typeorm"
import { Anotacion } from "../models/anotacion"
import { Asignatura } from "../models/asignatura"
import { Curso } from "../models/curso"
import { Genero } from "../models/genero"
import { Nota } from "../models/nota"
import { Permiso } from "../models/permiso"
import { Rol } from "../models/rol"
import { Usuario } from "../models/usuario"
import { Estudiante } from "../models/estudiante"
import { Evaluacion } from "../models/evaluacion"
import { Clase } from "../models/clase"

const DB_PORT = Number(process.env.DB_PORT || 5432)

export const ormDataSource = new DataSource({
    type : "postgres",
    host : "localhost",
    port : DB_PORT,
    username : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    entities : [Anotacion,Asignatura,Curso,Genero,Nota,Permiso,Rol,Usuario,Estudiante,Evaluacion,Clase ],
    synchronize : true
})