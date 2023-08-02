import express from "express"
import { ControllerHelper } from "../utils/controllerHelper"
import { Estudiante } from "../models/estudiante"
import {getAllCursoRelated, synchronize } from "./controllers/estudianteCtrl"

const controllerHelper = new ControllerHelper(Estudiante,"estudiante")
const router = express.Router()


router.get(
    "/all/related/curso/:id",
    getAllCursoRelated
)
router.post(
    "/synchronize",
    synchronize
)

router.delete(
    "/:id",
    (req,res) => {controllerHelper.delete(req,res)}
)

router.post(
    "/",
    (req, res) => { controllerHelper.create(req, res)}
)

router.get(
    "/all",
    (req, res) => { controllerHelper.getAll(req, res,["curso", "genero"]) }
)
//dinamic routes ====>
router.get(
    "/:id",
    (req, res) => { controllerHelper.get(req, res,["curso", "genero", "rol"]) }
)

router.put(
    "/:id",
    (req, res) => { controllerHelper.update(req, res,[])}
)


export default router