import { Permiso } from "../models/permiso";
import express from "express"
import { ControllerHelper } from "../utils/controllerHelper";

const router = express.Router()
const controllerHelper = new ControllerHelper(Permiso,"permiso")

router.get(
    "/all",
    (req,res)=>{controllerHelper.getAll(req,res,["roles"])}
)

export default router