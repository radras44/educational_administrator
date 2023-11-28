import express from "express"
import { verifyPermissions } from "../middlewares/verifyPermission"
import { ControllerHelper } from "../utils/controllerHelper"

import { Usuario } from "../models/usuario"
import { updateClases } from "./controllers/usuarioCtrl"
import { ormDataSource } from "../configs/ormDataSource"
const router = express.Router()
const controllerHelper = new ControllerHelper(Usuario,"usuario")

router.put(
    "/:id",
    (req,res) => {controllerHelper.update(req,res,[])}
)

router.put(
    "/clases/:id",
    updateClases
)

router.get(
    "/all",
    // (req,res,next) => {verifyPermissions(req,res,next,["ver-usuario"])},
    async(req,res) => {controllerHelper.getAll(req,res,["rol","curso","genero",],["clase"])}
)

router.post(
    "/",
    (req, res) => { controllerHelper.create(req, res,[]) }
)
router.get(
    //keyvalue = clave:valor por ejemplo => rut:12345678-9 o email:example@bicentenarioancud.cl
    "/:id",
    (req, res) => { controllerHelper.get(req, res,["genero","curso","rol"]) }
)

router.delete(
    "/:id",
    (req, res) => { controllerHelper.delete(req, res) }
)

export default router