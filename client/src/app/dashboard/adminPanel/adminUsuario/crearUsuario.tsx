import { SelectGenerator, TextFieldGenerator } from "@/components/form/DynamicInputs"
import ModalButtons from "@/components/modal/modalButtons"
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
        <Modal open={props.open} onClose={props.onClose} sx={{...sxCenteredContainer()}}>
            <Card sx={{ ...sxModalContainer() }}>
                <form onSubmit={handleSubmit}>
                    <Grid container>
                        <Grid item xs={12}>
                            <ModalTitle title="Crear usuario" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextFieldGenerator
                                currentData={currentData}
                                setCurrentData={setCurrentData}
                                attributes={textFieldAttributes}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <SelectGenerator
                                currentData={currentData}
                                setCurrentData={setCurrentData}
                                attributes={selectAttributes}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ModalButtons>
                                <Button
                                    sx={{ ...sxDefaultMargin() }}
                                    startIcon={<Save />}
                                    variant="contained"
                                    type="submit"
                                >Guardar</Button>
                                <Button
                                    sx={{ ...sxDefaultMargin() }}
                                    variant="outlined"
                                    color="error"
                                    onClick={() => { props.onClose({}, "backdropClick") }}
                                >Cancel</Button>
                            </ModalButtons>
                            {
                                errorMsg ?
                                    <Typography variant="body1">{errorMsg}</Typography>
                                    : null
                            }
                        </Grid>
                    </Grid>
                </form>
            </Card>
        </Modal>
    )
}