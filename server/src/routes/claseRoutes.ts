import express from "express"
import { ControllerHelper } from "../utils/controllerHelper"
import { Clase } from "../models/clase"

const router = express.Router()
const controllerHelper = new ControllerHelper(Clase,"clase")
router.post(
    "/",
    (req,res) => {controllerHelper.create(req,res)}
)

router.put(
    "/:id",
    (req,res)=>{controllerHelper.update(req,res,[])}
)

router.get(
    "/all",
    (req,res)=>{controllerHelper.getAll(req,res,["curso","asignatura"])}
)

export default router