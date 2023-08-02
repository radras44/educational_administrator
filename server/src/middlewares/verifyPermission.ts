import { ormDataSource } from "../configs/ormDataSource";
import { Request,Response,NextFunction } from "express";
import { Usuario } from "../models/usuario";
import { verifyIdToken, verifySessionToken } from "../utils/authUtils";

//obtener permisos del usuario y verificar permisos
export async function verifyPermissions (req:Request,res:Response,next:NextFunction,requiredPermisos:string[] = []) {
    //req: objecto request
    //res: objeto response
    //next: function next para pasar a la siguiente funcion controladora
    //requiredPermisos: permisos requeridos para que la funcion next se ejecute

    //verificar token
    const decodedToken = await verifySessionToken(req)
    console.log("middleware verifyPermission ===>")
    if(!decodedToken){
        return res.status(403).json({
            error : "middlewareError: token invalido"
        })
    }
    try {
        //obtener permisos del rol asignado al usuario
        const queryRes = await ormDataSource.getRepository(Usuario)
        .createQueryBuilder("usuario")
        .leftJoin("usuario.rol","rol")
        .leftJoin("rol.permisos","permiso")
        //seleccionar solo los permisos del rol
        .select(["usuario.id","rol.rol","permiso.permiso"])
        .where("usuario.id = :id",{id: decodedToken.usuario.id})
        .getOne()

        console.log("usuario : ",queryRes)

        //mapear permisos y obtener un array de string con los nombres de los permisos
        const usuarioPermisos = queryRes?.rol.permisos.map(element => element.permiso)

        //ejecutar la funcion next en caso de que no se requiera ningun permiso
        if(requiredPermisos.length <= 0){
            return next()
        }

        //verificar que el usuario cuente con todos los permisos requeridos
        let hadAuthorization = requiredPermisos.every(permiso => usuarioPermisos?.includes(permiso))
        if(hadAuthorization){
            return next()
        }else{
            return res.status(403).json({
                error: "middlewareError: no autorizado"
            })
        }
    } catch (error) {
        //capturar errores
        console.log("middlewareError: ",error)
        return res.status(403).json({
            error : "middlewareError: no autorizado"
        })
    }
}