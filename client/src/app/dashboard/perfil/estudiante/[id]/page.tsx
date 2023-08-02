"use client"
import { ArticleList, ArticleTitle, KeyValueItem } from "@/components/Sheet/SheetContainer"
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
                                    <ArticleTitle>Informacion personal</ArticleTitle>
                                    <ArticleList>
                                        <KeyValueItem itemKey="Nombre: " value={perfil.nombre} />
                                        <KeyValueItem itemKey="Apellido: " value={perfil.apellido} />
                                        <KeyValueItem itemKey="Rut: " value={perfil.rut} />
                                        <KeyValueItem itemKey="Genero: " value={perfil.genero.genero} />
                                        <KeyValueItem itemKey="Fecha de nacimiento: " value={
                                            String(perfil.fecha_de_nacimiento).split("T")[0]
                                        } />
                                    </ArticleList>
                                </Box>
                                <Box>
                                    <ArticleTitle>Informacion de contacto</ArticleTitle>
                                    <ArticleList>
                                        <KeyValueItem itemKey="Email: " value={perfil.email} />
                                        <KeyValueItem itemKey="Direccion: " value={perfil.direccion}/>
                                        <KeyValueItem itemKey="Comuna de residencia: " value={perfil.comuna_de_residencia}/>
                                        <KeyValueItem itemKey="Telefono: " value={perfil.telefono}/>
                                    </ArticleList>
                                </Box>
                                <Box>
                                    <ArticleTitle>Informacion institucional</ArticleTitle>
                                    <ArticleList>
                                        <KeyValueItem itemKey="Curso: " value={perfil.curso?.curso} />
                                        <KeyValueItem itemKey="Rol: " value={perfil.rol?.rol} />
                                    </ArticleList>
                                </Box>
                                <Box>
                                    <ArticleTitle>Informacion de registro</ArticleTitle>
                                    <ArticleList>
                                        <KeyValueItem
                                            colors={["text.primary", "primary.main"]}
                                            itemKey="Fecha de creacion: " value={
                                                String(perfil.create_date).split("T")[0]
                                            } />
                                        <KeyValueItem
                                            colors={["text.primary", "primary.main"]}
                                            itemKey="Ultima actualizacion: " value={
                                                `${String(perfil.update_date).split("T")[0]} 
                                            a las 
                                            ${String(perfil.update_date).split("T")[1].split(".")[0]}`
                                            } />
                                    </ArticleList>
                                </Box>
                            </Grid>
                        </Grid>
                    )
                    : null
            }
        </Box>
    )
}