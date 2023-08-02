import { ormDataSource } from "../configs/ormDataSource"
import { Rol } from "../models/rol"
import { Usuario } from "../models/usuario";

//obtener ids de la tabla intermedia rol/permiso que correspondan a un rol en especifico
export async function getRolPermisosIds(id: number) {
    //id : id del rol
    try {
        const queryRes = await ormDataSource.getRepository(Rol)
            .createQueryBuilder("rol")
            .leftJoinAndSelect("rol.permisos", "permiso")
            .where("rol.id = :id", { id: id })
            .getOne();

        console.log("rol queryRes",queryRes)
        const permisos = queryRes?.permisos.map(permiso => permiso.id)
        console.log("permisos de rol :",permisos)
        return permisos
    } catch (error) {
        console.log(error)
        return null
    }
}

//obtener ids de la tabla intermedio usuario/clase que correspondan a un usuario en especifico
export async function getUsuarioClasesIds(id: number) {
    //id: id del usuario
    try {
        const queryRes = await ormDataSource.getRepository(Usuario)
        .createQueryBuilder("usuario")
        .leftJoinAndSelect("usuario.clases","clase")
        .where("usuario.id = :id",{id : id})
        .getOne()
        if(!queryRes){return null}

        const clases = queryRes.clases.map(clase => clase.id)
        return clases
    } catch (error) {
        console.log(error)
        return null
    }
}