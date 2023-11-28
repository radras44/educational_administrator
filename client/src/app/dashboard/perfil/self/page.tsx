"use client"
import { useSessionContext } from "@/app/providers/sessionProvider"
import  Sheet from "@/components/Sheet"
import { sxCenteredContainer, sxDefaultMargin, sxDefaultPadding, sxVContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { getOne } from "@/utils/axios/reqUtils"
import { Usuario } from "@/utils/interfaces/entityInterfaces"
import { Add } from "@mui/icons-material"
import { Avatar, Box, Grid, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PerfilUsuario() {
    const router = useRouter()
    const sessionContext = useSessionContext()
    const [perfil, setPerfil] = useState<Usuario | null>(null)
    async function getUsuario () {
        if(sessionContext && sessionContext.usuario){
            const headers = sessionHeaders()
            const res = await getOne("usuario",headers,sessionContext.usuario.id)
            if(res.status){
                setPerfil(res.result)
            }
        }
    }
    useEffect(()=>{
        getUsuario()
    },[])
    console.log("perfil =",perfil)
    if (sessionContext && sessionContext.session) {
        return (
            <Box>
                {
                    perfil ?
                        <Grid container spacing={2} sx={{ ...sxDefaultPadding(),minHeight:"100vh"}}>
                            <Grid item xs={6}>
                                <Box sx={{ ...sxVContainer(), alignItems: "center", minHeight: 200, justifyContent: "space-around" }}>
                                    <Avatar sx={{ width: 100, height: 100 }}></Avatar>
                                    <Typography variant="h6">{perfil.nombre_de_usuario}</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sx={{
                                display:"flex",flexDirection:"column",
                                alignItems:"start",justifyContent:"center"
                            }}>
                                <Box>
                                    <Sheet.Title>Informacion Personal</Sheet.Title>
                                    <Sheet.List>
                                        <Sheet.KeyValueItem itemKey="Nombre: " value={perfil.nombre} />
                                        <Sheet.KeyValueItem itemKey="Apellido: " value={perfil.apellido} />
                                        <Sheet.KeyValueItem itemKey="Rut: " value={perfil.rut} />
                                        <Sheet.KeyValueItem itemKey="Genero: " value={perfil.genero?.genero} />
                                    </Sheet.List>
                                </Box>
                                <Box>
                                    <Sheet.Title>Informacion de contacto</Sheet.Title>
                                    <Sheet.List>
                                        <Sheet.KeyValueItem itemKey="Email: " value={perfil.email} />
                                    </Sheet.List>
                                </Box>
                                <Box>
                                    <Sheet.Title>Informacion institucional</Sheet.Title>
                                    <Sheet.List>
                                        <Sheet.KeyValueItem itemKey="Curso: " value={perfil.curso?.curso} />
                                        <Sheet.KeyValueItem itemKey="Rol: " value={perfil.rol?.rol} />
                                    </Sheet.List>
                                </Box>
                                <Box>
                                    <Sheet.Title>Informacion de registro</Sheet.Title>
                                    <Sheet.List>
                                        <Sheet.KeyValueItem
                                            colors={["text.primary", "primary.main"]}
                                            itemKey="Fecha de creacion: " value={
                                                String(perfil.create_date).split("T")[0]
                                            } />
                                        <Sheet.KeyValueItem
                                            colors={["text.primary", "primary.main"]}
                                            itemKey="Ultima actualizacion: " value={
                                                `${String(perfil.update_date).split("T")[0]} 
                                            a las 
                                            ${String(perfil.update_date).split("T")[1].split(".")[0]}`
                                            } />
                                    </Sheet.List>
                                </Box>
                            </Grid>
                        </Grid>
                        : null
                }
            </Box>
        )
    } else {
        router.push("/")
    }
}