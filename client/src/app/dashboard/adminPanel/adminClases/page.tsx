"use client"

import { useSessionContext } from "@/app/providers/sessionProvider";
import { sessionHeaders } from "@/utils/axios/headers";
import { getAll } from "@/utils/axios/reqUtils";
import { useStaticEntities } from "@/utils/customHooks";
import { Clase, SelectedClase } from "@/utils/interfaces/entityInterfaces";
import { Add, Edit } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { CrearClase } from "./crearClase";
import { EditarClase } from "./editarClase";
import PanelPage from "@/components/panelPage";
import { useModal } from "@/hooks/hooks";

export default function AdminClases() {
    const sessionContext = useSessionContext()
    const staticEntities = useStaticEntities()
    const [clases, setClases] = useState<Clase[]>([])
    const [selectedClase, setSelectedClase] = useState<SelectedClase | null>(null)
    //modals
    const createModal = useModal()
    const editModal = useModal()

    function editClass(classObj: Clase) {
        setSelectedClase({
            ...classObj,
            curso : classObj.curso ? classObj.curso.id : null,
            asignatura : classObj.asignatura ? classObj.asignatura.id : null
        })
        editModal.open()
    }

    async function getAllClases() {
        if (sessionContext && sessionContext.session && sessionContext.permisos.includes("ver-clase")) {
            const headers = sessionHeaders()
            await getAll("clase", headers, setClases)
        }
    }
    useEffect(() => {
        getAllClases()
    }, [])
    return (
        <>
            {
                createModal.show && staticEntities ?
                    <CrearClase
                        open={createModal.show}
                        onClose={createModal.close}
                        getAllClases={getAllClases}
                        staticEntities={staticEntities}
                    />
                    : null
            }
            {
                editModal.show && staticEntities && selectedClase ?
                    <EditarClase
                        open={editModal.show}
                        onClose={editModal.close}
                        staticEntities={staticEntities}
                        getAllClases={getAllClases}
                        selectedClase={selectedClase}
                    />
                    : null
            }
            <PanelPage.CContainer>
                <PanelPage.ToolBar>
                    <Button onClick={createModal.open}><Add /></Button>
                </PanelPage.ToolBar>
                {
                    clases.length > 0 ?
                        <PanelPage.Table
                            data={clases}
                            options={[
                                { icon: <Edit />, action: editClass }
                            ]}
                            keysToShow={["id", "clase"]}
                            keyLabels={["id","clase"]}
                        />
                        : null
                }
            </PanelPage.CContainer>
        </>
    )
}

