import { Request, Response } from "express";
import { ormDataSource } from "../../configs/ormDataSource";
import { Evaluacion } from "../../models/evaluacion";

//obtener todos todas las evaluaciones creadas por un usuario en especifico
export async function getAllUsuarioRelated (req:Request,res:Response) {
    const {id} = req.params 
    try {
        const queryRes = await ormDataSource.getRepository(Evaluacion)
        .createQueryBuilder("evaluacion")
        .leftJoinAndSelect("evaluacion.clase","clase")
        .leftJoinAndSelect("evaluacion.usuario","usuario")
        .leftJoinAndSelect("clase.curso","cusro")
        .where("evaluacion.usuario = :id",{id : id})
        .orderBy("usuario.apellido", "ASC")
        .getMany()

        return res.status(200).json({
            result : queryRes
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({error : "error del servidor"})
    }
}