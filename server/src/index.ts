import app from "./app"
import firebaseAdmin from "firebase-admin"
import { ormDataSource } from "./configs/ormDataSource"
import fs from "fs"
import path from "path"
const port = process.env.PORT || 5000

async function serverInit() {
    try {
        await ormDataSource.initialize()
        const firebaseConfigDir = path.join(__dirname, 'private', 'firebaseConfig.json');

        if (fs.existsSync(firebaseConfigDir)) {
            console.log("configuracion detectada");
            const firebaseConfig = require(firebaseConfigDir);
            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(firebaseConfig)
            });
        } else {
            throw new Error(`No se encuentra la ruta relativa => ${firebaseConfigDir}\nNecesita agregar una configuracion de firebase autnentication valida y en formato JSON`);
        }
        console.log("firebase initialized successfully")
        app.listen(port, () => {
            console.log("listening in port", port)
        })
    } catch (error) {
        console.log(error)
    }
}

serverInit()