import firebaseAdmin from "firebase-admin"
import regex from "./regex"
import { Request } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
//verificar token de firebase para autenticar registro y obtencion de token de sesion
export async function verifyIdToken (req:Request) {
    const idToken = req.headers.idToken
    if(!idToken){
        return false
    }
    try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(String(idToken))
        //verificar dominio con una expresion regular guardada en el directorio config
        if (!regex.emailDom.test(String(decodedToken.email))) {
            return false
        }
        return decodedToken
    } catch (error) {
        return false
    }
}
//verificar token de sesion 
export async function verifySessionToken (req:Request) {
    const sessionTokenHeader = req.headers.sessiontoken as string
    if(!sessionTokenHeader || !sessionTokenHeader.startsWith("Bearer ")){
        return false
    }
    try {
        const JWT_SECRET = process.env.JWT_SECRET
        if(!JWT_SECRET){return false}
        const sessionToken = sessionTokenHeader.substring(7)
        const decodedToken : JwtPayload = await jwt.verify(sessionToken,JWT_SECRET) as JwtPayload
        //verificar dominio con una expresion regular guardada en el directorio config
        if (!regex.emailDom.test(String(decodedToken.usuario.email))){
            return false
        }
        return decodedToken
    } catch (error) {
        console.log(error)
        return false
    }
}


