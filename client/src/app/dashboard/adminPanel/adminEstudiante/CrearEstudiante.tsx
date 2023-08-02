import { TextFieldGenerator, SelectGenerator } from "@/components/form/DynamicInputs"
import ModalButtons from "@/components/modal/modalButtons"
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
            <Card sx={{...sxModalContainer()}}>
                <form onSubmit={handleSubmit}>
                    <Grid container sx={{ maxWidth: 800 }}>
                        <Grid item xs={12}>
                            <ModalTitle title="Agregar estudiante" />
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
                            {/*botones */}
                            <ModalButtons>
                                <Button
                                    startIcon={<Save />}
                                    variant="contained"
                                    type="submit"
                                    sx={{ ...sxDefaultMargin() }}
                                >Guardar</Button>
                                <Button
                                    color="error"
                                    variant="outlined"
                                    onClick={() => {
                                        props.onClose({}, "backdropClick")
                                    }}
                                    sx={{ ...sxDefaultMargin() }}
                                >Cancelar</Button>
                            </ModalButtons>
                            {
                                errorMsg ?
                                    <Typography sx={{ whiteSpace: "pre-wrap" }} color="error" variant="h6">{errorMsg}</Typography>
                                    : null
                            }
                        </Grid>
                    </Grid>
                </form>
            </Card>
        </Modal>
    )
}