import { Request, Response } from "express";
import { getUsuarioClasesIds } from "../../utils/queryHelper";
import { ormDataSource } from "../../configs/ormDataSource";
import { Usuario } from "../../models/usuario";

//actualizar permisos de un rol en especifico
export async function updateClases(req: Request, res: Response) {
    const id = Number(req.params.id)
    const { add, remove } = req.body
    if (!id || !add || !remove) {
        return res.status(400).json({ error: "falta informacion" })
    }
    try {
        //obtener clases asignadas al usuario (ids de clases)
        const usuarioClasesIdxs = await getUsuarioClasesIds(id)
        //filtrar add ,a solo las clases que no esteen asignadas al usuario
        if (!usuarioClasesIdxs) { return res.status(404).json({ error: "usuario no encontrado" }) }
        const filteredAdd = add.filter((idx: number) => !usuarioClasesIdxs.includes(idx))

         //modificar elementos de clases (propiedad para acceder a la tabla intermedia usuario/clase)
        await ormDataSource.createQueryBuilder()
            .relation(Usuario, "clases")
            .of(id)
            .addAndRemove(filteredAdd, remove)

        return res.status(200).json({ error: "registros actualizados con exito" })

    } catch (error) {
        return res.status(500).json({ error: "error del servidor" })
    }
}