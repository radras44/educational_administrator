import ActionModal from "@/components/actionModal"
import { SelectGenerator, TextFieldGenerator } from "@/components/form/DynamicInputs"

import ModalTitle from "@/components/modal/modalTitle"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { createEntity, getErrorMsg } from "@/utils/axios/reqUtils"
import { AttributesType, StaticEntitiesType } from "@/utils/interfaces/interfaces"
import { Save } from "@mui/icons-material"
import { Card, Modal, Grid, Button, Typography } from "@mui/material"
import { useState } from "react"

interface editModalProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    getAllUsuario: Function
    staticEntities: StaticEntitiesType
}

export default function CrearUsuario(props: editModalProps) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [currentData, setCurrentData] = useState<any>({})

    const textFieldAttributes: AttributesType[] = [
        { label: "nombre_de_usuario", inputType: "textField", options: [], required: true },
        { label: "nombre", inputType: "textField", options: [] },
        { label: "apellido", inputType: "textField", options: [] },
        { label: "email", inputType: "textField", options: [], required: true },
        { label: "rut", inputType: "textField", options: [] }
    ]
    const selectAttributes: AttributesType[] = [
        { label: "rol", inputType: "select", options: props.staticEntities.roles! },
    ]

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const headers = sessionHeaders()
        const res = await createEntity("usuario", headers, currentData)
        if (!res.status) {
            setErrorMsg(getErrorMsg(res.error))
        }
        if (res.status) {
            setErrorMsg(null)
            await props.getAllUsuario()
            props.onClose({}, "backdropClick")
        }
    }

    return (
        <Modal open={props.open} onClose={props.onClose} sx={{ ...sxCenteredContainer() }}>
            <ActionModal.Content>
                <ActionModal.Title text="Crear usuario" />
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
                                startIcon={<Save />}
                                color="success"
                                variant="contained"
                                type="submit"
                            >Aplicar</Button>
                            <Button
                                variant="contained"
                                onClick={() => { props.onClose({}, "backdropClick") }}
                            >Voler</Button>
                        </ActionModal.FormButtons>
                        {
                            errorMsg ?
                                <Typography variant="body1">{errorMsg}</Typography>
                                : null
                        }
                    </ActionModal.FormContent>
                </form>
            </ActionModal.Content>
        </Modal>
    )
}