"use client"
import Sheet from "@/components/Sheet"
import { sxDefaultPadding, sxVContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { getOne } from "@/utils/axios/reqUtils"
import { Estudiante } from "@/utils/interfaces/entityInterfaces"
import { Avatar, Box, Grid, Typography } from "@mui/material"
import { useState, useEffect } from "react"

export default function PerfilEstudiante({ params }: { params: { id: number } }) {
    const [perfil, setPerfil] = useState<Estudiante | null>(null)
    async function getEstudiante() {
        const headers = sessionHeaders()
        const res = await getOne("estudiante", headers, params.id)
        if (res.status) {
            setPerfil(res.result)
        }
    }
    useEffect(() => {
        getEstudiante()
    }, [])

    return (
        <Box>
            {
                perfil ?
                    (
                        <Grid container sx={{...sxDefaultPadding(),minHeight : "100vh"}}>
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
                                    <Sheet.Title>Informacion personal</Sheet.Title>
                                    <Sheet.List>
                                        <Sheet.KeyValueItem itemKey="Nombre: " value={perfil.nombre} />
                                        <Sheet.KeyValueItem itemKey="Apellido: " value={perfil.apellido} />
                                        <Sheet.KeyValueItem itemKey="Rut: " value={perfil.rut} />
                                        <Sheet.KeyValueItem itemKey="Genero: " value={perfil.genero.genero} />
                                        <Sheet.KeyValueItem itemKey="Fecha de nacimiento: " value={
                                            String(perfil.fecha_de_nacimiento).split("T")[0]
                                        } />
                                    </Sheet.List>
                                </Box>
                                <Box>
                                    <Sheet.Title>Informacion de contacto</Sheet.Title>
                                    <Sheet.List>
                                        <Sheet.KeyValueItem itemKey="Email: " value={perfil.email} />
                                        <Sheet.KeyValueItem itemKey="Direccion: " value={perfil.direccion}/>
                                        <Sheet.KeyValueItem itemKey="Comuna de residencia: " value={perfil.comuna_de_residencia}/>
                                        <Sheet.KeyValueItem itemKey="Telefono: " value={perfil.telefono}/>
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
                    )
                    : null
            }
        </Box>
    )
}