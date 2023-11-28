import express from "express"
import { ControllerHelper } from "../utils/controllerHelper"
import { Estudiante } from "../models/estudiante"
import {getAllCursoRelated, synchronize } from "./controllers/estudianteCtrl"
import { ormDataSource } from "../configs/ormDataSource"

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
    async(req,res) => {controllerHelper.getAll(req,res,["rol","curso","genero"])}
)
//dinamic routes ====>
router.get(
    "/:id",
    async(req, res) => {controllerHelper.get(req,res,["rol","curso","genero"])}
)

router.put(
    "/:id",
    (req, res) => { controllerHelper.update(req, res,[])}
)


export default router