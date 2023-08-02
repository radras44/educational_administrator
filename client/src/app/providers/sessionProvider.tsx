"use client"

import { sessionHeaders } from "@/utils/axios/headers"
import { Usuario } from "@/utils/interfaces/entityInterfaces"
import axios, { AxiosRequestConfig } from "axios"
import { ReactNode, createContext, Dispatch, useState, SetStateAction, useContext, useEffect } from "react"
//creat tipos 

export interface BaseRelationObject {
    [key: string]: any
    id: number
}

export interface contextProps {
    session: boolean,
    setSession: Dispatch<SetStateAction<boolean>>,
    usuario: Usuario | null
    permisos: string[]
    verifySession: Function
}
//crear context
export const SessionContext = createContext<contextProps>({
    session: false,
    setSession: () => { },
    usuario: null,
    permisos: [],
    verifySession: () => { }
})

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [session, setSession] = useState<boolean>(false)
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [permisos, setPermisos] = useState<string[]>([])

    async function updateToken(headers: AxiosRequestConfig) {
        //esta funcion enviara el token de session al backend
        //lo verificara y devolvera un nuevo token de sesion actualizado
        const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/updateToken`
        try {
            const res = await axios.get(url, headers)
            if (res) {
                console.log("update token =", res)
                window.localStorage.setItem("sessionToken", res.data.result)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function verifySession() {
        const headers = sessionHeaders()
       
        if ("sessionToken" in headers) {
            //solo se actualizara el token en caso de que se encuentre un token de sesion en el localStorage
            await updateToken(headers)
        }
        //obtener data del usuario desde el token de sesion para poder usarlo en renderizado condicional
        const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/getClientSessionData`
        try {
            const response = await axios.get(url, headers)
            setSession(true)
            setUsuario(response.data.result.usuario)
            setPermisos(response.data.result.permisos)
        } catch (error) {
            setSession(false)
            setUsuario(null)
            setPermisos([])
            console.log(error)
        }
        //actualizar el estado de carga, para avisar de que ya se ha hecho la comprobacion
        //esto se hace para no verificar la sesion en el cliente cuando aun no se a verificado en el backend
        setIsLoading(true)
    }
    //verificar sesion cada que el context se recargue
    //el context se recarga cuando se recarga la pagina (no confundir con recargar o cargar un componente o ruta)
    useEffect(() => {
        verifySession()
    }, [])
    //verificar que se ha verificado la sesion en el backend antes de transmitir el context a los demas componentes
    //en caso contrario no devolver nada
    if (isLoading) {
        console.log("context is loaded")
        return (
            <SessionContext.Provider value={{
                session, setSession,
                usuario,
                verifySession, permisos
            }}>
                {children}
            </SessionContext.Provider>
        )
    } else {
        return null
    }
}
//funcion para usar el context (osea, la informacion del usuario) desde algun componente
export const useSessionContext = () => useContext(SessionContext)

