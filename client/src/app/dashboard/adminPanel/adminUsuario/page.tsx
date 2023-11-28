"use client"
import { sessionHeaders } from "@/utils/axios/headers"
import { Button, Grid } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
//icons
import { Add, Delete, Edit, FilterList } from "@mui/icons-material"
import { getAll } from "@/utils/axios/reqUtils"
import { useStaticEntities } from "@/utils/customHooks"
import { Clase, SelectedUsuario, Usuario } from "@/utils/interfaces/entityInterfaces"
import { EditarUsuario } from "./editarUsuario"
import CrearUsuario from "./crearUsuario"

import FiltrarUsuario from "./filtrarUsuario"
import { DeleteModal } from "@/components/modal/deleteModal"
import PanelPage from "@/components/panelPage"
import { useModal } from "@/hooks/hooks"

export default function AdminUsuario() {
    const staticEntities = useStaticEntities()
    const initialUsuarios = useRef<Usuario[]>([])
    const [users, setUsers] = useState<Usuario[]>([])
    const [clases, setClases] = useState<Clase[]>([])
    const [usuarioToDelete, setUsuarioToDelete] = useState<number | null>(null)
    const [selectedUsuario, setSelectedUsuario] = useState<SelectedUsuario | null>(null)
    async function getAllUsuario() {
        const res = await getAll("usuario", sessionHeaders(), setUsers)
        if (res.status) {
            initialUsuarios.current = res.result
        }
    }
    async function getClases() {
        await getAll("clase", sessionHeaders(), setClases)
    }

    //modals
    const editModal = useModal()
    const createModal = useModal()
    const deleteModal = useModal()
    const filtersModal = useModal() 
    //carga de propiedades estaticas

    function editUser (user : Usuario) {
        setSelectedUsuario({
            ...user,
            rol: user.rol ? user.rol.id : null,
            genero: user.genero ? user.genero.id : null,
            curso: user.curso ? user.curso.id : null,
            clases: user.clases && user.clases.length ? 
            user.clases.map((clase: Clase) => clase.id) : []
        })
        editModal.open()
    }

    function deleteUser (user : Usuario) {
        setUsuarioToDelete(user.id)
        deleteModal.open()
    }

    useEffect(() => {
        getAllUsuario()
        getClases()
    }, [])
    return (
        <PanelPage.CContainer>
            {
                staticEntities && initialUsuarios && filtersModal.show?
                    <FiltrarUsuario
                        open={filtersModal.show}
                        onClose={filtersModal.close}
                        initialData={initialUsuarios.current}
                        setCurrentData={setUsers}
                        staticEntities={staticEntities}
                    />
                    : null
            }
            {
                createModal.show && staticEntities ?
                    <CrearUsuario
                        open={createModal.show}
                        onClose={createModal.close}
                        staticEntities={staticEntities}
                        getAllUsuario={getAllUsuario}
                    />
                    : null
            }
            {
                deleteModal.show && usuarioToDelete ?
                    <DeleteModal
                        open={deleteModal.show}
                        entityLabel="usuario"
                        onClose={deleteModal.close}
                        title="Eliminar usuario"
                        warningMsg={"¿esta seguro de eliminar este usuario?\nTodos los registros relacionados tambien desapareceran"}
                        id={usuarioToDelete}
                        getAllRegisters={getAllUsuario}
                    />
                    : null
            }
            {
                selectedUsuario && editModal.show && staticEntities ?
                    <EditarUsuario
                        open={editModal.show}
                        onClose={editModal.close}
                        selectedUsuario={selectedUsuario}
                        staticEntities={staticEntities}
                        getAllUsuario={getAllUsuario}
                        clases={clases}
                    /> : null
            }
            <PanelPage.ToolBar>
                <Button onClick={createModal.open}><Add/></Button>
                <Button onClick={filtersModal.open}><FilterList/></Button>
            </PanelPage.ToolBar>

            {/*tabla --> */}
            <Grid item xs={12}>
                {users && users.length > 0 ?
                  <PanelPage.Table
                  data={users}
                  options={[
                    {icon:<Edit/>,action : editUser},
                    {icon:<Delete/>,action : deleteUser}
                  ]}
                  keysToShow={["id","nombre_de_usuario"]}
                  keyLabels={["id","nombre_de_usuario"]}
                  />
                    : null
                }
            </Grid>
        </PanelPage.CContainer>
    )
}


