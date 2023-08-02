import express from "express"
import { ControllerHelper } from "../utils/controllerHelper"
import { Evaluacion } from "../models/evaluacion"
import { getAllUsuarioRelated} from "./controllers/evaluacionCtrl"
const controllerHelper = new ControllerHelper(Evaluacion,"evaluacion")
const router = express.Router()

router.post(
    "/",
    (req,res)=>{controllerHelper.create(req,res,[])}
)
router.put(
    "/:id",
    (req,res)=>{controllerHelper.update(req,res,["evaluacion","numero_de_evaluacion"])}
)
router.get(
    "/all/related/usuario/:id",
    getAllUsuarioRelated
)

export default router