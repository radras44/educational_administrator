import { Request, Response } from "express"
import firebaseAdmin from "firebase-admin"
import regex from "../../utils/regex"
import { ormDataSource } from "../../configs/ormDataSource"
import { Usuario } from "../../models/usuario"
import jwt from "jsonwebtoken"
import { verifySessionToken } from "../../utils/authUtils"

async function getUsuarioToToken(id: number) {
    const usuario = await ormDataSource.getRepository(Usuario)
        .createQueryBuilder("usuario")
        .leftJoinAndSelect("usuario.rol", "rol")
        .leftJoinAndSelect("usuario.curso", "curso")
        .leftJoinAndSelect("rol.permisos", "permiso")
        .leftJoinAndSelect("usuario.clases", "clase")
        .where("usuario.id = :id", { id: id })
        .getOne()

    return usuario
}

function getUsuarioTokenObj(usuario: Usuario) {
    let permisos: string[] = []
    if (usuario.rol?.permisos) {
        permisos = usuario.rol.permisos.map(element => element.permiso)
    }
    let tokenObj = {
        usuario: usuario,
        permisos: permisos
    }
    return tokenObj
}

//logearse con firebase (usando el provedor de google auth)
export const signInWithFirebase = async (req: Request, res: Response) => {
    const { idToken, userObj } = req.body
    if (!userObj || !idToken) {
        return res.status(400).json({
            error: "faltan credenciales"
        })
    }
    try {
        //verificar idToken de firebase
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken)
        const username = userObj.displayName
        console.log(`firebase auth Token decodificado => \nnombre de usuario : ${username}`)
        const email = decodedToken.email
        //verificar dominio con una expresionregular
        if (!regex.emailDom.test(String(email))) {
            return res.status(403).json({ error: "El correo electronico no es valido" })
        }


        //bloque futuro para agregar session de alumnos----------
        if (regex.studentEmail.test(String(email))) {
            return res.status(401).json({ error: "el correo es valido, pero aun no se permite su uso" })
        }

        //comprobar si ya esta registrado el correo, en caso contrario crearlo  
        const userExist = await ormDataSource.getRepository(Usuario)
            .createQueryBuilder("usuario")
            .where("usuario.email = :email", { email: email })
            .getOne()

        let userId = null
        if (userExist) {
            //se usa el id ya obtenido
            userId = userExist.id
        } else {
            const createdUser = await ormDataSource.createQueryBuilder()
                .insert()
                .into(Usuario)
                .values({
                    email: String(email),
                    nombre_de_usuario: String(username)
                })
                .returning("*")
                .execute()
            //se usa el id del registro recien creado
            userId = createdUser.identifiers[0].id
        }

        //buscar usuario ya creado o actualizado segun el userId
        const usuario = await getUsuarioToToken(userId)

        if (!usuario) { return res.status(500).json({ error: "ha ocurrido un error a la hora de iniciar sesion" }) }

        //crear y enviar token de sesion con la informacion del usuario
        const tokenObj = getUsuarioTokenObj(usuario)

        if (!process.env.JWT_SECRET || !tokenObj) {
            return res.status(500).json({ error: "error del servidor" })
        }
        const sessionToken = jwt.sign(tokenObj, process.env.JWT_SECRET)
        return res.status(200).json({
            message: "Inicio de sesion exitoso",
            sessionToken: sessionToken
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "error del servidor"
        })
    }
}

export const updateSessionToken = async (req: Request, res: Response) => {
    try {
        //verificar token
        const decodedToken = await verifySessionToken(req)
        if (!decodedToken) { return res.status(403).json({ error: "no autorizado" }) }
        //obtener informacion del usuario
        const usuario = await getUsuarioToToken(decodedToken.usuario.id)
        if (!usuario) { return res.status(500).json({ error: "ha ocurrido un error a la hora de crear un nuevo registro" }) }

        //crear y enviar token de sesion con la informacion del usuario
        const tokenObj = getUsuarioTokenObj(usuario)
        if (!process.env.JWT_SECRET || !tokenObj) {
            return res.status(500).json({ error: "error del servidor" })
        }
        const sessionToken = jwt.sign(tokenObj, process.env.JWT_SECRET)
        return res.status(200).json({
            message: "token actualizado con exito",
            result: sessionToken
        })

    } catch (error) {
        return res.status(500).json({ error: "error del servidor" })
    }
}

export const getClientSessionData = async (req: Request, res: Response) => {
    const decodedToken = await verifySessionToken(req)
    if (!decodedToken) { return res.status(403).json({ error: "no autorizado" }) }
    return res.status(200).json({
        result: {
            usuario: decodedToken.usuario,
            permisos: decodedToken.permisos,
        }
    })
}



