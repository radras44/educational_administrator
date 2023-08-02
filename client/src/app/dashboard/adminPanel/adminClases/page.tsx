"use client"

import { useSessionContext } from "@/app/providers/sessionProvider";
import { sessionHeaders } from "@/utils/axios/headers";
import { getAll } from "@/utils/axios/reqUtils";
import { useStaticEntities, useTablePagination } from "@/utils/customHooks";
import { Clase } from "@/utils/interfaces/entityInterfaces";
import { SelectedClase } from "@/utils/interfaces/interfaces";
import { Add, Edit, NavigateBefore, NavigateNext } from "@mui/icons-material";
import { Button, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CrearClase } from "./crearClase";
import { EditarClase } from "./editarClase";
import PanelToolBar from "@/components/bars/panelToolBar";
import { sxDefaultMargin } from "@/sxStyles/sxStyles";
import PaginationPanel from "@/components/listAndTables/paginationPanel";

export default function AdminClases() {
    const sessionContext = useSessionContext()
    const staticEntities = useStaticEntities()
    const [clases, setClases] = useState<Clase[]>([])
    const [selectedClase, setSelectedClase] = useState<SelectedClase | null>(null)
    //modals
    const [showCrearClase, setShowCrearClase] = useState<boolean>(false)
    function openCrearClase() { setShowCrearClase(true) }
    function closeCrearClase() { setShowCrearClase(false) }
    const [showEditarClase, setShowEditarClase] = useState<boolean>(false)
    function openEditarClase() { setShowEditarClase(true) }
    function closeEditarClase() { setShowEditarClase(false) }

    async function getAllClases() {
        if (sessionContext && sessionContext.session && sessionContext.permisos.includes("ver-clase")) {
            const headers = sessionHeaders()
            const res = await getAll("clase", headers, setClases)

        }
    }

    const pagination = useTablePagination(clases)
    useEffect(() => {
        getAllClases()
    }, [])
    return (
        <Grid container>
            {/*Modals */}
            {
                showCrearClase && staticEntities ?
                    <CrearClase
                        open={showCrearClase}
                        onClose={closeCrearClase}
                        getAllClases={getAllClases}
                        staticEntities={staticEntities}
                    />
                    : null
            }
            {
                showEditarClase && staticEntities && selectedClase ?
                    <EditarClase
                        open={showEditarClase}
                        onClose={closeEditarClase}
                        staticEntities={staticEntities}
                        getAllClases={getAllClases}
                        selectedClase={selectedClase}
                    />
                    : null
            }
            <Grid item xs={12}>
                <PanelToolBar>
                    <Button
                        sx={{ ...sxDefaultMargin() }}
                        onClick={openCrearClase}
                        variant="contained"
                        startIcon={<Add />}
                    >Crear</Button>
                </PanelToolBar>
            </Grid>
            <Grid item xs={12}>
                {/*Tabla */}
                <TableContainer sx={{ maxHeight: "60vh" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ minWidth: 400 }}>Clase</TableCell>
                                <TableCell sx={{ minWidth: 100 }}>Electivo</TableCell>
                                <TableCell sx={{ minWidth: 200 }}>Asignatura</TableCell>
                                <TableCell sx={{ minWidth: 200 }}>Curso</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                clases.length > 0 ?
                                    pagination.getCurrentPageData().map((clase, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{clase.clase}</TableCell>
                                            {
                                                clase.electivo ?
                                                    <TableCell>Si</TableCell>
                                                    :
                                                    <TableCell>No</TableCell>
                                            }
                                            <TableCell>{clase.asignatura.asignatura}</TableCell>
                                            <TableCell>{clase.curso.curso}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    onClick={() => {
                                                        setSelectedClase({
                                                            ...clase,
                                                            asignatura: clase.asignatura.id,
                                                            curso: clase.curso.id
                                                        })
                                                        openEditarClase()
                                                    }}
                                                >
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
            <Grid item xs={12}>
                <PaginationPanel
                    pagination={pagination}
                    data={clases}
                />
            </Grid>
        </Grid>
    )
}

