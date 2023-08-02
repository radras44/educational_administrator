import { Request, Response } from "express";
import { ormDataSource } from "../../configs/ormDataSource";
import { Estudiante } from "../../models/estudiante";

//obtener los estudiantes relacionados con un curso
export async function getAllCursoRelated(req:Request,res:Response){
    const {id} = req.params
    if(!id){return res.status(400).json({error : "falta informacion"})}
    try {
        const queryRes = await ormDataSource.getRepository(Estudiante)
        .createQueryBuilder("estudiante")
        .where("estudiante.curso = :id",{id : id})
        .getMany()
        return res.status(200).json({
            result : queryRes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({error :"error del servidor"})
    }
}

//crear actualizar y eliminar registros de estudinantes 
export async function synchronize(req: Request, res: Response) {
    const { toCreate, toUpdate, toDelete } = req.body
    if (!toCreate || !toUpdate || !toDelete) {
        return res.status(400).json({ error: "informacion insuficiente, sincronizacion errada" })
    }
    //crear query runner para realizar transaccion
    //en caso de error se restableceran a como estaban todos los cambios hechos a la base de datos antes de la transaccion
    const queryRunner = ormDataSource.createQueryRunner()
    try {
        console.log("comenzando sincronizacion")
        await queryRunner.connect()
        if (!queryRunner) { return res.status(500).json({ error: "error del servidor, queryRunner no disponible" }) }
        await queryRunner.startTransaction()
        //eliminar registros
        if (toDelete.length > 0) {
            try {
                for (const estudiante of toDelete) {
                    await ormDataSource.createQueryBuilder()
                        .delete()
                        .from(Estudiante)
                        .where("id = :id", { id: estudiante.id })
                        .execute()
                }
            } catch (error) {
                await queryRunner.rollbackTransaction()
                return res.status(500).json({ error: "error del servidor : error al eliminar registros" })
            }
        }
        //actualizar registros
        if (toUpdate.length > 0) {
            try {
                for (const estudiante of toUpdate) {
                    await ormDataSource.createQueryBuilder()
                        .update(Estudiante)
                        .set(estudiante)
                        .where("rut = :rut", { rut: estudiante.rut })
                        .execute()
                }
            } catch (error) {
                await queryRunner.rollbackTransaction()
                return res.status(500).json({ error: "error del servidor : error al actualizar registros" })
            }
        }
        //crear registros
        if (toCreate.length > 0) {
            try {
                await ormDataSource.createQueryBuilder()
                    .insert()
                    .into(Estudiante)
                    .values(toCreate)
                    .execute()
            } catch (error) {
                await queryRunner.rollbackTransaction()
                console.log(error)
                return res.status(500).json({ error: "error del servidor : error al insertar registros" })
            }
        }
        //cerrar transaccion
        await queryRunner.commitTransaction()
        return res.status(200).json({
            message: "sincronizacion exitosa"
        })
    } catch (error) {
        await queryRunner.rollbackTransaction()
        console.log(error)
        return res.status(500).json({ error: "error del servidor" })
    } finally {
        //liberar conexion establecida por el queryRunner
        await queryRunner.release()
    }
}