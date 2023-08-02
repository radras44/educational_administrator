"use client"


import { sessionHeaders } from "@/utils/axios/headers"
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
//icons
import { Add, Delete, Edit, FilterList } from "@mui/icons-material"
import { deleteRegister, getAll } from "@/utils/axios/reqUtils"
import { SelectedUsuario } from "@/utils/interfaces/interfaces"
import { useStaticEntities } from "@/utils/customHooks"
import { Clase, Usuario } from "@/utils/interfaces/entityInterfaces"
import { EditarUsuario } from "./editarUsuario"
import { EliminarUsuario } from "./eliminarUsuario"
import CrearUsuario from "./crearUsuario"
import PanelToolBar from "@/components/bars/panelToolBar"
import { sxDefaultMargin } from "@/sxStyles/sxStyles"
import FiltrarUsuario from "./filtrarUsuario"
import { DeleteModal } from "@/components/modal/deleteModal"

export default function AdminUsuario() {
    const staticEntities = useStaticEntities()
    const initialUsuarios = useRef<Usuario[]>([])
    const [usuarios, setUsuarios] = useState<Usuario[]>([])
    const [clases, setClases] = useState<Clase[]>([])
    const [usuarioToDelete, setUsuarioToDelete] = useState<number | null>(null)
    const [selectedUsuario, setSelectedUsuario] = useState<SelectedUsuario | null>(null)
    async function getAllUsuario() {
        const res = await getAll("usuario", sessionHeaders(), setUsuarios)
        if(res.status){
            initialUsuarios.current = res.result
        }
    }
    async function getClases() {
        await getAll("clase", sessionHeaders(), setClases)
    }

    //modals
    const [showEditarUsuario, setShowEditarUsuario] = useState<boolean>(false)
    function openEditarUsuario() { setShowEditarUsuario(true) }
    function closeEditarUsuario() { setShowEditarUsuario(false) }

    const [showEliminarUsuario, setShowEliminarUsuario] = useState<boolean>(false)
    function openEliminarUsuario() { setShowEliminarUsuario(true) }
    function closeEliminarUsuario() { setShowEliminarUsuario(false) }

    const [showCrearUsuario, setShowCrearUsuario] = useState<boolean>(false)
    function openCrearUsuario() { setShowCrearUsuario(true) }
    function closeCrearUsuario() { setShowCrearUsuario(false) }

    const [showfiltrarUsuario,setShowFiltrarUsuario] = useState<boolean>(false)
    function openFiltrarUsuario() {setShowFiltrarUsuario(true)}
    function closeFiltrarUsuario() {setShowFiltrarUsuario(false)}
    //carga de propiedades estaticas

    useEffect(() => {
        getAllUsuario()
        getClases()
    }, [])
    return (
        <Grid container>
            {/* modals */}
            {
                staticEntities && initialUsuarios ?
                <FiltrarUsuario
                open={showfiltrarUsuario}
                onClose={closeFiltrarUsuario}
                initialData={initialUsuarios.current}
                setCurrentData={setUsuarios}
                staticEntities={staticEntities}
                />
                :null
            }
            {
                showCrearUsuario && staticEntities ?
                    <CrearUsuario
                        open={showCrearUsuario}
                        onClose={closeCrearUsuario}
                        staticEntities={staticEntities}
                        getAllUsuario={getAllUsuario}
                    />
                    : null
            }
            {
                showEliminarUsuario && usuarioToDelete ?
                    <DeleteModal
                    open={showEliminarUsuario}
                    entityLabel="usuario"
                    onClose={closeEliminarUsuario}
                    title="Eliminar usuario"
                    warningMsg={"¿esta seguro de eliminar este usuario?\nTodos los registros relacionados tambien desapareceran"}
                    id={usuarioToDelete}
                    getAllRegisters={getAllUsuario}
                    />
                    : null
            }
            {
                selectedUsuario && showEditarUsuario && staticEntities ?
                    <EditarUsuario
                        open={showEditarUsuario}
                        onClose={closeEditarUsuario}
                        selectedUsuario={selectedUsuario}
                        staticEntities={staticEntities}
                        getAllUsuario={getAllUsuario}
                        clases={clases}
                    /> : null
            }
            <Grid item xs={12}>
                <PanelToolBar>
                    <Button
                        startIcon={<Add />}
                        variant="contained"
                        sx={{ ...sxDefaultMargin() }}
                        onClick={openCrearUsuario}
                    >Nuevo</Button>
                    <Button
                        startIcon={<FilterList />}
                        variant="text"
                        sx={{ ...sxDefaultMargin() }}
                        onClick={openFiltrarUsuario}
                    >Orden y filtros</Button>
                </PanelToolBar>
            </Grid>
            {/*tabla --> */}
            <Grid item xs={12}>
                {usuarios && usuarios.length > 0 ?
                    <TableContainer sx={{ maxHeight: "60vh" }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ minWidth: 250 }}>Nombre de usuario</TableCell>
                                    <TableCell sx={{ minWidth: 250 }}>Email</TableCell>
                                    <TableCell sx={{ minWidth: 150 }}>Rol</TableCell>
                                    <TableCell sx={{ minWidth: 150 }}>Curso</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    usuarios.map((usuario, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{usuario.nombre_de_usuario}</TableCell>
                                            <TableCell>{usuario.email}</TableCell>
                                            <TableCell>{usuario.rol?.rol}</TableCell>
                                            <TableCell>{usuario.curso?.curso}</TableCell>
                                            <TableCell align="center">
                                                <Button variant="text" onClick={() => {
                                                    setSelectedUsuario({
                                                        ...usuario,
                                                        rol: usuario.rol?.id,
                                                        genero: usuario.genero?.id,
                                                        curso: usuario.curso?.id,
                                                        clases: usuario.clases.map((clase: Clase) => clase.id)

                                                    })
                                                    openEditarUsuario()
                                                }}>
                                                    <Edit />
                                                </Button>
                                                <Button
                                                    color="error"
                                                    variant="text"
                                                    onClick={() => {
                                                        setUsuarioToDelete(usuario.id)
                                                        openEliminarUsuario()
                                                    }}
                                                ><Delete />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    : null
                }

            </Grid>
        </Grid>
    )
}


