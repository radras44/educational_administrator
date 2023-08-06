import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"
import { initializeApp } from "firebase/app"
import { genResErrorMsg } from "../axios/reqUtils"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_URL,
  authDomain: "lbaplataform.firebaseapp.com",
  projectId: "lbaplataform",
  storageBucket: "lbaplataform.appspot.com",
  messagingSenderId: "798761830032",
  appId: "1:798761830032:web:9c07615f97654c60a0ba15"
}

export function firebaseInit() {
  console.log("firebaseConfig",firebaseConfig)

  initializeApp(firebaseConfig)
  console.log("firebase initialized successfully")
  return {
    status: true,
    error: null
  }
}

export async function signInWithGoogle() {
  const auth = getAuth()
  const provider = new GoogleAuthProvider()
  if (!auth) {
    return {
      status: false,
      error: genResErrorMsg("autenticacion no disponible en este momento")
    }
  }
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const idToken = await user.getIdToken()

    return {
      status: true,
      result: {
        token: idToken,
        user: user
      },
      error: null
    }
  } catch (error) {
    console.log(error)
    return {
      status: false,
      error: error
    }
  }
}
