import express from "express"
import { ControllerHelper } from "../utils/controllerHelper"
import { Genero } from "../models/genero"

const router = express.Router()
const controllerHelper = new ControllerHelper(Genero,"genero")
router.get(
    "/all",
    (req,res)=>{controllerHelper.getAll(req,res)}
)

export default router