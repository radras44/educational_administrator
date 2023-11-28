import ActionModal from "@/components/actionModal"
import { TextFieldGenerator, SelectGenerator } from "@/components/form/DynamicInputs"

import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { createEntity, getErrorMsg } from "@/utils/axios/reqUtils"
import { StaticEntitiesType, AttributesType } from "@/utils/interfaces/interfaces"
import { Save } from "@mui/icons-material"
import { Modal, Grid, Button, Typography, Card } from "@mui/material"
import { useState } from "react"

interface CreateEstudianteProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    staticEntities: StaticEntitiesType
    getAllEstudiante: Function
}

export function CrearEstudiante(props: CreateEstudianteProps) {
    const [currentData, setCurrentData] = useState<any>({})
    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    const textFieldAttributes: AttributesType[] = [
        { label: "nombre_de_usuario", inputType: "textField", options: [], required: true },
        { label: "email", inputType: "textField", options: [], required: true },
        { label: "rut", inputType: "textField", options: [] }
    ]

    const selectAttributes: AttributesType[] = [
        { label: "curso", inputType: "select", options: props.staticEntities.cursos! }
    ]

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const headers = sessionHeaders()
        const res = await createEntity("estudiante", headers, currentData)
        if (!res.status) {

            setErrorMsg(getErrorMsg(res.error))
        } else {
            await props.getAllEstudiante()
            props.onClose({}, "backdropClick")
        }
    }

    return (
        <Modal open={props.open} onClose={props.onClose} sx={{ ...sxCenteredContainer() }} >
            <ActionModal.Content>
                <ActionModal.Title text="Editar" />
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

                        {/*botones */}
                        <ActionModal.FormButtons>
                            <Button type="submit" variant="contained" color="success">Crear</Button>
                            <Button onClick={() => { props.onClose({}, "backdropClick") }}
                                variant="contained"
                            >Volver</Button>
                        </ActionModal.FormButtons>
                        {
                            errorMsg ? <Typography color="error" variant="h6">{errorMsg}</Typography>
                                : null
                        }
                    </ActionModal.FormContent>
                </form>
            </ActionModal.Content>
        </Modal>
    )
}