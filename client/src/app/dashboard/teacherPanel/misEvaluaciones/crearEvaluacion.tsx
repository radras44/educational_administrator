import ActionModal from "@/components/actionModal"
import { TextFieldGenerator, SelectGenerator } from "@/components/form/DynamicInputs"

import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { createEntity, getErrorMsg } from "@/utils/axios/reqUtils"
import { Clase } from "@/utils/interfaces/entityInterfaces"
import { StaticEntitiesType, AttributesType } from "@/utils/interfaces/interfaces"
import { Save } from "@mui/icons-material"
import { Modal, Card, Grid, Box, Button, Typography } from "@mui/material"
import { useState } from "react"

interface CrearEvaluacionProps {
    open: boolean
    staticEntities: StaticEntitiesType
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    getAllEvaluaciones: Function
    relatedClases: Clase[]
    usuarioId: number
    numero_de_evaluacionOptions: { id: number, numero_de_evaluacion: number }[]
}

export function CrearEvaluacion(props: CrearEvaluacionProps) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [currentData, setCurrentData] = useState<any>({})
    const selectAttributes: AttributesType[] = [
        { label: "clase", inputType: "select", options: props.relatedClases },
        { label: "numero_de_evaluacion", inputType: "select", options: props.numero_de_evaluacionOptions }
    ]
    const textFieldAttributes: AttributesType[] = [
        { label: "evaluacion", inputType: "textField", options: props.relatedClases, required: true }
    ]
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const data = { ...currentData, usuario: props.usuarioId }
        const headers = sessionHeaders()
        const res = await createEntity("evaluacion", headers, data)
        if (res.status) {
            setErrorMsg(null)
            await props.getAllEvaluaciones()
            props.onClose({}, "backdropClick")

        }
        if (!res.status) {
            setErrorMsg(getErrorMsg(res.error))
        }
    }
    return (
        <Modal open={props.open} onClose={props.onClose}>
            <ActionModal.Content>
                <ActionModal.Title text="Crear evaluacion"/>
                <form onSubmit={handleSubmit}>
                    <ActionModal.FormContent>
                        <TextFieldGenerator
                            currentData={currentData}
                            setCurrentData={setCurrentData}
                            attributes={textFieldAttributes}
                        />
                        <SelectGenerator
                            currentData={currentData}
                            setCurrentData={setCurrentData}
                            attributes={selectAttributes}
                        />
                        <ActionModal.FormButtons>
                            <Button
                                color="success"
                                startIcon={<Save />}
                                variant="contained"
                                type="submit"
                            >Guardar</Button>
                            <Button
                                variant="contained"
                                onClick={() => { props.onClose({}, "backdropClick") }}
                            >Cancel</Button>
                        </ActionModal.FormButtons>
                        {errorMsg ? <Typography color="error" variant="h6" sx={{ whiteSpace: "pre-wrap" }}>{errorMsg}</Typography>
                            : null}
                    </ActionModal.FormContent>
                </form>
            </ActionModal.Content>

        </Modal>
    )
}