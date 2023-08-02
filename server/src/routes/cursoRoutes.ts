import express from "express"
import { ControllerHelper } from "../utils/controllerHelper"
import { Curso } from "../models/curso"

const router = express.Router()
const controllerHelper = new ControllerHelper(Curso,"curso")
router.get(
    "/all",
    (req,res)=>{controllerHelper.getAll(req,res)}
)

export default router