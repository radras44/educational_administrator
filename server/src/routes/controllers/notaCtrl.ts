import { Request, Response } from "express";
import { ormDataSource } from "../../configs/ormDataSource";
import { Nota } from "../../models/nota";

//obtener todas las notas de un usuario en especifico
export async function getAllUsuarioRelated(req:Request,res:Response){
    const {id} = req.params
    try {
        const queryRes = await ormDataSource.getRepository(Nota)
        .createQueryBuilder("nota")
        .leftJoinAndSelect("nota.evaluacion","evaluacion")
        .leftJoinAndSelect("evaluacion.clase","clase")
        .leftJoinAndSelect("nota.estudiante","estudiante")
        .leftJoinAndSelect("clase.asignatura","asignatura")
        .select(["nota.nota","evaluacion.numero_de_evaluacion","clase.id","asignatura.asignatura"])
        .where("estudiante.id = :id",{id : id})
        .getMany()
        return res.status(200).json({
            result : queryRes
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "error del servidor" })
    }
}

//obtener todas las notas de una evaluacion en especifico
export async function getAllEvaluacionRelated(req: Request, res: Response) {
    const { id } = req.params
    try {
        const queryRes = await ormDataSource.getRepository(Nota)
            .createQueryBuilder("nota")
            .leftJoinAndSelect("nota.evaluacion","evaluacion")
            .leftJoinAndSelect("nota.estudiante","estudiante")
            .where("nota.evaluacion.id = :id", { id: id })
            .getMany()

        return res.status(200).json({
            result: queryRes || []
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "error del servidor" })
    }
}

export async function upsert(req: Request, res: Response) {
    const { data } = req.body
    if (!data) { return res.status(400).json({ error: "falta informacion" }) }
    const queryRunner = ormDataSource.createQueryRunner()
    try {
        await queryRunner.connect()
        if (!queryRunner) { res.status(500).json({ error: "error del servidor, query runner no disponible" }) }
        await queryRunner.startTransaction()
        try {
            const querybuilder = await ormDataSource.createQueryBuilder()
            for (const nota of data) {
                console.log("current iteration data:",nota)
                await querybuilder
                    .insert()
                    .into(Nota)
                    .values(nota)
                    .orUpdate(
                        ["nota"],
                        ["id_estudiante", "id_evaluacion"]
                    )
                    .execute()
            }

            return res.status(200).json({
                message : "upsert de registros exitoso"
            })
        } catch (error) {
            await queryRunner.rollbackTransaction()
            console.log(error)
            return res.status(500).json({ error: "no se han podido aplicar los cambios\nintentelo de nuevo" })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "error del servidor" })
    }
}