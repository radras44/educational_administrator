import express from "express"
import { ControllerHelper } from "../utils/controllerHelper"
import { Rol } from "../models/rol"
import { updatePermisos } from "./controllers/rolCtrl"
import { ormDataSource } from "../configs/ormDataSource"

const router = express.Router()

const controllerHelper = new ControllerHelper(Rol, "rol")

router.get(
    "/all",
    async(req, res) => {controllerHelper.getAll(req,res,[],["permiso"])}
)

router.post(
    "/",
    (req, res) => { controllerHelper.create(req, res, []) }
)
router.delete(
    "/:id",
    (req, res) => { controllerHelper.delete(req, res) }
)
router.put(
    "/:id",
    (req, res) => { controllerHelper.update(req, res, []) }
)
router.put(
    "/permisos/:id",
    updatePermisos
)

export default router