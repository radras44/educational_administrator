"use client"

import { sessionHeaders } from "@/utils/axios/headers"
import { getAll } from "@/utils/axios/reqUtils"
import { SelectedRol } from "@/utils/interfaces/interfaces"
import { Edit, Delete, Add } from "@mui/icons-material"
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material"
import { useEffect, useState,useMemo } from "react"
import { EditarRol } from "./editarRol"
import CrearRol from "./crearRol"
import PanelToolBar from "@/components/bars/panelToolBar"
import { sxDefaultMargin } from "@/sxStyles/sxStyles"
import { Rol } from "@/utils/interfaces/entityInterfaces"
import { DeleteModal } from "@/components/modal/deleteModal"

export default function Adminrol() {
    const nivelOptions = useMemo(() => {
        const arr = []
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8,9,10]
        for (const element of numbers) {
            const obj = { id: element, nivel: element }
            arr.push(obj)
        }
        return arr
    }, [])
    const [selectedRol, setSelectedRol] = useState<SelectedRol|null>(null)
    const [roles, setRoles] = useState<any[] | null>([])
    const [permisos, setPermisos] = useState<any[] | null>([])
    const [rolToDelete,setRolToDelete] = useState<Rol|null>(null)
    async function getAllPermiso() {
        getAll("permiso", sessionHeaders(), setPermisos)
    }
    async function getAllRol() {
        getAll("rol", sessionHeaders(), setRoles)
    }
    //modals functions
    const [showEditModal, setShowEditModal] = useState<boolean>(false)
    function openEditModal() { setShowEditModal(true) }
    function closeEditModal() { setShowEditModal(false) }

    const [showCrearRol,setShowCrearRol] = useState<boolean>(false)
    function openCrearRol () {setShowCrearRol(true)}
    function closeCrearRol () {setShowCrearRol(false)}

    const [showEliminarRol,setShowEliminarRol] = useState<boolean>(false)
    function openEliminarRol () {setShowEliminarRol(true)}
    function closeEliminarRol () {setShowEliminarRol(false)} 

    useEffect(() => {
        getAllRol()
        getAllPermiso()
    }, [])
    return (
        <Grid container>
            {/* modals ---> */}
            {
                rolToDelete && showEliminarRol ?
                <DeleteModal
                open={showEliminarRol}
                onClose={closeEliminarRol}
                title="Eliminar rol"
                warningMsg="todos los registros con el rol eliminado se volveran registros con roles no asignados"
                getAllRegisters={getAllRol}
                id={rolToDelete.id}
                entityLabel="rol"
                /> 
                : null
            }
            {
                showCrearRol ?
                <CrearRol
                open={showCrearRol}
                onClose={closeCrearRol}
                getAllRoles={getAllRol}
                nivelOptions={nivelOptions}
                />
                : null
            }
            {selectedRol && showEditModal ?
                <EditarRol
                    open={showEditModal}
                    onClose={closeEditModal}
                    permisos={permisos}
                    selectedRol={selectedRol}
                    getAllRol={getAllRol}
                /> : null
            }
            {/* tabla ---> */}
            <Grid item xs={12}>
                <PanelToolBar>
                    <Button
                    startIcon={<Add/>}
                    variant="contained"
                    sx={{...sxDefaultMargin()}}  
                    onClick={openCrearRol}                  
                    >
                        Nuevo
                    </Button>
                </PanelToolBar>
            </Grid>
            <Grid item xs={12}>
                {roles && roles.length > 0 ?
                    <TableContainer sx={{minHeight:"60vh"}}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{minWidth:200}}>Rol</TableCell>
                                    <TableCell sx={{minWidth:50}}>Permisos</TableCell>
                                    <TableCell sx={{minWidth:50}}>Nivel</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{overflow : "auto"}}>
                                {roles.map((rol, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{rol.rol}</TableCell>
                                        <TableCell>{rol.permisos?.map((permiso: any) => permiso.permiso).length}</TableCell>
                                        <TableCell>{rol.nivel}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="text" onClick={(e) => {
                                                const permisosIdx = rol.permisos.map((permiso: { id: number }) => permiso.id)
                                                const selectedRolObj = {
                                                    permisosIdx: permisosIdx,
                                                    id: rol.id,
                                                    rol: rol.rol,
                                                    nivel: rol.nivel
                                                }
                                                setSelectedRol(selectedRolObj)
                                                openEditModal()
                                            }}>
                                                <Edit />
                                            </Button>
                                            <Button color="error" variant="text" onClick={()=>{
                                                setRolToDelete(rol)
                                                openEliminarRol()
                                            }}>
                                                <Delete />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    :
                    null
                }
            </Grid>
        </Grid>
    )
}

