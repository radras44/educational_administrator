import express from "express"
import {getClientSessionData, signInWithFirebase,updateSessionToken} from "./controllers/authCtrl"

const router = express.Router()

router.post("/signIn/firebase",signInWithFirebase)
router.get("/getClientSessionData",getClientSessionData)
router.get("/updateToken",updateSessionToken)

export default router