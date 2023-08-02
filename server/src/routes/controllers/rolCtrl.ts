import { Request, Response } from "express";
import { ormDataSource } from "../../configs/ormDataSource";
import { Rol } from "../../models/rol";
import { getRolPermisosIds } from "../../utils/queryHelper";

//actualizar permisos de un rol en especifico
export async function updatePermisos(req: Request, res: Response) {
    const id = Number(req.params.id)
    const { add, remove } = req.body
    if (!id || !add || !remove) { return res.status(400).json({ error: "falta informacion" }) }
    try {
        //obtener permisos asignados al rol (ids de permisos)
        const rolPermisosIdxs = await getRolPermisosIds(id)
        //filtrar add ,a solo los permisos que no esteen asignadas al rol
        if (!rolPermisosIdxs) { return res.status(500).json({ error: "error del servidor, no se ha podido encontrar el rol" }) }
        const filteredAdd = add.filter((idx: number) => !rolPermisosIdxs?.includes(idx))

        //modificar elementos de permisos (propiedad para acceder a la tabla intermedia rol/permiso)
        await ormDataSource.createQueryBuilder()
            .relation(Rol, "permisos")
            .of(id)
            .addAndRemove(filteredAdd, remove)

        return res.status(200).json({ message: "actualizacion con exito" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "error del servidor" })
    }
}