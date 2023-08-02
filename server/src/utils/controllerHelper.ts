import { Request } from "express";
import { Response } from "express-serve-static-core";
import { ormDataSource } from "../configs/ormDataSource";
import { EntityTarget } from "typeorm"
import Joi from "joi"
import schemaArray, { validateSchema } from "./entitySchemas";
import regex from "./regex";
export class ControllerHelper {
    entity: EntityTarget<any>;
    entityLabel: string;

    constructor(entity: EntityTarget<any>, entityLabel: string) {
        this.entity = entity;
        this.entityLabel = entityLabel;
    }

    //buscar todos los registros de una entidad
    async getAll(req: Request, res: Response, relations: string[] = [], mtmRelations: string[] = []) {
        //req: objeto request
        //res: objeto response
        //entityLabel: nombre de la clase de la entidad pero en minuscula
        //entity: referencia a la clase de la entidad (se encuentran en el directorio models)
        //relations: tabla con la que se quiere cruzar
        //mtmRelations: relaciones manyToMany con las que se quiere hacer un cruze 
        //IMPORTANTE: las relaciones manyToMany deben escribirse en singular (notas no, nota si)
        try {
            //crear query base
            const query = ormDataSource.getRepository(this.entity)
                .createQueryBuilder(this.entityLabel);
            //agregar y seleccionar relaciones
            if (relations.length > 0) {
                relations.forEach(relation => {
                    query.leftJoinAndSelect(`${this.entityLabel}.${relation}`, `${relation}`);
                });
            }
            //agregar y seleccionar relaciones manyToMany
            if (mtmRelations.length > 0) {
                console.log("verificnado mtm relation");
                mtmRelations.forEach(relation => {
                    let joinTable = "";
                    if (!relation.endsWith("s")) {
                        if (regex.endWithVocal.test(relation)) {
                            joinTable = `${relation}s`;
                        } else {
                            joinTable = `${relation}es`;
                        }
                    }
                    console.log("relation entity mtm:", joinTable);
                    if (joinTable.length > 0) {
                        query.leftJoinAndSelect(`${this.entityLabel}.${joinTable}`, `${relation}`);
                    }
                });
            }
            //se ordenaran segun el id de menor a mayor por defecto
            query.orderBy(`${this.entityLabel}.id`, "ASC");
            const queryRes = await query.getMany();

            return res.status(200).json({
                result: queryRes,
                message: "registros obtenidos con exito"
            });
        } catch (error) {
            console.log("handleError: ", error);
            return res.status(500).json({ error: "error del serivodr" });
        }
    }

    //buscar un solo registro
    async get(req: Request, res: Response, relations: string[] = []) {
        //req: objeto request
        //res: objeto response
        //entityLabel: nombre de la clase de la entidad pero en minuscula
        //entity: referencia a la clase de la entidad (se encuentran en el directorio models)
        //relations: tabla con la que se quiere cruzar
        const { id } = req.params;
        if (!id) { return res.status(400).json({ error: "solicitud invalida" }) }

        try {
            const query = await ormDataSource.getRepository(this.entity)
                .createQueryBuilder(this.entityLabel);
            //agregar relaciones
            if (relations.length > 0) {
                relations.forEach(relation => {
                    query.leftJoinAndSelect(`${this.entityLabel}.${relation}`, relation);
                });
            }
            //buscar por id 
            query.where(`${this.entityLabel}.id = :id`, { id: id });
            const queryRes = await query.getOne();
            return res.status(200).json({
                message: "busqueda exitosa",
                result: queryRes
            });
        } catch (error) {
            console.log("handleError: ", error);
            return res.status(500).json({ error: "error del servidor" });
        }
    }

    //crear/insertar registro/s 
    async create(req: Request, res: Response, allowedProps: string[] = []) {
        //req: objeto request
        //res: objeto response
        //entityLabel: nombre de la clase de la entidad pero en minuscula
        //entity: referencia a la clase de la entidad (se encuentran en el directorio models)
        //allowProps: en caso de que solo quiera permitir proiedades especficiad de la entidad, debe agregarlas aqui
        const { data } = req.body;
        if (!data) { return res.status(400).json({ error: "falta informacion" }) }

        //validacion de datos
        const schema: Joi.ObjectSchema<any> = schemaArray[this.entityLabel];
        if (schema) {
            const validation = validateSchema(schema, data);
            if (!validation.status) {
                return res.status(400).json({ error: validation.errors.join("\n") });
            }
        }

        // filtrar allowedProps
        let filteredObj: Object;
        if (allowedProps.length > 0) {
            filteredObj = allowedProps.reduce((newObj: { [key: string]: any }, key) => {
                if (data.hasOwnProperty(key)) {
                    newObj[key] = data[key];
                }
                return newObj;
            }, {});
        } else {
            filteredObj = data;
        }

        //hacer query
        try {
            await ormDataSource.createQueryBuilder()
                .insert()
                .into(this.entity)
                .values(filteredObj)
                .execute();

            return res.status(200).json({ message: "el registro a sido creado con exito" });
        } catch (error) {
            console.log("handleError: ", error);
            return res.status(500).json({ error: "error del servidor" });
        }
    }

    //actualizar registro segun id
    async update(req: Request, res: Response, allowedProps: string[] = []) {
        //req: objeto request
        //res: objeto response
        //entityLabel: nombre de la clase de la entidad pero en minuscula
        //entity: referencia a la clase de la entidad (se encuentran en el directorio models)
        //allowProps: en caso de que solo quiera permitir proiedades especficiad de la entidad, debe agregarlas aqui
        const { id } = req.params;
        const { data } = req.body;
        console.log(data);
        if (!id || !data) { return res.status(400).json({ error: "falta informacion" }) }

        //validacion de datos
        const schema: Joi.ObjectSchema<any> = schemaArray[this.entityLabel];
        if (schema) {
            const validation = validateSchema(schema, data);
            if (!validation.status) {
                return res.status(400).json({ error: validation.errors.join("\n") });
            }
        }

        // filtrar allowedProps
        let filteredObj: Object;
        if (allowedProps.length > 0) {
            filteredObj = allowedProps.reduce((newObj: { [key: string]: any }, key) => {
                if (data.hasOwnProperty(key)) {
                    newObj[key] = data[key];
                }
                return newObj;
            }, {});
        } else {
            filteredObj = data;
        }

        try {
            await ormDataSource.createQueryBuilder()
                .update(this.entity)
                .set(filteredObj)
                .where("id = :id", { id: id })
                .execute();

            return res.status(200).json({
                message: "asignacion con exito",
                updatedData: filteredObj
            });
        } catch (error) {
            console.log("handleError: ", error);
            return res.status(500).json({ error: "error del servidor" });
        }
    }

    //eliminar registro segun id
    async delete(req: Request, res: Response) {
        //req: objeto request
        //res: objeto response
        //entity: referencia a la clase de la entidad (se encuentran en el directorio models)
        //NOTA: la propiedad cascade se especficia en cada clase de cada entidad, no aqui
        const { id } = req.params;
        try {
            await ormDataSource
                .createQueryBuilder()
                .delete()
                .from(this.entity) // Reemplazamos "entity" por "this.entity"
                .where("id = :id", { id: id })
                .execute();

            return res.status(200).json({ message: "registro eliminado con exito" });
        } catch (error) {
            console.log("handleError: ", error);
            return res.status(500).json({ error: "error del servidor" });
        }
    }
}