import express from "express"
import { ControllerHelper } from "../utils/controllerHelper"
import { Asignatura } from "../models/asignatura"

const router = express.Router()
const controllerHelper = new ControllerHelper(Asignatura,"asignatura")

router.get(
    "/all",
    (req,res)=>{controllerHelper.getAll(req,res)}
)

export default router