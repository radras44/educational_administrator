"use client"

import { useSessionContext } from "@/app/providers/sessionProvider";
import { sxDefaultMargin } from "@/sxStyles/sxStyles";
import { sessionHeaders } from "@/utils/axios/headers";
import { getAllRelated } from "@/utils/axios/reqUtils";
import { useStaticEntities } from "@/utils/customHooks";
import { Evaluacion } from "@/utils/interfaces/entityInterfaces";
import { Add, Checklist, Edit } from "@mui/icons-material";
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useMemo, useState } from "react"
import { EditarNotas } from "./editarNotas";
import PanelToolBar from "@/components/bars/panelToolBar";
import { CrearEvaluacion } from "./crearEvaluacion";
import { EditarEvaluacion } from "./editarEvaluacion";

interface SelectedEvaluacion extends Omit<Evaluacion, "usuario" | "clase"> {
    usuario: number
    clase: number
}

export default function MisEvaluaciones() {
    const numbero_de_evaluacionOptions = useMemo(() => {
        const arr = []
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8]
        for (const element of numbers) {
            const obj = { id: element, numero_de_evaluacion: element }
            arr.push(obj)
        }
        return arr
    }, [])
    const sessionContext = useSessionContext()
    const staticEntities = useStaticEntities()
    const [selectedEvaluacion, setSelectedEvaluacion] = useState<SelectedEvaluacion | null>(null)
    const [fullSelectedEvaluacion, setFullSelectedEvaluacoin] = useState<Evaluacion | null>(null)
    const [evaluaciones, setEvaluaciones] = useState<any[]>([])

    async function getAllEvaluaciones() {
        if (sessionContext && sessionContext.usuario) {
            const headers = sessionHeaders()
            const res = await getAllRelated("evaluacion", "usuario", headers, sessionContext.usuario.id, setEvaluaciones)
        }
    }
    //modals
    const [showCrearEvaluacion, setShowCrearEvaluacion] = useState<boolean>(false)
    function openCrearEvaluacion() { setShowCrearEvaluacion(true) }
    function closeCrearEvaluacion() { setShowCrearEvaluacion(false) }
    const [showEditarEvaluacion, setShowEditarEvaluacion] = useState<boolean>(false)
    function openEditarEvaluacion() { setShowEditarEvaluacion(true) }
    function closeEditarEvaluacion() { setShowEditarEvaluacion(false) }
    const [showEditarNotas, setShowEditarNotas] = useState<boolean>(false)
    function openEditarNotas() { setShowEditarNotas(true) }
    function closeEditarNotas() { setShowEditarNotas(false) }

    useEffect(() => {
        getAllEvaluaciones()
    }, [])

    return (
        <Grid container>
            {
                showEditarEvaluacion && selectedEvaluacion ?
                    <EditarEvaluacion
                        open={showEditarEvaluacion}
                        onClose={closeEditarEvaluacion}
                        selectedEvaluacion={selectedEvaluacion}
                        getAllEvaluaciones={getAllEvaluaciones}
                        numero_de_evaluacionOptions={numbero_de_evaluacionOptions}
                    />
                    : null
            }
            {
                showEditarNotas && fullSelectedEvaluacion ?
                    <EditarNotas
                        open={showEditarNotas}
                        onClose={closeEditarNotas}
                        fullSelectedEvaluacion={fullSelectedEvaluacion}
                    />
                    : null
            }
            {
                showCrearEvaluacion && staticEntities && sessionContext && sessionContext.usuario ?
                    <CrearEvaluacion
                        open={showCrearEvaluacion}
                        onClose={closeCrearEvaluacion}
                        staticEntities={staticEntities}
                        getAllEvaluaciones={getAllEvaluaciones}
                        relatedClases={sessionContext.usuario.clases}
                        usuarioId={sessionContext.usuario.id}
                        numero_de_evaluacionOptions={numbero_de_evaluacionOptions}
                    />
                    : null
            }
            <Grid item xs={12}>
                <PanelToolBar>
                    <Button 
                    startIcon={<Add />} 
                    variant="contained" 
                    onClick={openCrearEvaluacion}
                    sx={{...sxDefaultMargin()}}
                    >Crear
                    </Button>
                </PanelToolBar>
            </Grid>
            <Grid item xs={12}>
                <TableContainer sx={{ maxHeight: 600, overflow: "auto" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ minWidth: 200 }}>Evaluacion</TableCell>
                                <TableCell sx={{ minWidth: 400 }}>Clase</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                evaluaciones.length > 0 && sessionContext && sessionContext.usuario ?
                                    evaluaciones.map((evaluacion: Evaluacion, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{evaluacion.evaluacion}</TableCell>
                                            <TableCell>{evaluacion.clase.clase}</TableCell>
                                            <TableCell align="center">
                                                <Button onClick={() => {
                                                    setFullSelectedEvaluacoin(evaluacion)
                                                    openEditarNotas()
                                                }}>
                                                    <Checklist />
                                                </Button>
                                                <Button onClick={() => {
                                                    const data = {
                                                        ...evaluacion,
                                                        clase: evaluacion.clase.id,
                                                        usuario: evaluacion.usuario.id
                                                    }
                                                    setSelectedEvaluacion(data)
                                                    openEditarEvaluacion()
                                                }}>
                                                    <Edit />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    : null
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    )
}



