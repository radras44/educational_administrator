"use client"

import { useSessionContext } from "@/app/providers/sessionProvider";
import { sxDefaultMargin } from "@/sxStyles/sxStyles";
import { sessionHeaders } from "@/utils/axios/headers";
import { getAllRelated } from "@/utils/axios/reqUtils";
import { useStaticEntities } from "@/utils/customHooks";
import { Evaluacion, SelectedEvaluacion } from "@/utils/interfaces/entityInterfaces";
import { Add, Checklist, Edit } from "@mui/icons-material";
import { Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useMemo, useState } from "react"
import { EditarNotas } from "./editarNotas";
import { CrearEvaluacion } from "./crearEvaluacion";
import { EditarEvaluacion } from "./editarEvaluacion";
import PanelPage from "@/components/panelPage";
import { useModal } from "@/hooks/hooks";


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
            await getAllRelated("evaluacion", "usuario", headers, sessionContext.usuario.id, setEvaluaciones)
        }
    }
    //modals
    const createModal = useModal()
    const editModal = useModal()
    const editNotesModal = useModal()

    function editEvaluation(evaluation: Evaluacion) {
        setSelectedEvaluacion({
            ...evaluation,
            clase: evaluation.clase ? evaluation.clase.id : null,
            usuario: evaluation.usuario ? evaluation.usuario.id : null
        })
        editModal.open()
    }

    function editEvaluationNotes(evaluation: Evaluacion) {
        setFullSelectedEvaluacoin(evaluation)
        editNotesModal.open()
    }

    useEffect(() => {
        getAllEvaluaciones()
    }, [])

    return (
        <PanelPage.CContainer>
            {
                editModal.show && selectedEvaluacion ?
                    <EditarEvaluacion
                        open={editModal.show}
                        onClose={editModal.close}
                        selectedEvaluacion={selectedEvaluacion}
                        getAllEvaluaciones={getAllEvaluaciones}
                        numero_de_evaluacionOptions={numbero_de_evaluacionOptions}
                    />
                    : null
            }
            {
                editNotesModal.show && fullSelectedEvaluacion ?
                    <EditarNotas
                        open={editNotesModal.show}
                        onClose={editNotesModal.close}
                        fullSelectedEvaluacion={fullSelectedEvaluacion}
                    />
                    : null
            }
            {
                createModal.show && staticEntities && sessionContext && sessionContext.usuario ?
                    <CrearEvaluacion
                        open={createModal.show}
                        onClose={createModal.close}
                        staticEntities={staticEntities}
                        getAllEvaluaciones={getAllEvaluaciones}
                        relatedClases={sessionContext.usuario.clases}
                        usuarioId={sessionContext.usuario.id}
                        numero_de_evaluacionOptions={numbero_de_evaluacionOptions}
                    />
                    : null
            }

            <PanelPage.ToolBar>
                <Button onClick={createModal.open}>
                    <Add />
                </Button>
            </PanelPage.ToolBar>
            <PanelPage.Table
                data={evaluaciones}
                options={[
                    { icon: <Edit />, action: editEvaluation },
                    { icon: <Checklist />, action: editEvaluationNotes }
                ]}
                keysToShow={["id", "evaluacion"]}
                keyLabels={["id", "evaluacion"]}
            />

        </PanelPage.CContainer>
    )
}



