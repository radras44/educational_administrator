import ActionModal from "@/components/actionModal"
import { SelectGenerator, TextFieldGenerator } from "@/components/form/DynamicInputs"
import { sxCenteredContainer, sxDefaultMargin, sxModalContainer } from "@/sxStyles/sxStyles"
import { sessionHeaders } from "@/utils/axios/headers"
import { createEntity, getErrorMsg } from "@/utils/axios/reqUtils"
import { AttributesType } from "@/utils/interfaces/interfaces"
import { Cancel, Save } from "@mui/icons-material"
import { Button, ButtonGroup, Card, Grid, Modal, Typography } from "@mui/material"
import { useState } from "react"

interface CrearRolProps {
    open: boolean
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void
    getAllRoles: Function
    nivelOptions: { id: number, nivel: number }[]
}


export default function CrearRol(props: CrearRolProps) {
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [currentData, setCurrentData] = useState<any>({})
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const res = await createEntity("rol", sessionHeaders(), currentData)
        if (!res.status) {
            setErrorMsg(getErrorMsg(res.error))
        }
        if (res.status) {
            setErrorMsg(null)
            await props.getAllRoles()
            props.onClose({}, "backdropClick")
        }
    }

    const textFieldAttributes: AttributesType[] = [
        { label: "rol", inputType: "textField", options: [], required: true }
    ]
    const selectAttributes: AttributesType[] = [
        { label: "nivel", inputType: "select", options: props.nivelOptions, required: true }
    ]
    return (
        <Modal open={props.open} onClose={props.onClose} >
            <ActionModal.Content>
                <ActionModal.Title text="Crear rol" />
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
                                variant="contained"
                                startIcon={<Save />}
                                type="submit"
                            >Guardar
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Cancel />}
                                onClick={() => {
                                    props.onClose({}, 'backdropClick');
                                }}
                            >Volver
                            </Button>
                        </ActionModal.FormButtons>

                        {
                            errorMsg ?
                                <Typography variant="body1" color="error">{errorMsg}</Typography>
                                : null
                        }

                    </ActionModal.FormContent>
                </form>
            </ActionModal.Content>




        </Modal>
    )
}