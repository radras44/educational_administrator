import express from "express"
import { ControllerHelper } from "../utils/controllerHelper"
import { getAllEvaluacionRelated, getAllUsuarioRelated, upsert } from "./controllers/notaCtrl"
const router = express.Router()

router.post(
    "/upsert",
    upsert
)

router.get(
    "/all/related/evaluacion/:id",
    getAllEvaluacionRelated
)

router.get(
    "/all/related/usuario/:id",
    getAllUsuarioRelated
)

export default router