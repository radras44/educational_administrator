"use client"

import { sessionHeaders } from "@/utils/axios/headers"
import { getAll } from "@/utils/axios/reqUtils"

import { Edit, Delete, Add } from "@mui/icons-material"
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useEffect, useState, useMemo } from "react"
import { EditarRol } from "./editarRol"
import CrearRol from "./crearRol"

import { sxDefaultMargin } from "@/sxStyles/sxStyles"
import { Rol, SelectedRol } from "@/utils/interfaces/entityInterfaces"
import { DeleteModal } from "@/components/modal/deleteModal"
import PanelPage from "@/components/panelPage"
import { useModal } from "@/hooks/hooks"

export default function Adminrol() {
    const nivelOptions = useMemo(() => {
        const arr = []
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        for (const element of numbers) {
            const obj = { id: element, nivel: element }
            arr.push(obj)
        }
        return arr
    }, [])
    const [selectedRol, setSelectedRol] = useState<SelectedRol | null>(null)
    const [roles, setRoles] = useState<any[] | null>([])
    const [permisos, setPermisos] = useState<any[] | null>([])
    const [rolToDelete, setRolToDelete] = useState<Rol | null>(null)
    async function getAllPermiso() {
        getAll("permiso", sessionHeaders(), setPermisos)
    }
    async function getAllRol() {
        getAll("rol", sessionHeaders(), setRoles)
    }
    //modals functions
    const editModal = useModal()
    const createModal = useModal()
    const deleteModal = useModal()

    function deleteRole(role: Rol) {
        setRolToDelete(role)
        deleteModal.open()
    }

    function editRole(role: Rol) {
        const permisosIdx = role.permisos.map((permiso: { id: number }) => permiso.id)
        setSelectedRol({
            ...role,
            permisosIdx: permisosIdx
        })
        editModal.open()
    }

    useEffect(() => {
        getAllRol()
        getAllPermiso()
    }, [])
    return (
        <PanelPage.CContainer>
            {/* modals ---> */}
            {
                rolToDelete && deleteModal.show ?
                    <DeleteModal
                        open={deleteModal.show}
                        onClose={deleteModal.close}
                        title="Eliminar rol"
                        warningMsg="todos los registros con el rol eliminado se volveran registros con roles no asignados"
                        getAllRegisters={getAllRol}
                        id={rolToDelete.id}
                        entityLabel="rol"
                    />
                    : null
            }
            {
                createModal.show ?
                    <CrearRol
                        open={createModal.show}
                        onClose={createModal.close}
                        getAllRoles={getAllRol}
                        nivelOptions={nivelOptions}
                    />
                    : null
            }
            {selectedRol && editModal.show ?
                <EditarRol
                    open={editModal.show}
                    onClose={editModal.close}
                    permisos={permisos}
                    selectedRol={selectedRol}
                    getAllRol={getAllRol}
                /> : null
            }
            {/* tabla ---> */}
            <PanelPage.ToolBar>
                <Button onClick={createModal.open}><Add /></Button>
            </PanelPage.ToolBar>
            {
                roles && roles.length > 0 ?
                    <PanelPage.Table
                        data={roles}
                        options={[
                            { icon: <Edit />, action: editRole },
                            { icon: <Delete />, action: deleteRole }
                        ]}
                        keysToShow={["id", "rol"]}
                        keyLabels={["id", "rol"]}
                    /> : null
            }
        </PanelPage.CContainer>

    )
}

