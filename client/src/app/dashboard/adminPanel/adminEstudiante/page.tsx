"use client"

import { useSessionContext } from "@/app/providers/sessionProvider"
import { sxDefaultMargin } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { getAll } from "@/utils/axios/reqUtils"
import { useStaticEntities, useTablePagination } from "@/utils/customHooks"
import { SelectedEstudiante } from "@/utils/interfaces/interfaces"
import { Add, Delete, Edit, FilterList, ImportContacts, ImportExport, NavigateBefore, NavigateNext, Person } from "@mui/icons-material"
import { Box, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useMemo, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { EditarEstudiante } from "./EditarEstudiante"
import { CrearEstudiante } from "./CrearEstudiante"
import { Sincronizar } from "./sincronizar"
import FiltrarEstudiantes from "./filtrarEstudiantes"
import PanelToolBar from "@/components/bars/panelToolBar"
import { Estudiante } from "@/utils/interfaces/entityInterfaces"
import { Certificado } from "@/utils/certificado"
import PaginationPanel from "@/components/listAndTables/paginationPanel"
import { DeleteModal } from "@/components/modal/deleteModal"


export default function AdminEstudiante() {
    const sessionContext = useSessionContext()
    const staticEntities = useStaticEntities()
    const initialEstudiantes = useRef<Estudiante[]>([])
    const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
    const certificado = useMemo(() => {
        if (staticEntities) {
            console.log("certificado instanciado")
            const certificado = new Certificado(staticEntities.asignaturas)
            return certificado
        }
    }, [staticEntities])

    //paginacion
    const pagination = useTablePagination(estudiantes)

    const [selectedEstudiante, setSelectedEstudiante] = useState<SelectedEstudiante | null>(null)
    const [estudianteToDelete,setEstudianteToDelete] = useState<Estudiante | null>(null)
    //modals
    const [showEditarEstudiante, setShowEditarEstudiante] = useState<boolean>(false)
    function openEditarEstudiante() { setShowEditarEstudiante(true) }
    function closeEditarEstudiante() { setShowEditarEstudiante(false) }

    const [showCrearEstudiante, setShowCrearEstudiante] = useState<boolean>(false)
    function openCrearEstudiante() { setShowCrearEstudiante(true) }
    function closeCrearEstudiante() { setShowCrearEstudiante(false) }

    const [showSincronizar, setShowSincronizar] = useState<boolean>(false)
    function openSincronizar() { setShowSincronizar(true) }
    function closeSincronizar() { setShowSincronizar(false) }

    const [showFilterModal, setShowFiltrarEstudiantes] = useState<boolean>(false)
    function openFiltrarEstudiantes() { setShowFiltrarEstudiantes(true) }
    function closeFiltrarEstudiantes() { setShowFiltrarEstudiantes(false) }

    const [showEliminarEstudiante,setShowEliminarEstudiante] = useState<boolean>(false)
    function openEliminarEstudiante () {setShowEliminarEstudiante(true)}
    function closeEliminarEstudiante () {setShowEliminarEstudiante(false)}

    //fetching functions
    async function getAllEstudiante() {
        const headers = sessionHeaders()
        if (sessionContext.permisos.includes("ver-estudiante")) {
            const res = await getAll("estudiante", headers, setEstudiantes)
            if (res && res.status) {
                initialEstudiantes.current = res.result
            }
        }
    }

    useEffect(() => {
        getAllEstudiante()
    }, [])
    return (
        <Grid container>
            {
                showEliminarEstudiante && estudianteToDelete ?
                <DeleteModal
                open={showEliminarEstudiante}
                id={estudianteToDelete.id}
                onClose={closeEliminarEstudiante}
                title={"Eliminar estudiante"}
                warningMsg={"¿esta seguro de eliminar este estudiante?"}
                getAllRegisters={getAllEstudiante}
                entityLabel="estudiante"
                />
                : null
            }
            {staticEntities ? (
                <FiltrarEstudiantes
                    initialData={initialEstudiantes.current}
                    setFilteredData={setEstudiantes}
                    open={showFilterModal}
                    onClose={closeFiltrarEstudiantes}
                    staticEntities={staticEntities}
                    setCurrentPage={pagination.setCurrentPage}
                />
            ) : null}
            {showSincronizar && staticEntities ? (
                <Sincronizar
                    open={showSincronizar}
                    onClose={closeSincronizar}
                    staticEntities={staticEntities}
                    estudiantes={initialEstudiantes.current}
                    getAllEstudiante={getAllEstudiante}
                />
            ) : null}
            {selectedEstudiante && showEditarEstudiante && staticEntities ? (
                <EditarEstudiante
                    open={showEditarEstudiante}
                    onClose={closeEditarEstudiante}
                    staticEntities={staticEntities}
                    selectedEstudiante={selectedEstudiante}
                    getAllEstudiante={getAllEstudiante}
                />
            ) : null}
            {showCrearEstudiante && staticEntities ? (
                <CrearEstudiante
                    open={showCrearEstudiante}
                    onClose={closeCrearEstudiante}
                    staticEntities={staticEntities}
                    getAllEstudiante={getAllEstudiante}
                />
            ) : null}
            <Grid item xs={12} >
                {/*Panel */}
                <PanelToolBar>
                    <Button
                        onClick={openCrearEstudiante}
                        startIcon={<Add />}
                        variant="contained"
                        sx={{ ...sxDefaultMargin() }}
                    >
                        Nuevo
                    </Button>
                    <Button sx={{ ...sxDefaultMargin() }} onClick={openSincronizar} startIcon={<ImportContacts />}>
                        Sincronizar
                    </Button>
                    <Button sx={{ ...sxDefaultMargin() }} onClick={openFiltrarEstudiantes} startIcon={<FilterList />}>
                        Orden y Filtros
                    </Button>
                </PanelToolBar>
            </Grid>
            {/*Tabla */}
            <Grid item xs={12}>
                {estudiantes.length > 0 ? (
                    <TableContainer sx={{ height: '60vh' }}>
                        <Table stickyHeader>
                            <TableHead >
                                <TableRow >
                                    <TableCell sx={{ minWidth: 25 }}></TableCell>
                                    <TableCell sx={{ minWidth: 25 }}>DBId</TableCell>
                                    <TableCell sx={{ minWidth: 260 }}>Nombre de usuario</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Curso</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>Rut</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    pagination.getCurrentPageData().map((estudiante, index) => (
                                        <TableRow key={index}>
                                            <TableCell align="center">{pagination.getItemIndex(index)}</TableCell>
                                            <TableCell>{estudiante.id}</TableCell>
                                            <TableCell>{estudiante.nombre_de_usuario}</TableCell>
                                            <TableCell>{estudiante.curso?.curso}</TableCell>
                                            <TableCell>{estudiante.rut}</TableCell>
                                            <TableCell align="center">
                                                <Box>
                                                    <Link href={`/dashboard/perfil/estudiante/${estudiante.id}`}>
                                                        <Button>
                                                            <Person />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        onClick={() => {
                                                            const data = {
                                                                ...estudiante,
                                                                genero: estudiante.genero?.id,
                                                                curso: estudiante.curso?.id
                                                            };
                                                            setSelectedEstudiante(data);
                                                            openEditarEstudiante();
                                                        }}
                                                    >
                                                        <Edit />
                                                    </Button>
                                                    <Button color="error" onClick={()=>{
                                                         setEstudianteToDelete(estudiante)
                                                         openEliminarEstudiante()
                                                    }}>
                                                        <Delete />
                                                    </Button>
                                                    <Button onClick={() => {
                                                        if (certificado) {
                                                            certificado.certificadoDeNotas(estudiante)
                                                        }
                                                    }}>
                                                        <ImportExport />
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : null}
            </Grid>
            <Grid item xs={12}>
                <PaginationPanel
                    pagination={pagination}
                    data={estudiantes}
                />
            </Grid>
        </Grid>
    );
}



