import Joi from "joi";
import regex from "./regex";

//este archivo contiene todos los esquemas para validacion de datos
//cada entidad tiene su propio esquema el cual sera puesto en un array de esquemas
//este array se podra recorrer para buscar el esquema perteneciente a la entidad en cuesto
//lo ultimo es para poder validar dinamicamente

interface SchemaArray {
    [key: string]: any
}

const usuarioSchema: Joi.ObjectSchema<any> = Joi.object({
    rut: Joi.string().min(10).max(12).regex(regex.rut)
        .messages({
            "*": "rut debe estar escrito en el siguiente formato:\nEjemplo: 12345678-9",
            "string.min": "rut debe contener almenos {#limit} caracteres",
            "string.max": "rut debe contener como maximo {#limit} caracteres",
        }),
    nombre_de_usuario: Joi.string().min(3).max(30).regex(regex.nombre)
        .messages({
            "string.min": "nombre de usuario debe contener almenos {#limit} caracteres",
            "string.max": "nombre de usuario debe contener como maximo {#limit} caracteres",
            "*": "nombre de usuario no puede contener signos"
        }).required(),
    email: Joi.string().max(70).email().regex(regex.userEmail)
        .messages({
            "string.email": "debe ingresar un correo electronico",
            "string.max": "email demasiado largo",
            "*": "debe ingresar un correo institucional\nEjemplo: example@bicentenarioancud.cl"
        })
        .required(),
    nombre: Joi.string().min(2).max(50).regex(regex.nombre).allow(null)
        .messages({
            "string.min": "nombre debe contener almenos {#limit} caracteres",
            "string.max": "nombre debe contener como maximo {#limit} caracteres",
            "*": "nombre no puede contener caraceteres especiales o numeros"
        }),
    apellido: Joi.string().min(2).max(50).regex(regex.nombre).allow(null)
        .messages({
            "string.min": "apellido debe contener almenos {#limit} caracteres",
            "string.max": "apellido debe contener como maximo {#limit} caracteres",
            "*": "apellido no puede contener caraceteres especiales o numeros"
        }),
    curso: Joi.number().allow(null)
}).options({ allowUnknown: true })

const estudianteSchema: Joi.ObjectSchema = Joi.object({
    rut: Joi.string().min(10).max(12).regex(regex.rut)
        .messages({
            "*": "rut debe estar escrito en el siguiente formato:\nEjemplo: 12345678-9",
            "string.min": "rut debe contener almenos {#limit} caracteres",
            "string.max": "rut debe contener como maximo {#limit} caracteres",
        })
        .required(),
    nombre_de_usuario: Joi.string().min(3).max(30).regex(regex.nombre)
        .messages({
            "string.min": "nombre de usuario debe contener almenos {#limit} caracteres",
            "string.max": "nombre de usuario debe contener como maximo {#limit} caracteres",
            "*": "nombre de usuario no puede contener signos"
        }).required(),
    email: Joi.string().max(70).email().regex(regex.userEmail)
        .messages({
            "string.email": "debe ingresar un correo electronico",
            "string.max": "email demasiado largo",
            "*": "debe ingresar un correo institucional\nEjemplo: example@bicentenarioancud.cl"
        })
        .allow(null)
        .required(),
    nombre: Joi.string().min(2).max(50).regex(regex.nombre).allow(null)
        .messages({
            "string.min": "nombre debe contener almenos {#limit} caracteres",
            "string.max": "nombre debe contener como maximo {#limit} caracteres",
            "*": "nombre no puede contener caraceteres especiales o numeros"
        }),
    apellido: Joi.string().min(2).max(50).regex(regex.nombre).allow(null)
        .messages({
            "string.min": "apellido debe contener almenos {#limit} caracteres",
            "string.max": "apellido debe contener como maximo {#limit} caracteres",
            "*": "apellido no puede contener caraceteres especiales o numeros"
        }),
    curso: Joi.number().allow(null)
}).options({allowUnknown:true})

const rolSchema : Joi.ObjectSchema = Joi.object({
    rol : Joi.string().min(3).max(25).regex(regex.nombre)
    .messages({
        "string.min" : "rol debe contener almenos {#limit} caracteres",
        "string.max" : "rol debe contener como maximo [#limit] caracteres",
        "*" : "rol no debe contener ni numeros ni signos"
    }),
    nivel : Joi.number().min(1).max(10)
    .messages({
        "*" : "el nivel de rol debe estar en un rango de 1 a 10"
    }),
})

const claseSchema : Joi.ObjectSchema = Joi.object({
    curso : Joi.number().required()
    .messages({
        "*" : "el campo 'curso' es obligatorio"
    }),
    asignatura : Joi.number().required()
    .messages({
        "*" : "el campo 'asignatura' es obligatorio"
    }),
    electivo : Joi.boolean().required()
    .messages({
        "*" : "el compo 'electivo' es obligatorio" 
    })
}).options({allowUnknown : true})

const evaluacionSchema : Joi.ObjectSchema = Joi.object({
    evaluacion : Joi.string().min(3).max(25).required()
    .messages({
        "string.min" : "'evaluacion' debe contener minimo [#limit] caracteres",
        "string.max" : "'evaluacion' debe contener como maximo [#limit] caracteres",
        "*" : "'evaluacion' es un campo obligatorio"
    }),
    clase : Joi.number().required()
    .messages({
        "*" : "'clase' es un campo obligatorio"
    }),
    numbero_de_evaluacion : Joi.number().min(1).max(8).allow(null)
    .messages({
        "*" : "'numero de evaluacion' debe ser un numero de 1 a 8"
    }).options({allowUnknown : true})
}).options({allowUnknown : true})

export function validateSchema(schema: Joi.ObjectSchema<any>, data: any) {
    const { error, value } = schema.validate(data)
    if (error) {
        const errors = error.details.map(detail => detail.message)
        return { status: false, errors, value }
    }
    return { status: true, errors: [], value }
}

const schemaArray: SchemaArray = {
    usuario: usuarioSchema,
    estudiante: estudianteSchema,
    rol : rolSchema,
    clase : claseSchema,
    evaluacion : evaluacionSchema
}

export default schemaArray